import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View, ToastAndroid} from 'react-native';
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
    try {
      const whitespaceRegexString = /^\s+$/; // for stopping the user from entering only whitespace in the device name and room fields
      // check if name and room fields are empty or contain whitespace
      if (
        deviceName === '' ||
        deviceRoom === '' ||
        whitespaceRegexString.test(deviceName) ||
        whitespaceRegexString.test(deviceRoom)
      ) {
        ToastAndroid.show('Invalid name or room entered.', ToastAndroid.SHORT);
        // check if serial is an 6 digit integer
      } else if (Number.isNaN(serialNumber) || serialNumber.length !== 6) {
        ToastAndroid.show(
          'Invalid serial number entered. Serial number should be 6 digits.',
          ToastAndroid.SHORT,
        );
        // check channel is a 1-2 digit integer
      } else if (
        Number.isNaN(deviceChannel) ||
        !(deviceChannel.length <= 2 && deviceChannel.length > 0)
      ) {
        ToastAndroid.show(
          'Invalid channel entered. Channel should be 1 or 2 digits.',
          ToastAndroid.SHORT,
        );
      } else {
        // create device details object
        const deviceParams = {
          device_serial_number: parseInt(serialNumber, 10),
          device_name: deviceName,
          device_type: deviceType,
          device_room: deviceRoom,
          device_channel: parseInt(deviceChannel, 10),
        };

        // call add device component
        AddDevice(props, deviceParams);
      }
    } catch (e) {
      ToastAndroid.show('An Unexpected Error Has Occured', ToastAndroid.SHORT);
    }
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
