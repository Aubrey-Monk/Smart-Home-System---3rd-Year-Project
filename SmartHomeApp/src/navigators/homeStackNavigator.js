import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import lightsScreen from '../screens/lightsScreen';
import locksScreen from '../screens/locksScreen';
import doorbellScreen from '../screens/doorbellScreen';
import motionSensorsScreen from '../screens/motionSensorsScreen';
import addDeviceScreen from '../screens/addDeviceScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Lights" component={lightsScreen} />
    <Stack.Screen name="Locks" component={locksScreen} />
    <Stack.Screen name="Doorbell" component={doorbellScreen} />
    <Stack.Screen name="Sensors" component={motionSensorsScreen} />
    <Stack.Screen name="Add Device" component={addDeviceScreen} />
  </Stack.Navigator>
);

export default HomeStackNavigator;
