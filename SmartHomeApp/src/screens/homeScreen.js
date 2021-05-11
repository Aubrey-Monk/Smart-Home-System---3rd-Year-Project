import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
import {Text, Button} from 'react-native-paper';
import MQTTConnection from '../components/mqttClient';

const HomeScreen = (props) => {
  const {navigation} = props;

  const [mqttClient, setMqttClient] = useState(new MQTTConnection());

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        mqttClient.close();
      } catch (e) {
        console.log(e);
      }
      const onConnect = async () => {
        console.log('MQTT Connected');
        const onMessageArrived = (_message) => {
          console.log(
            'MQTT Message arrived payloadString: ',
            _message.payloadString,
          );
          ToastAndroid.show('test', ToastAndroid.SHORT);
        };
        mqttClient.onMessageArrived = onMessageArrived;
        mqttClient.subscribe('18026172/test');
      };

      mqttClient.onConnect = onConnect;

      // mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.connect('test.mosquitto.org', 8080);
    });

    return unsubscribe;
  }, [navigation, mqttClient]);

  return (
    <View>
      <Button
        role="button"
        mode="contained"
        onPress={() =>
          props.navigation.navigate('homeStackNavigator', {
            screen: 'Lights',
          })
        }>
        <Text>Light</Text>
      </Button>

      <Button
        role="button"
        mode="contained"
        onPress={() =>
          props.navigation.navigate('homeStackNavigator', {
            screen: 'Security',
          })
        }>
        <Text>Security</Text>
      </Button>
    </View>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
