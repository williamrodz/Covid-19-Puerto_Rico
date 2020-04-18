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
const MUNICIPIO_BLOCK_WIDTH = 150
const MUNICIPIO_BLOCK_HEIGHT = 50

function getCell(text,backgroundColor="ghostwhite",isLeftCell, width=MUNICIPIO_BLOCK_WIDTH,height=MUNICIPIO_BLOCK_HEIGHT,borderWidth=0,borderColor='silver'){
  return (
    <View style={{borderColor: borderColor, borderWidth: borderWidth,
      borderTopLeftRadius: isLeftCell ? 15 : 0,borderTopRightRadius: isLeftCell ? 0 : 15,borderBottomLeftRadius: isLeftCell ? 15 : 0, borderBottomRightRadius: isLeftCell ? 0 : 15,
      borderTopWidth: 0.25,borderBottomWidth: 0.25,
      borderLeftWidth: isLeftCell ? 1 : 0, borderRightWidth: isLeftCell ? 0 : 1,
      width: width, height: height, backgroundColor: backgroundColor,
      alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize: 20,}}>{text}</Text>
    </View>
  )
}


function getMunicipiosRowsWithData(municipios,totalCountedByMunicipio){
  const allContent = []

  const municipioNames = Object.keys(municipios)
  var lastRow = undefined
  for (var i = 0; i < municipioNames.length; i++) {

    if (i==0){
      allContent.push(
        <View key={"header"} style={{display:'flex',flexDirection:'row'}}>
          {getCell("Municipio","gold",true)}
          {getCell("Casos Positivos","gold",false)}
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
    var portion = (municipios[municipio].confirmedCases / totalCountedByMunicipio)
    var coeff = (50 * portion)
    // var color  = "white"
    var rowContent = (
      <View key={municipioDisplayName} style={{display:'flex',flexDirection:'row'}}>
        {getCell(municipioDisplayName,`hsl(6, 50%, ${95 - coeff}%)`,true)}
        {getCell(municipios[municipio].confirmedCases,`hsl(6, 50%, ${95 - coeff}%)`,false)}
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
      municipiosData = municipiosRef.data().all
      municipios = Object.keys(municipiosData)
      var totalCountedByMunicipio = 0
      for (var i = 0; i < municipios.length; i++) {
        municipio = municipios[i]

        if (municipio.indexOf("No disponible")== -1 && municipio.indexOf("timestamp")== -1){
          totalCountedByMunicipio += municipiosData[municipio].confirmedCases
        }
      }
      console.log(`TOTAL: ${totalCountedByMunicipio}`)
      this.setState({municipioDataToday:municipiosData,totalCountedByMunicipio:totalCountedByMunicipio})
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
          <View style={{display: "flex",flexDirection: 'column',}}>
            {this.state.municipioDataToday ? getMunicipiosRowsWithData(this.state.municipioDataToday,this.state.totalCountedByMunicipio) : <Text>Hi</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>

    )

  }
}
