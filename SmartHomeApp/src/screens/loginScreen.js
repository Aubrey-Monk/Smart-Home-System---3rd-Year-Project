import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Login from '../components/login';
import globalStyle from '../styles/globalStyle';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    try {
      const emailRegexString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // to validate email
      const passwordRegexString = /^\S{5,}$/; // to validate password, more than 5 chars and no white space

      // check if email is empty and if it matches the regex
      if (email === '' || !emailRegexString.test(email)) {
        ToastAndroid.show('Invalid email entered.', ToastAndroid.SHORT);
        // check if password is empty or if it matches the regex
      } else if (password === '' || !passwordRegexString.test(password)) {
        ToastAndroid.show('Invalid password entered.', ToastAndroid.SHORT);
      } else {
        // create details object
        const details = {
          email,
          password,
        };
        // call login function giving the details object
        Login(props, details);
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
          <Text>Login</Text>
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;
