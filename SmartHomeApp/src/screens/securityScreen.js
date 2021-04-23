import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import {Client, Message} from 'react-native-paho-mqtt';
import ListDevices from '../components/listDevices';

const SecurityScreen = (props) => {
  const [deviceList, setDeviceList] = useState([]);
  const {navigation} = props;

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    setDeviceList(data);
  }, []);

  const mqtt = (serialNumber) => {
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
      clientId: '18026172-publish',
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

    // connect the client
    client
      .connect()
      .then(() => {
        // Once a connection has been made, make a subscription and send a message.
        console.log('onConnect');
        return client.subscribe('18026172/servo');
      })
      .then(() => {
        const message = new Message(serialNumber);
        message.destinationName = '18026172/servo';
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

  console.log(deviceList);

  return (
    <View>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <View>
            <Button role="button" mode="contained" onPress={() => mqtt()}>
              <Text>{item.serial_number.toString()}</Text>
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
