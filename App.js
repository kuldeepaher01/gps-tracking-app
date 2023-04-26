// In App.js in a new project

import * as React from 'react';
import {View, Button, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Screens/Home';
import Login from './src/Screens/Login';
import Databse from './src/Screens/dbcon';
import LoginScreen from './src/Screens/Login';
import Onboard from './src/Screens/Onboarding';
import Register from './src/Screens/Register';
console.log(Home);

// function HomeScreen() {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboard"
          component={Onboard}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
          // options={{
          //   title: 'Home', //Set Header Title
          //   // headerShadowVisible: false,
          //   headerLeft: () => null,
          // }}
        />

        <Stack.Screen
          name="Databse"
          component={Databse}
          options={{
            title: 'Databse',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
