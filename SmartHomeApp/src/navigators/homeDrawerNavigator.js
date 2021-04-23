/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {useTheme} from 'react-native-paper';
import HomeScreen from '../screens/homeScreen';
import Logout from '../components/logout';

const Drawer = createDrawerNavigator();

const HomeNavigator = () => {
  const {colors} = useTheme();
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.background,
        width: 240,
      }}
      drawerContentOptions={{
        activeTintColor: 'black',
        activeBackgroundColor: colors.primary,
      }}
      initialRouteName="Home"
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            inactiveBackgroundColor={colors.primary}
            inactiveTintColor="black"
            label="Logout"
            onPress={() => Logout(props)}
          />
        </DrawerContentScrollView>
      )}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
    </Drawer.Navigator>
  );
};

HomeNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeNavigator;
