import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import ListDevices from '../components/listDevices';
import MQTTConnection from '../components/mqttClient';

const LightScreen = (props) => {
  const {navigation} = props;

  const [deviceList, setDeviceList] = useState([]);
  const [mqttClient] = useState(new MQTTConnection());

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Light');
    setDeviceList(data);
  }, []);

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

  return (
    <View>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <View>
            <Text>{item.device_serial_number.toString()}</Text>
            <Text>{item.device_name.toString()}</Text>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                mqttClient.publish(
                  '18026172/light/on',
                  item.device_serial_number.toString() +
                    item.device_channel.toString(),
                )
              }>
              <Text>On</Text>
            </Button>
            <Button
              role="button"
              mode="contained"
              onPress={() =>
                mqttClient.publish(
                  '18026172/light/off',
                  item.device_serial_number.toString() +
                    item.device_channel.toString(),
                )
              }>
              <Text>Off</Text>
            </Button>
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
            params: {deviceType: 'Light'},
          })
        }>
        <Text>Add Device</Text>
      </Button>
    </View>
  );
};

LightScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default LightScreen;
