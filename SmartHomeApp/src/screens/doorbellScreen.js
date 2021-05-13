import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {Text, Button, ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';
import globalClient from '../components/globalClient';
import globalStyle from '../styles/globalStyle';

const DoorbellScreen = (props) => {
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isDoorbell, setIsDoorbell] = useState(false);
  const [deviceList, setDeviceList] = useState([]);

  const getDeviceList = useCallback(async () => {
    try {
      const data = await ListDevices('Doorbell');
      if (!(typeof data === 'undefined')) {
        setDeviceList(data);
        setIsDoorbell(true);
      } else {
        setIsDoorbell(false);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  }, []);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // try to disconnect client to avoid multiple client instances
      try {
        globalClient.doorbellClient.close();
      } catch (e) {
        // console.log(e);
      }

      // create mqtt client for doorbell
      globalClient.doorbellClient = new MQTTConnection();

      const onConnect = async () => {
        const onMessageArrived = () => {
          ToastAndroid.show('Doorbell is ringing!!!', ToastAndroid.SHORT);
        };

        globalClient.doorbellClient.onMessageArrived = onMessageArrived;

        globalClient.doorbellClient.subscribe('18026172/doorbell/ringing');

        await getDeviceList();
        setIsLoading(false);
      };

      globalClient.doorbellClient.onConnect = onConnect;

      globalClient.doorbellClient.connect('test.mosquitto.org', 8080);
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
  if (isDoorbell === true) {
    return (
      <View>
        <Text>{deviceList[0].device_name.toString()}</Text>
        <Button
          role="button"
          mode="contained"
          onPress={() =>
            globalClient.doorbellClient.publish(
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
            globalClient.doorbellClient.publish(
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
    <View style={[globalStyle.flexContainer, {paddingTop: '50%'}]}>
      <Button
        role="button"
        mode="contained"
        contentStyle={globalStyle.buttonContent}
        style={globalStyle.submitButton}
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
