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

const LocksScreen = (props) => {
  const {colors} = useTheme(); // for non paper components so paper theme colors can be used
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());
  const [lockedDoors, setLockedDoors] = useState([]); // array used for locks that are currently locked

  // locks or unlocks a door
  const lockUnlock = (serialNumber) => {
    try {
      // checks if lock is already locked or not by checking lockedDoors array
      if (lockedDoors.indexOf(serialNumber) > -1) {
        mqttClient.publish('18026172/lock/unlock', serialNumber.toString());
        // remove lock from lockedDoors array
        setLockedDoors(lockedDoors.filter((item) => item !== serialNumber));
      } else {
        mqttClient.publish('18026172/lock/lock', serialNumber.toString());
        // add lock to lockedDoors array
        setLockedDoors([...lockedDoors, serialNumber]);
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

  // check the state of each lock
  const checkLocks = useCallback(
    async (data) => {
      try {
        let message = '';
        // loop through each lock in list and build message (with serial number) to publish to check state of the lock
        Object.keys(data).forEach((key) => {
          message = `${message + data[key].device_serial_number.toString()}-`;
        });

        // when message arrives with currently locked locks they are pushed to the lockedDoors array
        const onMessageArrived = (_message) => {
          const positions = _message.payloadString.split('-');
          const lockedSerialArray = [];

          // loop through the received position of each lock
          Object.keys(data).forEach((key) => {
            if (positions[key] === '180.0') {
              // if position is 180 the door is locked so it is added to lockedSerialArray array
              lockedSerialArray.push(data[key].device_serial_number);
              // if lock dosent exists/is disconnected
            } else if (positions[key] === '1.0') {
              ToastAndroid.show(
                `Device with serial number: ${data[key].device_serial_number} is not connected.`,
                ToastAndroid.SHORT,
              );
            }
          });

          setLockedDoors(lockedSerialArray); // update lockedDoors array
          setIsLoading(false);
        };
        // set on message arrived callback
        mqttClient.onMessageArrived = onMessageArrived;

        // subscribe so that when message arrives we receive all currently locked locks
        mqttClient.subscribe('18026172/lock/checked');
        // publish message with every locks serial number so the state of the lock can be checked
        mqttClient.publish('18026172/lock/check', message);
      } catch (e) {
        ToastAndroid.show(
          'An Unexpected Error Has Occured',
          ToastAndroid.SHORT,
        );
      }
    },
    [mqttClient],
  );

  // get list of all locks
  const getDeviceList = useCallback(async () => {
    try {
      const data = await ListDevices('Lock');
      // if returned data is not empty then set list state and check all locks
      if (!(typeof data === 'undefined')) {
        setDeviceList([]);
        setDeviceList(data);
        checkLocks(data);
      } else {
        setDeviceList([]);
        setIsLoading(false);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
  }, [checkLocks]);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        // after a connection is made to the broker a call is made to retrieve all locks from the database
        const onConnect = async () => {
          await getDeviceList();
        };
        // set on connect callback
        mqttClient.onConnect = onConnect;

        // connect to mqtt broker
        mqttClient.connect();
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
                  style={{paddingRight: '4%'}}
                  onPress={() => deleteDevice(item.device_id.toString())}
                />
                <Icon
                  name={
                    lockedDoors.indexOf(item.device_serial_number) > -1
                      ? 'lock'
                      : 'lock-open-variant'
                  }
                  size={40}
                  color={colors.text}
                  onPress={() => lockUnlock(item.device_serial_number)}
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
              params: {deviceType: 'Lock'},
            })
          }>
          <Text>Add Lock</Text>
        </Button>
      </View>
    </View>
  );
};

LocksScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default LocksScreen;
