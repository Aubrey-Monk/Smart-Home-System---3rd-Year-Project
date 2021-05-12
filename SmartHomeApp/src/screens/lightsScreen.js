import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button, ActivityIndicator, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';
import globalStyle from '../styles/globalStyle';

const LightsScreen = (props) => {
  // for no paper components so paper theme colors can be used
  const {colors} = useTheme();

  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());
  // array used to monitor state of lights
  const [activeLights, setActiveLights] = useState([]);

  const onOff = (serialNumber, channel) => {
    if (activeLights.indexOf(serialNumber + channel) > -1) {
      mqttClient.publish(
        '18026172/light/off',
        serialNumber.toString() + channel.toString(),
      );
      setActiveLights(
        activeLights.filter((item) => item !== serialNumber + channel),
      );
    } else {
      mqttClient.publish(
        '18026172/light/on',
        serialNumber.toString() + channel.toString(),
      );

      setActiveLights([...activeLights, serialNumber + channel]);
    }
  };

  const checkLights = useCallback(
    async (data) => {
      let message = '';
      Object.keys(data).forEach((key) => {
        message = `${
          message +
          data[key].device_serial_number.toString() +
          data[key].device_channel.toString()
        }-`;
      });

      const onMessageArrived = (_message) => {
        // console.log(
        //   'MQTT Message arrived payloadString: ',
        //   _message.payloadString,
        // );
        const states = _message.payloadString.split('-');
        const activeSerialArray = [];

        Object.keys(data).forEach((key) => {
          if (states[key] === 'true') {
            activeSerialArray.push(
              data[key].device_serial_number.toString() +
                data[key].device_channel.toString(),
            );
          } else if (states[key] === '1.0') {
            ToastAndroid.show(
              `Device with serial number: ${data[key].device_serial_number} and Channel number: ${data[key].device_channel}  is not connected.`,
              ToastAndroid.SHORT,
            );
          }
        });
        setActiveLights(activeSerialArray);
        setIsLoading(false);
      };
      mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.subscribe('18026172/light/checked');
      mqttClient.publish('18026172/light/check', message);
    },
    [mqttClient],
  );

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Light');
    if (!(typeof data === 'undefined')) {
      setDeviceList(data);
      checkLights(data);
    } else {
      setIsLoading(false);
    }
  }, [checkLights]);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const onConnect = async () => {
        // console.log('MQTT Connected');
        await getDeviceList();
      };

      mqttClient.onConnect = onConnect;

      // mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.connect('test.mosquitto.org', 8080);
    });

    return unsubscribe;
  }, [getDeviceList, navigation, mqttClient]);

  useEffect(
    () =>
      // on un-mount
      () => {
        // console.log('MQTT Disconnected');
        mqttClient.close();
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
              <View>
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
