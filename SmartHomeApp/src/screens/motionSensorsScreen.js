import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button, ActivityIndicator, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import DeleteDevice from '../components/deleteDevice';
import Notification from '../components/notification';
import MQTTConnection from '../components/mqttClient';
import globalStore from '../components/globalStore';
import globalStyle from '../styles/globalStyle';

const MotionSensorScreen = (props) => {
  const {colors} = useTheme(); // for non paper components so paper theme colors can be used
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [activeSensors, setActiveSensors] = useState([]); // array used for sensors that are currently active

  // activates/deactivates a sensor
  const activateDeactivate = (serialChannel) => {
    try {
      if (activeSensors.indexOf(serialChannel) > -1) {
        globalStore.motionClient.publish(
          '18026172/motion/deactivate',
          serialChannel.toString(),
        );
        // remove sensor from activeSensors array
        setActiveSensors(
          activeSensors.filter((item) => item !== serialChannel),
        );
      } else {
        globalStore.motionClient.publish(
          '18026172/motion/activate',
          serialChannel.toString(),
        );
        // add sensor to activeSensors array
        setActiveSensors([...activeSensors, serialChannel]);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  };

  // deletes device from database and device list
  const deleteDevice = async (deviceId) => {
    try {
      await DeleteDevice(deviceId);
      await getDeviceList();
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  };

  // checks state of each sensor
  const checkSensors = useCallback(async (data) => {
    try {
      let message = '';
      // loop through each sensor in list and build message (with serial number and channel of each sensor) to publish to check state of the sensor
      Object.keys(data).forEach((key) => {
        message = `${
          message +
          data[key].device_serial_number.toString() +
          data[key].device_channel.toString()
        }-`;
      });

      // after a connection is made to the broker a call is made to retrieve all locks from the database
      const onConnect = async () => {
        // when message arrives with active lights they are pushed to the activeLights array
        const onMessageArrived = (_message) => {
          if (_message.destinationName === '18026172/motion/motion') {
            Object.keys(data).forEach((key) => {
              if (
                data[key].device_serial_number.toString() +
                  data[key].device_channel.toString() ===
                _message.payloadString
              ) {
                Notification(
                  `Motion in your: ${data[key].device_room}`,
                  'Motion Sensor',
                  true,
                  true,
                  `Sensor: ${data[key].device_name} detected motion!`,
                  'Motion Sensor',
                );
              }
            });
          } else {
            const states = _message.payloadString.split('-');
            const activeSerialArray = [];

            // loop through the received state of each light
            Object.keys(data).forEach((key) => {
              if (states[key] === 'true') {
                // if state is true the light is on so it is added to activeSerialArray array
                activeSerialArray.push(
                  data[key].device_serial_number.toString() +
                    data[key].device_channel.toString(),
                );
                // if light dosent exists/is disconnected
              } else if (states[key] === '1.0') {
                ToastAndroid.show(
                  `Device with serial number: ${data[key].device_serial_number} and Channel number: ${data[key].device_channel}  is not connected.`,
                  ToastAndroid.SHORT,
                );
              }
            });

            setActiveSensors(activeSerialArray); // update activeLights array
            setIsLoading(false);
          }
        };
        // set on message arrived callback
        globalStore.motionClient.onMessageArrived = onMessageArrived;

        globalStore.motionClient.subscribe('18026172/motion/motion');
        // subscribe so that when message arrives we receive all currently active lights
        globalStore.motionClient.subscribe('18026172/motion/checked');
        // publish message with every lights serial number and channel so the state can be checked
        globalStore.motionClient.publish('18026172/motion/check', message);
      };
      // set on connect callback
      globalStore.motionClient.onConnect = onConnect;

      // connect to mqtt broker
      globalStore.motionClient.connect('test.mosquitto.org', 8080);
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  }, []);

  // get list of all locks
  const getDeviceList = useCallback(async () => {
    try {
      const data = await ListDevices('Sensor');
      // if returned data is not empty then set list state and check all locks
      if (!(typeof data === 'undefined')) {
        setDeviceList([]);
        setDeviceList(data);
        checkSensors(data);
      } else {
        setDeviceList([]);
        setIsLoading(false);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  }, [checkSensors]);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        // try to disconnect client to avoid multiple client instances
        try {
          globalStore.motionClient.close();
        } catch (e) {
          // console.log(e);
        }

        // create mqtt client for doorbell
        globalStore.motionClient = new MQTTConnection();

        // after a connection is made to the broker a call is made to retrieve all locks from the database
        const onConnect = async () => {
          await getDeviceList();
        };
        // set on connect callback
        globalStore.motionClient.onConnect = onConnect;

        // connect to mqtt broker
        globalStore.motionClient.connect('test.mosquitto.org', 8080);
      } catch (e) {
        ToastAndroid.show(
          'An Unexpected Error Has Occured',
          ToastAndroid.SHORT,
        );
      }
    });

    return unsubscribe;
  }, [getDeviceList, navigation]);

  if (isLoading === true) {
    return (
      <View style={globalStyle.flexContainer}>
        <ActivityIndicator style={globalStyle.activityIndicator} animating />
      </View>
    );
  }
  return (
    <View style={globalStyle.flexContainer}>
      <View style={globalStyle.textInputView}>
        <FlatList
          data={deviceList}
          renderItem={({item}) => (
            <View
              style={[
                globalStyle.listView,
                {
                  backgroundColor: colors.accent,
                  borderColor: colors.primary,
                },
              ]}>
              <View style={globalStyle.textView}>
                <Text style={globalStyle.text}>
                  {`${item.device_room.toString()} ${item.device_name.toString()}`}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="delete"
                  size={40}
                  color="red"
                  onPress={() => deleteDevice(item.device_id.toString())}
                  style={{paddingRight: '4%'}}
                />
                <Icon
                  name={
                    activeSensors.indexOf(
                      item.device_serial_number.toString() +
                        item.device_channel.toString(),
                    ) > -1
                      ? 'motion-sensor'
                      : 'motion-sensor-off'
                  }
                  size={40}
                  color={colors.text}
                  onPress={() =>
                    activateDeactivate(
                      item.device_serial_number.toString() +
                        item.device_channel.toString(),
                    )
                  }
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.device_id.toString()}
        />
      </View>
      <View style={globalStyle.submitButtonView}>
        <Button
          role="button"
          mode="contained"
          contentStyle={globalStyle.buttonContent}
          style={globalStyle.submitButton}
          onPress={() =>
            props.navigation.navigate('homeStackNavigator', {
              screen: 'Add Device',
              params: {deviceType: 'Sensor'},
            })
          }>
          <Text>Add Sensor</Text>
        </Button>
      </View>
    </View>
  );
};

MotionSensorScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default MotionSensorScreen;
