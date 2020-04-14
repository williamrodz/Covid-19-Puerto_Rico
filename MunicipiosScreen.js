import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView
} from 'react-native';

import firestore from '@react-native-firebase/firestore';


const SCROLLVIEW_MARGIN = 5
const MUNICIPIO_BLOCK_WIDTH = 125
const MUNICIPIO_BLOCK_HEIGHT = 40

function getCell(text,backgroundColor="ghostwhite",borderTopLeftRadius=0,borderTopRightRadius=0,borderBottomLeftRadius=0,borderBottomRightRadius=0, width=MUNICIPIO_BLOCK_WIDTH,height=MUNICIPIO_BLOCK_HEIGHT,borderWidth=1,borderColor='black'){
  return (
    <View style={{borderColor: borderColor, borderWidth: borderWidth,
      borderTopLeftRadius: borderTopLeftRadius,borderTopRightRadius: borderTopRightRadius,borderBottomLeftRadius: borderBottomLeftRadius, borderBottomRightRadius: borderBottomRightRadius,
      width: width, height: height, backgroundColor: backgroundColor,
      alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize: 15}}>{text}</Text>
    </View>
  )
}


function getMunicipiosRowsWithData(municipios){
  const allContent = []

  const municipioNames = Object.keys(municipios)
  for (var i = 0; i < municipioNames.length; i++) {

    if (i==0){
      allContent.push(
        <View key={"header"} style={{display:'flex',flexDirection:'row'}}>
          {getCell("Municipio","gold",15)}
          {getCell("Casos Positivos","gold",0,15)}
        </View>
      )
    }


    const municipio = municipioNames[i]
    const borderTopLeftRadius = i == 0 ? 15 : 0
    const borderTopRightRadius = i == 0 ? 15 : 0
    const borderBottomLeftRadius = i == municipioNames.length - 1 ? 15 : 0
    const borderBottomRightRadius = i == municipioNames.length - 1 ? 15 : 0
    // const cellColor
    // // if municipio.totalCases >= 30

    var rowContent = (
      <View key={municipio} style={{display:'flex',flexDirection:'row'}}>
        {getCell(municipio)}
        {getCell(municipios[municipio].confirmedCases)}
      </View>
    )
    allContent.push(rowContent)

  }
  return allContent

}

export default class Municipios extends React.Component{
  constructor(props){
    super(props)
    this.state = {municipioDataToday:[]}
  }

  loadMunicipiosData = async () =>{
    const municipiosRef = await firestore().doc("data/municipios").get() //().collection('data')
    if (municipiosRef.exists){
      municipiosData = municipiosRef.data()
      console.log("municipiosData",municipiosData)
      this.setState({municipioDataToday:municipiosData})
    }

  }

  async componentDidMount (){
    this.loadMunicipiosData()
  }

  render (){
    return (
      <SafeAreaView style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <ScrollView contentContainerStyle={{flexGrow:1,display:'flex',flexDirection:'column',alignItems: 'center',margin:SCROLLVIEW_MARGIN}}>
          <View style={{display: "flex",flexDirection: 'column'}}>
            {this.state.municipioDataToday ? getMunicipiosRowsWithData(this.state.municipioDataToday) : <Text>Hi</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>

    )

  }
}
