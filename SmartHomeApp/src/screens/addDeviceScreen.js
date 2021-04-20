import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import AddDevice from '../components/addDevice';

const AddDeviceScreen = (props) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceRoom, setDeviceRoom] = useState('');

  const submit = () => {
    const params = {
      device_name: deviceName,
      device_type: deviceType,
      device_room: deviceRoom,
    };

    AddDevice(props, params);
  };

  return (
    <View>
      <View>
        <TextInput
          role="textbox"
          type="outlined"
          label="Device Name"
          placeholder="Enter device name"
          onChangeText={(value) => setDeviceName(value)}
          value={deviceName}
        />
        <TextInput
          role="textbox"
          type="outlined"
          label="Device Type"
          placeholder="Enter device type"
          onChangeText={(value) => setDeviceType(value)}
          value={deviceType}
        />
        <TextInput
          role="textbox"
          type="outlined"
          label="Device Room"
          placeholder="Enter device room"
          onChangeText={(value) => setDeviceRoom(value)}
          value={deviceRoom}
        />
      </View>
      <View>
        <Button role="button" mode="contained" onPress={() => submit()}>
          <Text>Add Device</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddDeviceScreen;
