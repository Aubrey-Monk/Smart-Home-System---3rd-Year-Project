import 'react-native-gesture-handler';
import * as React from 'react';
import {Platform} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import PushNotification, {Importance} from 'react-native-push-notification';
import welcomeStackNavigator from './src/navigators/welcomeStackNavigator';
import homeDrawerNavigator from './src/navigators/homeDrawerNavigator';
import homeStackNavigator from './src/navigators/homeStackNavigator';
import {Context} from './src/components/context';

const Stack = createStackNavigator();

export default function Main() {
  // create channel so push notifications can be sent
  PushNotification.createChannel({
    channelId: 'default-channel',
    channelName: 'Default channel',
    channelDescription: 'A default notification channel',
    playSound: true,
    soundName: 'default',
    importance: Importance.HIGH,
    vibrate: true,
  });

  PushNotification.configure({
    popInitialNotification: true,
    // set to IOS due to a bug with firebase
    requestPermissions: Platform.OS === 'ios',
  });

  const DefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    roundness: 2,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      primary: '#23C9FF',
      accent: '#E7BBE3',
      background: '#CCD5FF',
      text: '#000000',
      surface: '#7CC6FE',
      card: '#7CC6FE',
      placeholder: '#000000',
    },
  };

  const DarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    roundness: 2,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      surface: '#BB86FC',
      text: '#FFFFFF',
      placeholder: '#FFFFFF',
    },
  };

  // used to toggle themes
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const theme = isDarkTheme ? DarkTheme : DefaultTheme;
  const context = React.useMemo(
    () => ({
      toggleTheme: () => {
        setIsDarkTheme(() => !isDarkTheme);
      },
    }),
    [isDarkTheme],
  );

  return (
    <PaperProvider theme={theme}>
      <Context.Provider value={context}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            <Stack.Screen
              name="welcomeStackNavigator"
              options={{headerShown: false}}
              component={welcomeStackNavigator}
            />
            <Stack.Screen
              name="homeDrawerNavigator"
              options={{headerShown: false}}
              component={homeDrawerNavigator}
            />
            <Stack.Screen
              name="homeStackNavigator"
              options={{headerShown: false}}
              component={homeStackNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Context.Provider>
    </PaperProvider>
  );
}
