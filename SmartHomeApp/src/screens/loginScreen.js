import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Login from '../components/login';

const LoginScreen = (props) => {
  // login details hard coded for rapid testing
  const [email, setEmail] = useState('aubrey.monk@mail.com');
  const [password, setPassword] = useState('password123');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const submit = () => {
    const details = {
      email,
      password,
    };
    Login(props, details);
  };

  return (
    <View>
      <View>
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
          <Text>Login</Text>
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;
