import {ToastAndroid} from 'react-native';
import globalStore from './globalStore';

const DeleteDevice = async (deviceId) =>
  // eslint-disable-next-line no-undef
  fetch(`http://${globalStore.serverIP}:3333/device/delete/${deviceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        ToastAndroid.show('Device Deleted', ToastAndroid.SHORT);
      }
      if (response.status === 400) {
        throw new Error('Bad Request.');
      }
      if (response.status === 500) {
        throw new Error('Server Error.');
      } else if (response.status !== 200) {
        throw new Error('Something went wrong.');
      }
    })
    .catch((error) => {
      ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
    });
export default DeleteDevice;
