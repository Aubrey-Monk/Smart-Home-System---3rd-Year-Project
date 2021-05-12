import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Signup from '../components/singup';
import globalStyle from '../styles/globalStyle';

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    try {
      const emailRegexString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // to validate email
      const passwordRegexString = /^\S{5,}$/; // more than 5 chars and no white space
      const whitespaceRegexString = /^\s+$/; // for stopping the user from entering only whitespace in the firstname and lastname text inputs

      // check if name fields are empty or contain whitespace
      if (
        firstName === '' ||
        lastName === '' ||
        whitespaceRegexString.test(firstName) ||
        whitespaceRegexString.test(lastName)
      ) {
        ToastAndroid.show(
          'Invalid first or last name entered.',
          ToastAndroid.SHORT,
        );
        // check if email is empty and if it matches the regex
      } else if (email === '' || !emailRegexString.test(email)) {
        ToastAndroid.show('Invalid email entered.', ToastAndroid.SHORT);
        // check if password is empty or if it matches the regex
      } else if (password === '' || !passwordRegexString.test(password)) {
        ToastAndroid.show('Invalid password entered.', ToastAndroid.SHORT);
      } else {
        // create details object
        const details = {
          firstName,
          lastName,
          email,
          password,
        };

        // call the signup function giving the details object
        Signup(props, details);
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
