import {Center} from 'native-base';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MainIcon from '../assets/img/main.svg';

const Onboard = ({navigation}) => {
  const onTap = () => {
    navigation.navigate('LoginScreen');
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F5EB',
      }}>
      <View>
        <Text style={styles.title}>TRACK-ON</Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#002B5B',
            alignSelf: 'center',
          }}>
          GPS tracking for your vehicles.
        </Text>
      </View>
      <View style={styles.icon}>
        <MainIcon width={300} height={300} />
      </View>
      <TouchableOpacity style={styles.getstarted} onPress={onTap}>
        <Text
          style={{
            fontSize: 18,
            // fontWeight: 'bold',
            color: '#F9F5EB',
            // alignSelf: 'flex-end',
            fontFamily: 'Roboto-MediumItalic',
          }}>
          Get started
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#F9F5EB" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 80,
    fontFamily: 'Inter-Bold',
    fontSize: 56,
    // fontWeight: '900',
    color: '#002B5B',
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getstarted: {
    backgroundColor: '#EA5455',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 80,
  },
});
export default Onboard;
