/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const BLOCK_WIDTH = 100
const BLOCK_HEIGHT = 60

export default class App extends React.Component{
  render(){
    return (
      <View style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <View style={{display:'flex',flexDirection:'row',top:50}}>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderTopLeftRadius:15, backgroundColor: 'powderblue',alignItems:'center',justifyContent:'center'}}>
            <Text>Deceased</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'skyblue',alignItems:'center',justifyContent:'center'}}>
            <Text>Infected</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT,borderTopRightRadius:15,  backgroundColor: 'steelblue',alignItems:'center',justifyContent:'center'}}>
            <Text>Recovered</Text>
          </View>
        </View>
        <View style={{display:'flex',flexDirection:'row',top:50}}>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderBottomLeftRadius:15, backgroundColor: 'red',alignItems:'center',justifyContent:'center'}}>
            <Text>0</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'green',alignItems:'center',justifyContent:'center'}}>
            <Text>0</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderBottomRightRadius:15, backgroundColor: 'blue',alignItems:'center',justifyContent:'center'}}>
            <Text>0</Text>
          </View>
        </View>
      </View>
      )
  }
}
