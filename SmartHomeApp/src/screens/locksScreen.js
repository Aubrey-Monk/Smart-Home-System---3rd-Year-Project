import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button, ActivityIndicator, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';
import globalStyle from '../styles/globalStyle';

const LocksScreen = (props) => {
  // for no paper components so paper theme colors can be used
  const {colors} = useTheme();

  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());
  // array used to monitor state of locks
  const [lockedDoors, setLockedDoors] = useState([]);

  // lock or unlock a lock depending on state (lockedDoors array)
  const lockUnlock = (serialNumber) => {
    if (lockedDoors.indexOf(serialNumber) > -1) {
      mqttClient.publish('18026172/lock/unlock', serialNumber.toString());
      setLockedDoors(lockedDoors.filter((item) => item !== serialNumber));
    } else {
      mqttClient.publish('18026172/lock/lock', serialNumber.toString());
      setLockedDoors([...lockedDoors, serialNumber]);
    }
  };

  // subscribes to the 'checked' topic then publishes a message to client with device serial numbers to check their position, if a message arrives with their position at (0-180) the state is updated, if their position arrives as 1.0 then a device not connected message appears
  const checkLocks = useCallback(
    async (data) => {
      let message = '';
      // loop through each serial number of returned device list and append to check message, so its ready to be published
      Object.keys(data).forEach((key) => {
        message = `${message + data[key].device_serial_number.toString()}-`;
      });

      const onMessageArrived = (_message) => {
        // console.log(
        //   'MQTT Message arrived payloadString: ',
        //   _message.payloadString,
        // );
        const positions = _message.payloadString.split('-');
        const lockedSerialArray = [];
        // loop through the received position of each lock
        Object.keys(data).forEach((key) => {
          // console.log(positions[key]);
          if (positions[key] === '180.0') {
            // update array to match position of lock
            lockedSerialArray.push(data[key].device_serial_number);
            // if lock dosent exists/is disconnected
          } else if (positions[key] === '1.0') {
            ToastAndroid.show(
              `Device with serial number: ${data[key].device_serial_number} is not connected.`,
              ToastAndroid.SHORT,
            );
          }
        });
        setLockedDoors(lockedSerialArray); // update locked doors state (lockedDoors array)
        setIsLoading(false);
      };
      mqttClient.onMessageArrived = onMessageArrived; // set onMessage arrived callback
      mqttClient.subscribe('18026172/lock/checked'); // subscribe to 'checked' topic ready for a response
      mqttClient.publish('18026172/lock/check', message); // publish check message
    },
    [mqttClient],
  );

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    // if returned data is not empty then set list state and check all locks
    if (!(typeof data === 'undefined')) {
      setDeviceList(data);
      checkLocks(data);
    } else {
      setIsLoading(false);
    }
  }, [checkLocks]);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const onConnect = async () => {
        // console.log('MQTT Connected');
        await getDeviceList();
      };
      mqttClient.onConnect = onConnect; // set onConnect callback
      mqttClient.connect('test.mosquitto.org', 8080); // connect to mqtt broker
    });

    return unsubscribe;
  }, [getDeviceList, navigation, mqttClient]);

  useEffect(
    () =>
      // on un-mount
      () => {
        mqttClient.close(); // disconnects current client when user leaves this screen
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
                  style={globalStyle.flexContainer}
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
