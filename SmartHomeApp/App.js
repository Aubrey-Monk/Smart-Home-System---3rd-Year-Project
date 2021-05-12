import 'react-native-gesture-handler';
import * as React from 'react';
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
import welcomeStackNavigator from './src/navigators/welcomeStackNavigator';
import homeDrawerNavigator from './src/navigators/homeDrawerNavigator';
import homeStackNavigator from './src/navigators/homeStackNavigator';
import {Context} from './src/components/context';

const Stack = createStackNavigator();

export default function Main() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

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
      surface: '#FFFFFF',
      text: '#FFFFFF',
      placeholder: '#FFFFFF',
    },
  };

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
