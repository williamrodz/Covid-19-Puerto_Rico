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
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont()

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
import MunicipiosScreen from './MunicipiosScreen'


const Tab = createBottomTabNavigator();

export default class MyTabs extends React.Component {
  constructor(props){
    super(props)
    this.state = {evenLicensePlate:null}
  }


  render (){
    return (
      <NavigationContainer>
        <Tab.Navigator tabBarOptions={{activeBackgroundColor:'white'}}>
          <Tab.Screen name="Home" component={HomeScreen} initialParams={{ evenLicensePlate: null}}
          options={{
            tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          )}} />
          <Tab.Screen name="Municipios" component={MunicipiosScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
            <Icon name="navicon" size={size} color={color} />
          )}} />
          <Tab.Screen name="Settings" component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
            <Icon name="gear" size={size} color={color} />
          )}} />
        </Tab.Navigator>
      </NavigationContainer>

    );

  }

}
