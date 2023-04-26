import React, {useState, useEffect, useRef} from 'react';

import {View, Text, Switch, Alert, AsyncStorage} from 'react-native';
import database from '@react-native-firebase/database';

const SecureAreaScreen = () => {
  const [state, setState] = useState({
    data: {
      latitude: null,
      longitude: null,
    },
  }); // state for the map
  const hasExitedSecureArea = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const {data} = state;
  // const data = {};
  useEffect(() => {
    const ref = database()
      .ref('/UsersData/k6HxiQbOhXPJqfnO9JNz7O3WPPP2/data/')
      .orderByChild('timestamp')
      .limitToLast(1); // limit to the last child

    const listener = ref.on('child_added', snapshot => {
      const data = snapshot.val();
      const {altitude, heading, latitude, longitude, speed, timestamp} = data;

      // Compare the timestamp with the previous state
      if (latitude) {
        console.log('User data: ', timestamp);
        console.log('Vehicles Location: ', latitude, longitude);
        console.log('Heading: ', heading);
        console.log('Times: ', timestamp);

        setState(state => ({
          ...state,
          data: {latitude, longitude},
        }));
        setLoading(false);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      ref.off('child_added', listener);
    };
  }, []);
  useEffect(() => {
    const checkIfExitedSecureArea = async () => {
      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');
      if (
        storedLatitude &&
        storedLongitude &&
        (data.latitude !== parseFloat(storedLatitude) ||
          data.longitude !== parseFloat(storedLongitude))
      ) {
        // Calculate distance between current location and stored location
        const R = 6371e3; // Earth's radius in meters
        const lat1 = (data.latitude * Math.PI) / 180;
        const lat2 = (parseFloat(storedLatitude) * Math.PI) / 180;
        const deltaLat =
          ((parseFloat(storedLatitude) - data.latitude) * Math.PI) / 180;
        const deltaLon =
          ((parseFloat(storedLongitude) - data.longitude) * Math.PI) / 180;
        const a =
          Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        console.log('Distance from stored location: ', distance);

        if (distance > 5) {
          // Vehicle has exited the secure area
          await AsyncStorage.removeItem('latitude');
          await AsyncStorage.removeItem('longitude');
          setIsEnabled(false); // Disable the switch
          setLatitude(null);
          setLongitude(null);
          if (!hasExitedSecureArea.current) {
            // Only show the alert once
            Alert.alert('Vehicle has exited the secure area');
            hasExitedSecureArea.current = true;
          }
        } else {
          hasExitedSecureArea.current = false;
        }
      } else {
        hasExitedSecureArea.current = false;
      }
    };
    if (!loading) {
      checkIfExitedSecureArea();
    }
  }, [data]);

  const toggleSwitch = async () => {
    try {
      setIsEnabled(previousState => !previousState);
      if (!isEnabled) {
        await AsyncStorage.setItem('latitude', data.latitude.toString());
        await AsyncStorage.setItem('longitude', data.longitude.toString());
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        console.log('Latitude and Longitude Set ');
        Alert.alert('Switch Enabled', 'Vehicle is now being monitored');
      } else {
        await AsyncStorage.removeItem('latitude');
        await AsyncStorage.removeItem('longitude');
        setLatitude(null);
        setLongitude(null);
        console.log('Latitude and Longitude Removed');
        Alert.alert('Switch Disabled', 'Vehicle monitoring stopped');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      {latitude && longitude && (
        <View>
          <Text style={{color: '#002B5B', fontSize: 18}}>
            Latitude: {data.latitude}
          </Text>
          <Text style={{color: '#002B5B', fontSize: 18}}>
            Longitude: {data.longitude}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SecureAreaScreen;
