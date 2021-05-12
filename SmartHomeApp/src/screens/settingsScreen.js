import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableRipple, Switch, useTheme, Text} from 'react-native-paper';
import {Context} from '../components/context';

const SettingsScreen = () => {
  const paperTheme = useTheme();
  const {toggleTheme} = React.useContext(Context);
  return (
    <View>
      <TouchableRipple
        role="button"
        onPress={() => {
          toggleTheme();
        }}>
        <View style={styles.themeToggleView}>
          <View style={styles.textView}>
            <Text>Dark Theme</Text>
          </View>
          <View pointerEvents="none">
            <Switch role="switch" value={paperTheme.dark} />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  themeToggleView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingVertical: '4%',
    paddingHorizontal: '4%',
  },
  textView: {
    marginTop: '0.7%',
  },
});

export default SettingsScreen;
