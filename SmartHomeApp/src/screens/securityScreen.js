import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';

const SecurityScreen = (props) => (
  <View>
    <Button
      role="button"
      mode="contained"
      onPress={() =>
        props.navigation.navigate('homeStackNavigator', {
          screen: 'Add Device',
        })
      }>
      <Text>Add Device</Text>
    </Button>
  </View>
);

SecurityScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default SecurityScreen;
