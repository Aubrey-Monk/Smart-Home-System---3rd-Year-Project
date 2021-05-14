import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStore from './globalStore';

const Login = (props, details) =>
  fetch(`http://${globalStore.serverIP}:3333/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: details.email,
      password: details.password,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 400) {
        throw new Error('Invalid email or password.');
      }
      if (response.status === 500) {
        throw new Error('Server Error.');
      } else {
        throw new Error('Something went wrong.');
      }
    })
    .then(async (responseJson) => {
      await AsyncStorage.setItem('@session_token', responseJson.token);
      await AsyncStorage.setItem('@user_id', JSON.stringify(responseJson.id));

      props.navigation.navigate('homeDrawerNavigator');
    })
    .catch((error) => {
      ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
    });

export default Login;
