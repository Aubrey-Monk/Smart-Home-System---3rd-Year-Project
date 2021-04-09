import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import globalStyle from '../styles/globalStyle';

const WelcomeScreen = (props) => (
  <View style={globalStyle.flexContainer}>
    <View style={globalStyle.twoButtonView}>
      <Button
        role="button"
        contentStyle={globalStyle.buttonContent}
        style={globalStyle.button}
        mode="contained"
        onPress={() => props.navigation.navigate('Login')}>
        <Text>Login</Text>
      </Button>

      <Button
        role="button"
        contentStyle={globalStyle.buttonContent}
        style={globalStyle.button}
        mode="contained"
        onPress={() => props.navigation.navigate('Signup')}>
        <Text>Signup</Text>
      </Button>
    </View>
  </View>
);

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default WelcomeScreen;
