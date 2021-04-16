/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import HomeScreen from '../screens/homeScreen';
import Logout from '../components/logout';

const Drawer = createDrawerNavigator();

const HomeNavigator = () => (
  <Drawer.Navigator
    drawerStyle={{
      backgroundColor: '#c6cbef',
      width: 240,
    }}
    initialRouteName="Home"
    drawerContent={(props) => (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Logout" onPress={() => Logout(props)} />
      </DrawerContentScrollView>
    )}>
    <Drawer.Screen name="Home" component={HomeScreen} />
  </Drawer.Navigator>
);

HomeNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeNavigator;
