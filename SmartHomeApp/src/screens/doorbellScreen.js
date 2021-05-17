import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid, StyleSheet} from 'react-native';
import {Text, Button, ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import DeleteDevice from '../components/deleteDevice';
import MQTTConnection from '../components/mqttClient';
import Notification from '../components/notification';
import globalStore from '../components/globalStore';
import globalStyle from '../styles/globalStyle';

const DoorbellScreen = (props) => {
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isDoorbell, setIsDoorbell] = useState(false);
  const [doorbellActive, setDoorbellActive] = useState(true);
  const [device, setDevice] = useState([]);

  // activates/deactivates the doorbell
  const activateDeactivate = () => {
    try {
      if (doorbellActive) {
        globalStore.doorbellClient.publish(
          '18026172/doorbell/deactivate',
          device[0].device_serial_number.toString() +
            device[0].device_channel.toString(),
        );
        setDoorbellActive(false);
      } else if (!doorbellActive) {
        globalStore.doorbellClient.publish(
          '18026172/doorbell/activate',
          device[0].device_serial_number.toString() +
            device[0].device_channel.toString(),
        );
        setDoorbellActive(true);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  };

  // deletes device from database and device state
  const deleteDevice = async (deviceId) => {
    try {
      await DeleteDevice(deviceId);
      await getDeviceList();
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  };

  // gets doorbell and sets device state
  const getDeviceList = useCallback(async () => {
    try {
      const data = await ListDevices('Doorbell');
      // if there is a doorbell it gets activated and the device state gets set
      if (!(typeof data === 'undefined')) {
        globalStore.doorbellClient.publish(
          '18026172/doorbell/activate',
          data[0].device_serial_number.toString() +
            data[0].device_channel.toString(),
        );
        setDevice([]);
        setDevice(data);
        setIsDoorbell(true);

        // else device state is set to empty and isDoorbell is set to false
      } else {
        setDevice([]);
        setIsDoorbell(false);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  }, []);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        // try to disconnect client to avoid multiple client instances
        try {
          globalStore.doorbellClient.close();
        } catch (e) {
          // console.log(e);
        }

        // create mqtt client
        globalStore.doorbellClient = new MQTTConnection();

        const onConnect = async () => {
          // when messages arrives a local notification is sent
          const onMessageArrived = () => {
            Notification(
              'Someone is at your door!',
              'Doorbell',
              true,
              true,
              'Doorbell is Ringing',
              'Doorbell',
            );
          };

          // set on message arrived callback
          globalStore.doorbellClient.onMessageArrived = onMessageArrived;

          globalStore.doorbellClient.subscribe('18026172/doorbell/ringing');

          await getDeviceList();

          setIsLoading(false);
        };

        // set on connect callback
        globalStore.doorbellClient.onConnect = onConnect;

        // connect to mqtt broker
        globalStore.doorbellClient.connect();
      } catch (e) {
        ToastAndroid.show(
          'An Unexpected Error Has Occured',
          ToastAndroid.SHORT,
        );
      }
    });

    return unsubscribe;
  }, [getDeviceList, navigation, device]);

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
        <Icon
          name="delete"
          size={40}
          color="red"
          onPress={() => deleteDevice(device[0].device_id.toString())}
          style={styles.deleteButton}
        />
        <Icon
          name="doorbell"
          size={400}
          color={doorbellActive ? 'green' : 'red'}
          onPress={() => activateDeactivate()}
          style={styles.bellButton}
        />
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

const styles = StyleSheet.create({
  bellButton: {
    alignSelf: 'center',
    paddingTop: '20%',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: '2%',
  },
});

export default DoorbellScreen;
