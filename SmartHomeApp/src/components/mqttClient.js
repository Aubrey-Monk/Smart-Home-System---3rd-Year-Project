import {Client} from 'react-native-paho-mqtt';

const mqttClient = () => {
  // Set up an in-memory alternative to global localStorage
  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };

  // Create a client instance
  const client = new Client({
    uri: 'ws://test.mosquitto.org:8080/ws',
    clientId: '18026172_APP_Client',
    storage: myStorage,
  });

  // set event handlers
  client.on('connectionLost', (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log(responseObject.errorMessage);
    }
  });
  client.on('messageReceived', (message) => {
    console.log(message.payloadString);
  });

  return client;
};

export default mqttClient;
