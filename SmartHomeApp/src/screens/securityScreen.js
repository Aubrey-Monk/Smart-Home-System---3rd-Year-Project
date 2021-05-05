import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SecurityScreen = (props) => {
  const {navigation} = props;

  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient, setMqttClient] = useState(new MQTTConnection());

  const checkLocks = useCallback(
    async (data) => {
      let message = '';
      Object.keys(data).forEach((key) => {
        message = `${message + data[key].serial_number.toString()}-`;
      });

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
    const unsubscribe = navigation.addListener('focus', async () => {
      const onConnect = async () => {
        console.log('MQTT Connected');
        await getDeviceList();
      };
      mqttClient.onConnect = onConnect;
      mqttClient.connect('test.mosquitto.org', 8080);
    });

    return unsubscribe;
  }, [getDeviceList, navigation, mqttClient]);

  return (
    <View>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <View>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                mqttClient.publish(
                  '18026172/lock/lock',
                  item.serial_number.toString(),
                )
              }>
              <Text>{item.serial_number.toString()}</Text>
              <Text> Lock</Text>
            </Button>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                mqttClient.publish(
                  '18026172/lock/unlock',
                  item.serial_number.toString(),
                )
              }>
              <Text>{item.serial_number.toString()}</Text>
              <Text> UnLock</Text>
            </Button>
          </View>
        )}
        keyExtractor={(item) => item.serial_number.toString()}
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

SecurityScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default SecurityScreen;
