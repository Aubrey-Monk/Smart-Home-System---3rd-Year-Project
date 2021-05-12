import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListDevices = async (type) => {
  const id = await AsyncStorage.getItem('@user_id');

  // eslint-disable-next-line no-undef
  return fetch(`http://10.0.2.2:3333/device/list/${type}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 404) {
        throw new Error('No Device Found.');
      }
      if (response.status === 500) {
        throw new Error('Server Error.');
      } else {
        throw new Error('Something went wrong.');
      }
    })
    .catch((error) => {
      ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
    });
};

export default ListDevices;
