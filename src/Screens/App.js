import React, {Component, useState, useRef} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_MAPS_APIKEY = 'AIzaSyCGuwdMfunKwb6JlBwaXMXGGo4YM-qNnuw';
const App = () => {
  const [state, setState] = useState({
    curLocation: {
      latitude: 18.4647584,
      longitude: 73.867477,
      latitudeDelta: 0.005,
      longitudeDelta: 0.006,
    },
    vehicleLocation: {
      latitude: 18.463764319172043,
      longitude: 73.86819294853474,
      latitudeDelta: 0.005,
      longitudeDelta: 0.006,
    },
  });
  const mapRef = useRef();
  const {curLocation, vehicleLocation} = state;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.height : 0,
      }}>
      <StatusBar
        animated={true}
        backgroundColor="lightblue"
        barStyle="dark-content"
        showHideTransition="slide"
        hidden={false}
      />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={curLocation}>
        <Marker
          title="Your Activa's Location"
          coordinate={vehicleLocation}
          anchor={{x: 0.5, y: 0.5}}
          description={"This is your vehicle's location"}
          icon={require('./img/activa.png')}
          // image={require('./img/activa.png')}
        />
        <Marker
          title="Your location"
          coordinate={curLocation}
          pinColor={'purple'}
        />
        <MapViewDirections
          origin={curLocation}
          destination={vehicleLocation}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="hotpink"
          optimizeWaypoints={true}
          onReady={result => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 80,
                bottom: 300,
                left: 50,
                top: 100,
              },
            });
          }}
        />
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
  mapv: {marginStart: 20, Height: 400, Width: 200},
});

export default App;
