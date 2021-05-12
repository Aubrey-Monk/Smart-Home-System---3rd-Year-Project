import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';

const LocksScreen = (props) => {
  const {navigation} = props;

  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());
  const [lockedDoors, setLockedDoors] = useState([]);

  const lockUnlock = (serialNumber) => {
    if (lockedDoors.indexOf(serialNumber) > -1) {
      // console.log('unlocking');
      mqttClient.publish('18026172/lock/unlock', serialNumber.toString());
      setLockedDoors(lockedDoors.filter((item) => item !== serialNumber));
    } else {
      // console.log('locking');
      mqttClient.publish('18026172/lock/lock', serialNumber.toString());
      setLockedDoors([...lockedDoors, serialNumber]);
    }
  };

  const checkLocks = useCallback(
    async (data) => {
      let message = '';
      Object.keys(data).forEach((key) => {
        message = `${message + data[key].serial_number.toString()}-`;
      });

      const onMessageArrived = (_message) => {
        console.log(
          'MQTT Message arrived payloadString: ',
          _message.payloadString,
        );
        const positions = _message.payloadString.split('-');
        const lockedSerialArray = [];
        Object.keys(data).forEach((key) => {
          // message = `${message + data[key].serial_number.toString()}-`;
          // console.log(positions[key]);
          // console.log(data[key].serial_number.toString());
          if (positions[key] === '180.0') {
            lockedSerialArray.push(data[key].serial_number);
          }
        });
        setLockedDoors(lockedSerialArray);
      };
      mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.subscribe('18026172/lock/checked');
      mqttClient.publish('18026172/lock/check', message);
    },
    [mqttClient],
  );

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    setDeviceList(data);
    checkLocks(data);
  }, [checkLocks]);

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
        mqttClient.close();
      },
    [mqttClient],
  );

  // console.log(lockedDoors);

  return (
    <View>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <View>
            <Text>{item.device_serial_number.toString()}</Text>
            <Text>{item.device_name.toString()}</Text>
            <Icon
              name={
                lockedDoors.indexOf(item.device_serial_number) > -1
                  ? 'lock'
                  : 'lock-open-variant'
              }
              size={40}
              color="red"
              onPress={() => lockUnlock(item.device_serial_number)}
            />
          </View>
        )}
        keyExtractor={(item) => item.device_id.toString()}
      />
      <Button
        role="button"
        mode="contained"
        onPress={() =>
          props.navigation.navigate('homeStackNavigator', {
            screen: 'Add Device',
            params: {deviceType: 'Lock'},
          })
        }>
        <Text>Add Device</Text>
      </Button>
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
