import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button, ActivityIndicator, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';
import globalClient from '../components/globalClient';
import globalStyle from '../styles/globalStyle';

const MotionSensorScreen = (props) => {
  // for non paper components so paper theme colors can be used
  const {colors} = useTheme();
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Motion');
    if (!(typeof data === 'undefined')) {
      setDeviceList(data);
    } else {
      setIsLoading(false);
    }
  }, []);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        globalClient.client.close();
        console.log('disconnect');
      } catch (e) {
        console.log(e);
      }

      globalClient.motionClient = new MQTTConnection();

      const onConnect = async () => {
        // console.log('MQTT Connected');
        const onMessageArrived = (_message) => {
          console.log(
            'MQTT Message arrived payloadString: ',
            _message.payloadString,
          );
          ToastAndroid.show(
            `Motion!!!: ${_message.payloadString}`,
            ToastAndroid.SHORT,
          );
        };
        globalClient.motionClient.onMessageArrived = onMessageArrived;
        globalClient.motionClient.subscribe('18026172/motion/motion');
        await getDeviceList();
        setIsLoading(false);
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

MotionSensorScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default MotionSensorScreen;
