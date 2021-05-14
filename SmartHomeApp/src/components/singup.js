import {ToastAndroid} from 'react-native';
import globalStore from './globalStore';

// sends post request to API to addd a new user
const Signup = (props, details) =>
  fetch(`http://${globalStore.serverIP}:3333/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname: details.firstName,
      lastname: details.lastName,
      email: details.email,
      password: details.password,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        ToastAndroid.show(
          'Account created, please log in.',
          ToastAndroid.SHORT,
        );
        props.navigation.navigate('Welcome');
      }
      if (response.status === 400) {
        throw new Error('Failed Validation - Please enter valid information.');
      }
      if (response.status === 500) {
        throw new Error('Server Error.');
      } else if (response.status !== 201) {
        throw new Error('Something went wrong.');
      }
    })
    .catch((error) => {
      ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
    });

export default Signup;
