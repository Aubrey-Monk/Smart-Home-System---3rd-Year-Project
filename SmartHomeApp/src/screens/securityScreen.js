import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import {Message, Client} from 'react-native-paho-mqtt';
import ListDevices from '../components/listDevices';
import mqttClient from '../components/mqttClient';

const SecurityScreen = (props) => {
  const [deviceList, setDeviceList] = useState([]);
  const {navigation} = props;

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    setDeviceList(data);
  }, []);

  const publish = (serialNumber, topic) => {
    // Set up an in-memory alternative to global localStorage
    const myStorage = {
      setItem: (key, item) => {
        myStorage[key] = item;
      },
      getItem: (key) => myStorage[key],
      removeItem: (key) => {
        delete myStorage[key];
      },
    };

    // Create a client instance
    const client = new Client({
      uri: 'ws://test.mosquitto.org:8080/ws',
      clientId: '18026172_APP_Client',
      storage: myStorage,
    });

    // set event handlers
    client.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
      }
    });
    client.on('messageReceived', (message) => {
      console.log(message.payloadString);
    });

    client
      .connect()
      .then(() => {
        const message = new Message(serialNumber);
        message.destinationName = topic;
        client.send(message);
      })
      .catch((responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log(`onConnectionLost:${responseObject.errorMessage}`);
        }
      });
  };

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // screen is focused
      await getDeviceList();
    });

    return unsubscribe;
  }, [getDeviceList, navigation]);

  // console.log(deviceList);

  return (
    <View>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <View>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                publish(item.serial_number.toString(), '18026172/lock/lock')
              }>
              <Text>{item.serial_number.toString()}</Text>
              <Text> Lock</Text>
            </Button>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                publish(item.serial_number.toString(), '18026172/lock/unlock')
              }>
              <Text>{item.serial_number.toString()}</Text>
              <Text> UnLock</Text>
            </Button>
          </View>
        )}
        keyExtractor={(item) => item.serial_number.toString()}
      />
      <Button
        role="button"
        mode="contained"
        onPress={() =>
          props.navigation.navigate('homeStackNavigator', {
            screen: 'Add Device',
          })
        }>
        <Text>Add Device</Text>
      </Button>
    </View>
  );
};

SecurityScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default SecurityScreen;
