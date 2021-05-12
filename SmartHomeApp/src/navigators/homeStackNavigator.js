import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import lightScreen from '../screens/lightScreen';
import locksScreen from '../screens/locksScreen';
import addDeviceScreen from '../screens/addDeviceScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Lights" component={lightScreen} />
    <Stack.Screen name="Locks" component={locksScreen} />
    <Stack.Screen name="Add Device" component={addDeviceScreen} />
  </Stack.Navigator>
);

export default HomeStackNavigator;
