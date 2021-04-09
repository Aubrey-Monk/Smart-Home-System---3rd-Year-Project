import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';

const WelcomeScreen = (props) => (
  <View>
    <Button
      role="button"
      mode="contained"
      onPress={() => props.navigation.navigate('Login')}>
      <Text>Login</Text>
    </Button>
    <Button
      role="button"
      mode="contained"
      onPress={() => props.navigation.navigate('Signup')}>
      <Text>Signup</Text>
    </Button>
  </View>
);

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default WelcomeScreen;
