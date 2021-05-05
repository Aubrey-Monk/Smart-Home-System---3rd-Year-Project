import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';

const HomeScreen = (props) => (
  <View>
    <Button
      role="button"
      mode="contained"
      onPress={() =>
        props.navigation.navigate('homeStackNavigator', {
          screen: 'Light',
        })
      }>
      <Text>Light</Text>
    </Button>

    <Button
      role="button"
      mode="contained"
      onPress={() =>
        props.navigation.navigate('homeStackNavigator', {
          screen: 'Security',
        })
      }>
      <Text>Security</Text>
    </Button>
  </View>
);

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
