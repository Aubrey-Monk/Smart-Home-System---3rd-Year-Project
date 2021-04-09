import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import welcomeScreen from '../screens/welcomeScreen';
import loginScreen from '../screens/loginScreen';
import signupScreen from '../screens/signupScreen';

const Stack = createStackNavigator();

const WelcomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Welcome" component={welcomeScreen} />
    <Stack.Screen name="Login" component={loginScreen} />
    <Stack.Screen name="Signup" component={signupScreen} />
  </Stack.Navigator>
);

export default WelcomeStackNavigator;
