import init from 'react_native_mqtt';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export default class MQTTConnection {
  constructor() {
    this.mqtt = null;
    this.QOS = 0;
    this.RETAIN = false;
  }

  onConnectionLost = () => {
    // console.log('MQTT Connection Lost');
    // console.log(res);
  };

  onMessageDelivered = () => {
    // console.log(
    //   'MQTT Message delivered payloadString: ',
    //   message.payloadString,
    // );
  };

  onSuccess = () => {
    this.onConnect();
  };

  onFailure = () => {
    this.onConnectionLost();
  };

  connect(host, port) {
    const clientID = uuid.v4();
    // console.log('clientID: ', clientID);

    // eslint-disable-next-line no-undef
    this.mqtt = new Paho.MQTT.Client(host, port, clientID);

    this.mqtt.onConnectionLost = (res) => {
      this.onConnectionLost(res);
    };

    this.mqtt.onMessageArrived = (message) => {
      this.onMessageArrived(message);
    };

    this.mqtt.onMessageDelivered = (message) => {
      this.onMessageDelivered(message);
    };

    this.mqtt.connect({
      onSuccess: this.onSuccess,
      onFailure: this.onFailure,
      useSSL: false,
    });
  }

  publish(topic, payload) {
    if (this.mqtt == null) {
      return;
    }
    // console.log(
    //   `MQTT publish: topic: ${topic}, payload: ${payload} qos: ${this.QOS} retain: ${this.RETAIN}`,
    // );
    this.mqtt.publish(topic, payload, this.QOS, this.RETAIN);
  }

  subscribe(topic) {
    if (this.mqtt == null) {
      return;
    }
    // console.log('MQTT subscribe to topic: ', topic);
    this.mqtt.subscribe(topic, this.QOS);
  }

  unsubscribe(topic) {
    if (this.mqtt == null) {
      return;
    }
    // console.log('MQTT un-subscribe to topic: ', topic);
    this.mqtt.unsubscribe(topic);
  }

  close() {
    this.mqtt.disconnect();
    this.mqtt = null;
  }
}

MQTTConnection.prototype.onConnect = null;
// MQTTConnection.prototype.onConnectionLost = null;
MQTTConnection.prototype.onMessageArrived = null;
// MQTTConnection.prototype.onMessageDelivered = null;
