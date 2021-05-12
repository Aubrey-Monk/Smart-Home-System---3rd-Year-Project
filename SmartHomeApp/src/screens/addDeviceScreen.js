import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import AddDevice from '../components/addDevice';
import globalStyle from '../styles/globalStyle';

const AddDeviceScreen = (props) => {
  const {route} = props;
  const {params} = route;
  const {deviceType} = params;

  const [serialNumber, setSerialNumber] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceRoom, setDeviceRoom] = useState('');
  const [deviceChannel, setDeviceChannel] = useState('');

  const submit = () => {
    const deviceParams = {
      device_serial_number: parseInt(serialNumber, 10),
      device_name: deviceName,
      device_type: deviceType,
      device_room: deviceRoom,
      device_channel: parseInt(deviceChannel, 10),
    };

    AddDevice(props, deviceParams);
  };

  return (
    <View style={globalStyle.flexContainer}>
      <View style={globalStyle.textInputView}>
        <TextInput
          role="textbox"
          type="outlined"
          label="Serial Number"
          placeholder="Enter device serial number"
          onChangeText={(value) => setSerialNumber(value)}
          value={serialNumber}
        />

        <TextInput
          role="textbox"
          type="outlined"
          label="Device Channel"
          placeholder="Enter device channel"
          onChangeText={(value) => setDeviceChannel(value)}
          value={deviceChannel}
        />

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
          label="Device Room"
          placeholder="Enter device room"
          onChangeText={(value) => setDeviceRoom(value)}
          value={deviceRoom}
        />
      </View>
      <View style={globalStyle.submitButtonView}>
        <Button
          role="button"
          mode="contained"
          contentStyle={globalStyle.buttonContent}
          style={globalStyle.submitButton}
          onPress={() => submit()}>
          <Text>Add Device</Text>
        </Button>
      </View>
    </View>
  );
};

AddDeviceScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      deviceType: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default AddDeviceScreen;
