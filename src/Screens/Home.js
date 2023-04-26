import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Button,
  Switch,
  Alert,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Share,
} from 'react-native';
import MapView, {Marker, AnimatedRegion, Circle} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {imagePaths} from '../constants/imagePaths';
import Enable from '../components/Enable';
import database from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import Login from './src/Screens/Login';
import {showSuccess} from '../components/helper';
// import {Button} from 'native-base';
import {
  getCurrentLocation,
  locationPermission,
  getDataFromDatabase,
  getData,
} from '../components/helper';
// const screen = Dimensions.get('window');
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = '**************-qNnuw';

const Home = ({navigation}) => {
  const mapRef = useRef();
  const markerRef = useRef();
  const liveRef = useRef();
  const hasExitedSecureArea = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);

  // const [state, setState] = useState('No Data');
  const [fitToCoordinates, setFitToCoordinates] = useState(true);
  const [speed, setSpeed] = useState('0');
  const [altitude, setAltitude] = useState('0');
  const [heading, setHeading] = useState(0);
  const [prevtimestamp, setTimestamp] = useState('');
  const [timestampl, setTimestampl] = useState('');
  const [drawCircle, setdrawCircle] = useState(false);
  const iconName = fitToCoordinates ? 'location-on' : 'location-off';
  const [state, setState] = useState({
    curLocation: {
      latitude: 18.4647584,
      longitude: 73.867477,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    vehicleLocation: {
      latitude: 18.463764319172043,
      longitude: 73.86819294853474,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: new AnimatedRegion({
      latitude: 18.463764319172043,
      longitude: 73.86819294853474,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    livLoc: new AnimatedRegion({
      latitude: 18.463764319172043,
      longitude: 73.86819294853474,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    camera: {
      center: {
        latitude: 18.4647584,
        longitude: 73.867477,
      },
      heading: 0,
      pitch: 0,
      zoom: 15,
    },
  });

  const {curLocation, vehicleLocation, coordinate, livLoc} = state;

  // useEffect(() => {
  //   getVehicleLocation();
  // }, []);
  // const getVehicleLocation = async () => {
  //   const data = await getDataFromDatabase();
  // };
  const onMap = () => {
    if (fitToCoordinates) {
      mapRef.current.fitToCoordinates([curLocation, vehicleLocation], {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
      });
    }
  };
  const rotate = () => {
    // rotate the map to the heading of the vehicle
    const angle = parseInt(heading) || 0;
    mapRef.current.animateCamera({
      heading: angle,
      pitch: 0,
      zoom: 15,
    });
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async () => {
    const locPermisssionDenied = await locationPermission();
    if (locPermisssionDenied) {
      const {latitude, longitude} = await getCurrentLocation();
      console.log('Your     Location: ', longitude, latitude);
      // animateL(latitude, longitude);
      setState(state => ({...state, curLocation: {latitude, longitude}}));
    }
  };

  useEffect(() => {
    const ref = database()
      .ref('/UsersData/k6HxiQbOhXPJqfnO9JNz7O3WPPP2/data/')
      .orderByChild('timestamp')
      .limitToLast(1); // limit to the last child

    const listener = ref.on('child_added', snapshot => {
      const data = snapshot.val();
      const {altitude, heading, latitude, longitude, speed, timestamp} = data;

      // Compare the timestamp with the previous state
      if (prevtimestamp !== timestamp) {
        console.log('User data: ', timestamp);
        setAltitude(altitude);
        setHeading(heading);
        console.log('Heading: ', heading);
        setSpeed(speed);
        animate(latitude, longitude);
        console.log('Vehicles Location: ', latitude, longitude);
        console.log('Heading: ', heading);
        setTimestampl(timestamp);
        console.log('Time: ', timestamp);
        setState(state => ({
          ...state,
          vehicleLocation: {latitude, longitude},
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
        (vehicleLocation.latitude !== parseFloat(storedLatitude) ||
          vehicleLocation.longitude !== parseFloat(storedLongitude))
      ) {
        // Calculate distance between current location and stored location
        const R = 6371e3; // Earth's radius in meters
        const lat1 = (vehicleLocation.latitude * Math.PI) / 180;
        const lat2 = (parseFloat(storedLatitude) * Math.PI) / 180;
        const deltaLat =
          ((parseFloat(storedLatitude) - vehicleLocation.latitude) * Math.PI) /
          180;
        const deltaLon =
          ((parseFloat(storedLongitude) - vehicleLocation.longitude) *
            Math.PI) /
          180;
        const a =
          Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        console.log('Distance from stored location: ', distance);

        if (distance > 10) {
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
  }, [vehicleLocation]);

  const toggleSwitch = async () => {
    try {
      setIsEnabled(previousState => !previousState);
      if (!isEnabled) {
        await AsyncStorage.setItem(
          'latitude',
          vehicleLocation.latitude.toString(),
        );
        await AsyncStorage.setItem(
          'longitude',
          vehicleLocation.longitude.toString(),
        );
        setLatitude(vehicleLocation.latitude);
        setLongitude(vehicleLocation.longitude);
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

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 2000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const animateL = (latitude, longitude) => {
    const newCoordinateL = {latitude, longitude};
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        liveRef.current.animateMarkerToCoordinate(newCoordinateL, 4000);
      }
    } else {
      livLoc.timing(newCoordinate).start();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 4000);
    return () => clearInterval(interval);
  });
  const onShareLocation = async () => {
    try {
      const url = `Hey my vehicle - Activa MH12 HU4556's location can be viewed by clicking here- https://www.google.com/maps/search/?api=1&query=${vehicleLocation.latitude},${vehicleLocation.longitude}`;
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      {/* showSuccess('Login Successfully'); */}
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={curLocation}
          rotateEnabled={true}
          showsUserLocation={true}
          zoomTapEnabled={true}
          showsCompass={true}
          showsBuildings={true}
          followsUserLocation={true}
          toolbarEnabled={true}
          onMapReady={rotate}>
          {vehicleLocation.latitude > 0 && (
            <Marker.Animated
              ref={markerRef}
              title="Your Activa's Location"
              coordinate={coordinate}
              anchor={{x: 0.6, y: 0.6}}
              description={
                "This is your vehicle's location present at this moment"
              }
              rotation={parseInt(heading) || 0}>
              <Image
                source={require('../assets/img/activa.png')}
                style={{
                  height: 90,
                  width: 90,
                  transform: [{rotate: `${heading}deg`}],
                }}
                resizeMode="center"
              />
            </Marker.Animated>
          )}
          {vehicleLocation.latitude > 0 && (
            <MapViewDirections
              origin={curLocation}
              destination={vehicleLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="hotpink"
              optimizeWaypoints={false}
              resetOnChange={false}
              onReady={onMap}
            />
          )}
        </MapView>
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={onShareLocation}
            style={styles.shareButton}>
            <MaterialIcons
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}
              name="share"
              size={22}
              color="#F9F5EB"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFitToCoordinates(!fitToCoordinates);
              console.log('Fit to coordinates: ', fitToCoordinates);
            }}
            style={styles.locationPin}>
            <MaterialIcons
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                color: '#F9F5EB',
              }}
              name={iconName}
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.btmcard}>
        <View style={styles.firstTile}>
          <Text style={styles.textTitle}>Your Vehicle: Activa </Text>
          <Switch
            trackColor={{false: '#767577', true: '#c4c3c3'}}
            thumbColor={isEnabled ? '#EA5455' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.textcard}>
          <Text style={styles.text}>Speed: {parseInt(speed)} KM/Hr </Text>
          <Text style={styles.text}>Altitude: {parseInt(altitude)}m </Text>
          {/* <Button onPress={onTap} title="Database" /> */}
        </View>
        <Text style={styles.timestamp}>Timestamp: {timestampl.slice(6)} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btmcard: {
    backgroundColor: '#F9F5EB',
    width: '100%',
    padding: 20,
    borderStyle: 'solid',
    shadowRadius: 10,
    shadowColor: 'black',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  firstTile: {
    // flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  textTitle: {
    // justifyContent: 'space-evenly',
    color: '#002B5B',
    fontSize: 21,
    paddingLeft: 2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textcard: {padding: 20, flexDirection: 'row', justifyContent: 'space-around'},
  text: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    color: '#002B5B',
    fontSize: 18,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 18,
    textAlign: 'center',
    color: '#002B5B',
    fontWeight: '500',
  },
  shareButton: {
    width: 50,
    height: 50,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#EA5455',
    marginBottom: 10,
  },
  locationPin: {
    width: 50,
    height: 50,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#EA5455',
    marginBottom: 60,
  },
  shareText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapv: {marginStart: 20, Height: 400, Width: 200},
});

export default Home;
