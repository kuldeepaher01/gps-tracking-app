import React, {useState} from 'react';
// import {
//   ImageBackground,
//   SafeAreaView,
//   StyleSheet,
//   StatusBar,
//   Platform,
//   Text,
//   View,
// } from 'react-native';
import {View, Text, Switch, StyleSheet} from 'react-native';

const Enable = () => {
  const renderText = () => {
    return (
      <View>
        <Text style={{color: 'black'}}>Hello</Text>
      </View>
    );
  };
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () =>
    setIsEnabled(previousState => !previousState, renderText());

  return (
    <View>
      <Switch
        trackColor={{false: 'black', true: '#81b0ff'}}
        thumbColor={isEnabled ? 'red' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{transform: [{scaleX: 1.1}, {scaleY: 1.1}]}}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default Enable;
