import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Signup from '../components/singup';
import globalStyle from '../styles/globalStyle';

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    const details = {
      firstName,
      lastName,
      email,
      password,
    };

    Signup(props, details);
  };

  return (
    <View style={globalStyle.flexContainer}>
      <View style={globalStyle.textInputView}>
        <TextInput
          role="textbox"
          type="outlined"
          label="First Name"
          placeholder="Enter first name"
          onChangeText={(value) => setFirstName(value)}
          value={firstName}
        />
        <TextInput
          role="textbox"
          type="outlined"
          label="Last Name"
          placeholder="Enter last name"
          onChangeText={(value) => setLastName(value)}
          value={lastName}
        />
        <TextInput
          role="textbox"
          type="outlined"
          label="Email"
          placeholder="Enter email"
          onChangeText={(value) => setEmail(value)}
          value={email}
        />
        <TextInput
          role="textbox"
          secureTextEntry
          type="outlined"
          label="Password"
          placeholder="Enter password"
          onChangeText={(value) => setPassword(value)}
          value={password}
        />
      </View>
      <View style={globalStyle.submitButtonView}>
        <Button
          role="button"
          mode="contained"
          contentStyle={globalStyle.buttonContent}
          style={globalStyle.submitButton}
          onPress={() => submit()}>
          <Text>Create Account</Text>
        </Button>
      </View>
    </View>
  );
};

export default SignupScreen;
