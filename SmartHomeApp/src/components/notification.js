import PushNotification from 'react-native-push-notification';

const LocalNotification = (
  bigText,
  subText,
  vibrate,
  playSound,
  title,
  message,
) => {
  PushNotification.localNotification({
    channelId: 'default-channel',
    showWhen: true,
    autoCancel: true,
    bigText,
    subText,
    color: 'red',
    vibrate,
    vibration: 1000,
    tag: 'some_tag',
    ongoing: false,
    priority: 'high',
    visibility: 'private',
    ignoreInForeground: false,
    onlyAlertOnce: false,
    timeoutAfter: null,
    id: 0,
    title,
    message,
    userInfo: {},
    playSound,
    soundName: 'default',
    number: 10,
  });
};

export default LocalNotification;
