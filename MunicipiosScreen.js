import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl
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
  var lastRow = undefined
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
    if (municipio.indexOf("No disponible") != -1){
      municipioDisplayName = "No disponible"
    } else {
      municipioDisplayName = municipio
    }

    const borderTopLeftRadius = i == 0 ? 15 : 0
    const borderTopRightRadius = i == 0 ? 15 : 0
    const borderBottomLeftRadius = i == municipioNames.length - 1 ? 15 : 0
    const borderBottomRightRadius = i == municipioNames.length - 1 ? 15 : 0
    // const cellColor
    // // if municipio.totalCases >= 30

    var rowContent = (
      <View key={municipioDisplayName} style={{display:'flex',flexDirection:'row'}}>
        {getCell(municipioDisplayName)}
        {getCell(municipios[municipio].confirmedCases)}
      </View>
    )
    if (municipio.indexOf("No disponible") != -1){
      lastRow = rowContent
    }
    else if (municipio.indexOf("timestamp") != -1){
      continue
    }
    else{
      allContent.push(rowContent)
    }

  }
  allContent.push(lastRow)
  return allContent

}

export default class Municipios extends React.Component{
  constructor(props){
    super(props)
    this.state = {municipioDataToday:[]}
  }

  _onRefresh = () => {
    console.log("REFRESHING")
    this.setState({refreshing: true});
    this.loadMunicipiosData().then(() => {
      this.setState({refreshing: false});
    });
  }

  loadMunicipiosData = async () =>{
    const municipiosRef = await firestore().doc("data/municipios").get() //().collection('data')
    if (municipiosRef.exists){
      municipiosData = municipiosRef.data()
      console.log("municipiosData",municipiosData)
      this.setState({municipioDataToday:municipiosData.all})
    }

  }

  async componentDidMount (){
    this.loadMunicipiosData()
  }

  render (){
    return (
      <SafeAreaView style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'stretch',justifyContent:'center'}}>
        <ScrollView contentContainerStyle={{flexGrow:1,display:'flex',flexDirection:'column',alignItems: 'center',margin:SCROLLVIEW_MARGIN}}
        refreshControl={
           <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this._onRefresh()} />
         }
        >

          <View style={{display: "flex",flexDirection: 'column'}}>
            {this.state.municipioDataToday ? getMunicipiosRowsWithData(this.state.municipioDataToday) : <Text>Hi</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>

    )

  }
}
