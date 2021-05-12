import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button, ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';
import globalStyle from '../styles/globalStyle';

const DoorbellScreen = (props) => {
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isDoorbell, setIsDoorbell] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Doorbell');
    console.log(data);
    if (!(typeof data === 'undefined')) {
      setDeviceList(data);
      setIsDoorbell(true);
    } else {
      // setIsLoading(false);
    }
  }, []);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        mqttClient.close();
      } catch (e) {
        console.log(e);
      }

      const onConnect = async () => {
        // console.log('MQTT Connected');
        const onMessageArrived = (_message) => {
          console.log(
            'MQTT Message arrived payloadString: ',
            _message.payloadString,
          );
          ToastAndroid.show('Doorbell is ringing!!!', ToastAndroid.SHORT);
        };
        mqttClient.onMessageArrived = onMessageArrived;
        mqttClient.subscribe('18026172/doorbell/ringing');
        await getDeviceList();
        setIsLoading(false);
      };

      mqttClient.onConnect = onConnect;

      // mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.connect('test.mosquitto.org', 8080);
    });

    return unsubscribe;
  }, [getDeviceList, navigation, mqttClient]);

  if (isLoading === true) {
    return (
      <View style={globalStyle.flexContainer}>
        <ActivityIndicator style={globalStyle.activityIndicator} animating />
      </View>
    );
  }
  if (isDoorbell === true) {
    return (
      <View>
        <Text>{deviceList[0].device_name.toString()}</Text>
        <Button
          role="button"
          mode="contained"
          onPress={() =>
            mqttClient.publish(
              '18026172/doorbell/activate',
              deviceList[0].device_serial_number.toString() +
                deviceList[0].device_channel.toString(),
            )
          }>
          <Text>Activate Doorbell</Text>
        </Button>
        <Button
          role="button"
          mode="contained"
          onPress={() =>
            mqttClient.publish(
              '18026172/doorbell/deactivate',
              deviceList[0].device_serial_number.toString() +
                deviceList[0].device_channel.toString(),
            )
          }>
          <Text>Deactivate Doorbell</Text>
        </Button>
      </View>
    );
  }
  return (
    <View>
      <Button
        role="button"
        mode="contained"
        onPress={() =>
          props.navigation.navigate('homeStackNavigator', {
            screen: 'Add Device',
            params: {deviceType: 'Doorbell'},
          })
        }>
        <Text>Add Doorbell</Text>
      </Button>
    </View>
  );
};

DoorbellScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default DoorbellScreen;
