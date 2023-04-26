import {showMessage} from 'react-native-flash-message';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
          speed: position?.coords?.speed,
        };
        console;
        resolve(cords);
      },
      error => {
        reject(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve('granted');
        }
        return reject('Location Permission denied');
      })
      .catch(error => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
      });
  });
export const getDataFromDatabase = () => {
  return new Promise((resolve, reject) => {
    database()
      .ref(
        '/UsersData/xeO8armvbxUPfF7TYdI5m1aWGk43/data/2023-03-12-04:41:00PM/',
      )
      .once('value')
      .then(snapshot => {
        const data = snapshot.val();
        resolve(data);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};
export const getData = () => {
  return new Promise((resolve, reject) => {
    database()
      .ref('/UsersData/xeO8armvbxUPfF7TYdI5m1aWGk43/data/')
      .on('child_added', snapshot => {
        const data = snapshot.val();
        // console.log('User data: ', data);
        resolve(data);
      })
      .catch(error => {
        throw error;
      });
  });
};
const showError = message => {
  showMessage({
    message,
    type: 'danger',
    icon: 'danger',
  });
};

const showSuccess = message => {
  showMessage({
    message,
    type: 'success',
    icon: 'success',
  });
};

export {showError, showSuccess};
