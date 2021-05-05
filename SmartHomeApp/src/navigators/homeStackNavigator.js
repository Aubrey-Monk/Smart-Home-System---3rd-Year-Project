import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import lightScreen from '../screens/lightScreen';
import securityScreen from '../screens/securityScreen';
import addDeviceScreen from '../screens/addDeviceScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Light" component={lightScreen} />
    <Stack.Screen name="Security" component={securityScreen} />
    <Stack.Screen name="Add Device" component={addDeviceScreen} />
  </Stack.Navigator>
);

export default HomeStackNavigator;
