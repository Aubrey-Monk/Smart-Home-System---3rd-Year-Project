import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStore from './globalStore';

// sends post request to API to log a user out
const Logout = async (props) => {
  const token = await AsyncStorage.getItem('@session_token');
  // eslint-disable-next-line no-undef
  return fetch(`http://${globalStore.serverIP}:3333/user/logout`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        props.navigation.navigate('Welcome');
      }
      if (response.status === 401) {
        throw new Error('Unauthorised');
      } else if (response.status === 500) {
        throw new Error('Server error');
      } else if (response.status !== 200) {
        throw new Error('Something went wrong.');
      }
    })
    .catch((error) => {
      ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
    });
};

export default Logout;
