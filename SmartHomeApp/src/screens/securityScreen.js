import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import MQTT from 'sp-react-native-mqtt';
import ListDevices from '../components/listDevices';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import mqttClient from '../components/mqttClient';

const SecurityScreen = (props) => {
  const {navigation} = props;

  const [deviceList, setDeviceList] = useState([]);

  const sp = (serialNumber, topic) => {
    /* create mqtt client */
    MQTT.createClient({
      uri: 'mqtt://test.mosquitto.org:1883',
      clientId: 'your_client_id',
    })
      .then((client) => {
        client.on('closed', () => {
          // console.log('mqtt.event.closed');
        });

        client.on('error', (msg) => {
          // console.log('mqtt.event.error', msg);
        });

        client.on('message', (msg) => {
          // console.log('mqtt.event.message', msg);
        });

        client.on('connect', () => {
          console.log('connected');
          client.subscribe('/data', 0);
          client.publish('/data', 'test', 0, false);
        });

        client.connect();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    setDeviceList(data);
    const arr = [];
    Object.keys(data).forEach((key) => {
      arr.push(data[key]);
      // console.log(data[key].serial_number);
      // sp(data[key].serial_number, '18026172/lock/check');
    });
  }, []);

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
                sp(item.serial_number.toString(), '18026172/lock/lock')
              }>
              <Text>{item.serial_number.toString()}</Text>
              <Text> Lock</Text>
            </Button>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                sp(item.serial_number.toString(), '18026172/lock/unlock')
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
