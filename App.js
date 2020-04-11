/**
 * COVID-19 Puerto Rico
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
import MunicipiosScreen from './MunicipiosScreen'


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Tab.Screen name="Municipios" component={MunicipiosScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
//         <Stack.Screen name="Settings" component={SettingsScreen} />
//
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
