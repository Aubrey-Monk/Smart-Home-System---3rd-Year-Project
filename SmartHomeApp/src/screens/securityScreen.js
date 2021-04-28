import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import ListDevices from '../components/listDevices';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SecurityScreen = (props) => {
  const {navigation} = props;

  const [deviceList, setDeviceList] = useState([]);

  const mqtt = async (topic, message) => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });

    function onConnect() {
      console.log('onConnect');
      client.publish(topic, message, 0, false);
    }

    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage);
      }
    }

    function onMessageArrived(message) {
      console.log('onMessageArrived:' + message.payloadString);
    }

    function onError(e) {
      console.log('error');
      console.log(e);
    }

    // eslint-disable-next-line no-undef
    const client = new Paho.MQTT.Client(
      'test.mosquitto.org',
      8080,
      '18026272_APP_Client',
    );
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({onSuccess: onConnect, onFailure: onError, useSSL: false});
  };

  const checkLocks = useCallback(async (data) => {
    let message = '';
    Object.keys(data).forEach((key) => {
      message = `${message + data[key].serial_number.toString()}-`;
    });

    mqtt('18026172/lock/check', message);
  }, []);

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    setDeviceList(data);
    checkLocks(data);
  }, [checkLocks]);

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
                mqtt('18026172/lock/lock', item.serial_number.toString())
              }>
              <Text>{item.serial_number.toString()}</Text>
              <Text> Lock</Text>
            </Button>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                mqtt('18026172/lock/unlock', item.serial_number.toString())
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
