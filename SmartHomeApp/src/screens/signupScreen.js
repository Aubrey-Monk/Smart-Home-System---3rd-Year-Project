import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Signup from '../components/singup';

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
    <View>
      <View>
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
      <View>
        <Button role="button" mode="contained" onPress={() => submit()}>
          <Text>Create Account</Text>
        </Button>
      </View>
    </View>
  );
};

export default SignupScreen;
