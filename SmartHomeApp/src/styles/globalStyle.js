import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  twoButtonView: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 20,
    height: '20%',
    margin: '7%',
  },
  submitButton: {
    borderRadius: 20,
    height: '40%',
    margin: '7%',
  },
  buttonContent: {
    borderRadius: 20,
    height: '100%',
  },
  textInputView: {
    flex: 3,
    padding: '5%',
    justifyContent: 'space-evenly',
  },
  submitButtonView: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 18,
    marginTop: '5%',
    marginLeft: '5%',
  },

  listView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 3,
    margin: '2%',
    padding: '2%',
  },
});
