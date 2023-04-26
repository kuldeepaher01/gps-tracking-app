// import {Button} from '@rneui/base';
// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// // import {firebase, database} from '@react-native-firebase/database';

// // const reference = firebase
// //   .app()
// //   .database(
// //     'https://nodemcu-gps-bf1f1-default-rtdb.asia-southeast1.firebasedatabase.app/',
// //   );

// // database()
// //   .ref('/UsersData/r1DmGTBC6qRC6aTHmklod1JZpMq1/data/')
// //   .once('value')
// //   .then(snapshot => {
// //     console.log('User data: ', snapshot.val());
// //   });

// const Databse = ({navigation}) => {
//   const onTap = () => {
//     navigation.navigate('Home');
//   };

//   return (
//     <View style={styles.container}>
//       {/* <Text style={{backgroundColor: 'black'}}>Login Page</Text> */}
//       <Button onPress={onTap} title="Log In" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     marginHorizontal: 36,
//   },
//   button: {
//     padding: 12,
//     marginBottom: 12,
//   },
// });
// export default Databse;

import * as React from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Button} from '@rneui/base';
// import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';

import database from '@react-native-firebase/database';

function Databse() {
  const [state, setState] = useState('No Data');
  database()
    .ref(
      '/UsersData/xeO8armvbxUPfF7TYdI5m1aWGk43/data/2023-03-12-04:41:43PM/latitude/',
    )
    .once('value')
    .then(snapshot => {
      setState(snapshot.val());
      console.log('User data: ', snapshot.val());
    });
  return (
    <View>
      <Button
        buttonStyle={{width: 150}}
        containerStyle={{margin: 10}}
        disabledStyle={{
          borderWidth: 2,
          borderColor: '#00F',
        }}
        disabledTitleStyle={{color: '#00F'}}
        //   linearGradientProps={null}
        //   icon={<Icon name="database" size={15} color="#0FF" />}
        //   iconContainerStyle={{background: '#000'}}
        //   iconRight
        loadingProps={{animating: true}}
        loadingStyle={{}}
        onPress={() => alert('click')}
        title="Go Back?"
        titleProps={{}}
        titleStyle={{marginHorizontal: 5}}
      />
      <Text style={{fontSize: 20, color: 'black'}}>{state}</Text>
    </View>
  );
}
export default Databse;
