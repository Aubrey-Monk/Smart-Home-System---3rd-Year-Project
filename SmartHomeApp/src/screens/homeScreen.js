import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyle from '../styles/globalStyle';

const HomeScreen = (props) => {
  // for no paper components so paper theme colors can be used
  const {colors} = useTheme();

  return (
    <View style={[globalStyle.flexContainer, {flexDirection: 'row'}]}>
      <View style={styles.firstTwoButtonView}>
        <Button
          role="button"
          mode="contained"
          style={[
            {backgroundColor: colors.accent, borderColor: colors.primary},
            styles.button,
          ]}
          contentStyle={globalStyle.buttonContent}
          onPress={() =>
            props.navigation.navigate('homeStackNavigator', {
              screen: 'Lights',
            })
          }>
          <Icon name="lightbulb" size={75} color={colors.text} />
        </Button>

        <Button
          role="button"
          mode="contained"
          style={[
            {backgroundColor: colors.accent, borderColor: colors.primary},
            styles.button,
          ]}
          contentStyle={globalStyle.buttonContent}
          onPress={() =>
            props.navigation.navigate('homeStackNavigator', {
              screen: 'Locks',
            })
          }>
          <Icon name="lock" size={75} color={colors.text} />
        </Button>
      </View>
      <View style={styles.secondTwoButtonView}>
        <Button
          role="button"
          mode="contained"
          style={[
            {backgroundColor: colors.accent, borderColor: colors.primary},
            styles.button,
          ]}
          contentStyle={globalStyle.buttonContent}
          onPress={() =>
            props.navigation.navigate('homeStackNavigator', {
              screen: 'Sensors',
            })
          }>
          <Icon name="motion-sensor" size={75} color={colors.text} />
        </Button>

        <Button
          role="button"
          mode="contained"
          style={[
            {backgroundColor: colors.accent, borderColor: colors.primary},
            styles.button,
          ]}
          contentStyle={globalStyle.buttonContent}
          onPress={() =>
            props.navigation.navigate('homeStackNavigator', {
              screen: 'Doorbell',
            })
          }>
          <Icon name="doorbell" size={75} color={colors.text} />
        </Button>
      </View>
    </View>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  button: {
    height: '30%',
    borderWidth: 3,
  },
  firstTwoButtonView: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: '10%',
    marginBottom: '10%',
    marginLeft: '10%',
    marginRight: '5%',
  },
  secondTwoButtonView: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: '10%',
    marginBottom: '10%',
    marginRight: '10%',
    marginLeft: '5%',
  },
});

export default HomeScreen;
