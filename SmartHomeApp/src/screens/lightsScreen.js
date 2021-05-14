import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button, ActivityIndicator, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import DeleteDevice from '../components/deleteDevice';
import MQTTConnection from '../components/mqttClient';
import globalStyle from '../styles/globalStyle';

const LightsScreen = (props) => {
  const {colors} = useTheme(); // for non paper components so paper theme colors can be used
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());
  const [activeLights, setActiveLights] = useState([]); // array used for lights that are currently active

  // turns a light on or off
  const onOff = (serialNumber, channel) => {
    try {
      // checks if light is already on or not by checking activeLights array
      if (activeLights.indexOf(serialNumber + channel) > -1) {
        mqttClient.publish(
          '18026172/light/off',
          serialNumber.toString() + channel.toString(),
        );
        // remove light from activeLights array
        setActiveLights(
          activeLights.filter((item) => item !== serialNumber + channel),
        );
      } else {
        mqttClient.publish(
          '18026172/light/on',
          serialNumber.toString() + channel.toString(),
        );
        // add light to activeLights array
        setActiveLights([...activeLights, serialNumber + channel]);
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

  // checks state of each light
  const checkLights = useCallback(
    async (data) => {
      try {
        let message = '';

        // loop through each light in list and build message (with serial number and channel of each light) to publish to check state of the light
        Object.keys(data).forEach((key) => {
          message = `${
            message +
            data[key].device_serial_number.toString() +
            data[key].device_channel.toString()
          }-`;
        });

        // when message arrives with active lights they are pushed to the activeLights array
        const onMessageArrived = (_message) => {
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

          setActiveLights(activeSerialArray); // update activeLights array
          setIsLoading(false);
        };
        // set on message arrived callback
        mqttClient.onMessageArrived = onMessageArrived;

        // subscribe so that when message arrives we receive all currently active lights
        mqttClient.subscribe('18026172/light/checked');
        // publish message with every lights serial number and channel so the state can be checked
        mqttClient.publish('18026172/light/check', message);
      } catch (e) {
        ToastAndroid.show(
          'An Unexpected Error Has Occured',
          ToastAndroid.SHORT,
        );
      }
    },
    [mqttClient],
  );

  // get list of all lights
  const getDeviceList = useCallback(async () => {
    try {
      const data = await ListDevices('Light');
      // if returned data is not empty then set list state and check all lights
      if (!(typeof data === 'undefined')) {
        setDeviceList([]);
        setDeviceList(data);
        checkLights(data);
      } else {
        setDeviceList([]);
        setIsLoading(false);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  }, [checkLights]);

  // on component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        // after a connection is made to the broker a call is made to retrieve all lights from the database
        const onConnect = async () => {
          await getDeviceList();
        };
        // set on connect callback
        mqttClient.onConnect = onConnect;

        // connect to mqtt broker
        mqttClient.connect('test.mosquitto.org', 8080);
      } catch (e) {
        ToastAndroid.show(
          'An Unexpected Error Has Occured',
          ToastAndroid.SHORT,
        );
      }
    });

    return unsubscribe;
  }, [getDeviceList, navigation, mqttClient]);

  useEffect(
    () =>
      // close mqtt connection on un-mount
      () => {
        try {
          mqttClient.close(); // disconnects current client when user leaves this screen
        } catch (e) {
          ToastAndroid.show(
            'An Unexpected Error Has Occured',
            ToastAndroid.SHORT,
          );
        }
      },
    [mqttClient],
  );

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
                  style={{paddingRight: '4%'}}
                  onPress={() => deleteDevice(item.device_id.toString())}
                />
                <Icon
                  name={
                    activeLights.indexOf(
                      item.device_serial_number.toString() +
                        item.device_channel.toString(),
                    ) > -1
                      ? 'lightbulb-on'
                      : 'lightbulb-off'
                  }
                  size={40}
                  color={colors.text}
                  onPress={() =>
                    onOff(
                      item.device_serial_number.toString(),
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
              params: {deviceType: 'Light'},
            })
          }>
          <Text>Add Light</Text>
        </Button>
      </View>
    </View>
  );
};

LightsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default LightsScreen;
