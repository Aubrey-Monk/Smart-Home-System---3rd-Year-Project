import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text, Button} from 'react-native-paper';
import ListDevices from '../components/listDevices';

const SecurityScreen = (props) => {
  const [deviceList, setDeviceList] = useState([]);
  const {navigation} = props;

  const getDeviceList = useCallback(async () => {
    const data = await ListDevices('Lock');
    setDeviceList(data);
  }, []);

  // component load
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // screen is focused
      await getDeviceList();
    });

    return unsubscribe;
  }, [getDeviceList, navigation]);

  console.log(deviceList);

  return (
    <View>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <View>
            <Text>{item.device_name.toString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.device_id.toString()}
      />
      <Button
        role="button"
        mode="contained"
        onPress={() =>
          props.navigation.navigate('homeStackNavigator', {
            screen: 'Add Device',
          })
        }>
        <Text>Add Device</Text>
      </Button>
    </View>
  );
};

SecurityScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default SecurityScreen;
