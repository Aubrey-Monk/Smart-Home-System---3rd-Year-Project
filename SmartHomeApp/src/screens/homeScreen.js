import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';

const HomeScreen = (props) => (
  <View>
    <View>
      <Button role="button" mode="contained">
        <Text>Light</Text>
      </Button>
      <Button role="button" mode="contained">
        <Text>Power</Text>
      </Button>
    </View>
    <View>
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
      <Button role="button" mode="contained">
        <Text>Temprature</Text>
      </Button>
    </View>
    <View>
      <Button role="button" mode="contained">
        <Text>Voice</Text>
      </Button>
    </View>
  </View>
);

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
