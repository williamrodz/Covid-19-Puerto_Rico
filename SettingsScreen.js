import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';



export default class SettingsScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {evenLicensePlate:null}
  }

  saveLicensePlateParity = (number) =>{
    const numberIsEven = number % 2 == 0
    console.log(`Added ${numberIsEven ? 'even' : 'odd'} ending license plate`)
    this.setState({evenLicensePlate: numberIsEven})
  }

  saveSettingsButton = () =>{
    this.props.navigation.navigate("Home",{evenLicensePlate:this.state.evenLicensePlate})

  }

  render(){
    return (
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{flexGrow:1,flexDirection: 'column',alignItems: 'center',justifyContent: 'center'}}>
        <Text>¿En qué digito termina tu tablilla?</Text>
        <View style={{flexDirection: 'row',width: 300, height: 100, backgroundColor: 'skyblue',alignItems:'center',justifyContent:'center',borderRadius: 15}}>
          <Text style ={{fontSize: 50,fontFamily: 'Menlo',color:'grey'}}>000-00</Text>
          <TextInput
            style={{ height: 60, borderColor: 'gray', borderWidth: 1,fontSize: 50,fontFamily: 'Menlo'}}
            onChangeText={text => this.saveLicensePlateParity(text)}
            // value={value}
            placeholder = {"X"}
            keyboardType = "number-pad"
            maxLength = {1}
          />
        </View>
        <Button title="Save" onPress={()=>this.saveSettingsButton()}/>
      </ScrollView>
    )
  }
}
