import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView
} from 'react-native';


// import {getTwoDigitNumber,getLastXDaysCode} from './HomeScreen'

DATA_LAG_DAYS = 2
function getTwoDigitNumber(number){
  if (number < 10){
    return `0${number}`
  }
}

function getLastXDaysCode(numDays){
  days = []
  for (var i = 0; i < numDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (i+DATA_LAG_DAYS));
    console.log(`${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`)
    days.push({month:d.getMonth()+1,day:d.getDate(),year:d.getFullYear()})
  }
  return days

}




import RNFetchBlob from 'rn-fetch-blob'
const COVID_DATA_URL_PREFIX = "https://raw.githubusercontent.com/Code4PuertoRico/covid19-pr-api/master/data/PuertoRicoTaskForce/"
const MUNICIPIOS_CSV_SUFFIX = "/CSV/municipios.csv"


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
        {getCell(municipios[municipio].totalCases)}
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


  getMunicipioDataForLastXDays = async (numDays) =>{
    const days = getLastXDaysCode(numDays)
    var dataForDays = []
    for (var i = 0; i < days.length; i++) {
      dataForDays.push(this.getMunicipioDataForDay(days[i]))
    }
    return Promise.all(dataForDays)
  }


    getMunicipioDataForDay = async (dayObject) =>{

      const day = getTwoDigitNumber(dayObject.day)
      const month = dayObject.month
      const year = dayObject.year

      const url = COVID_DATA_URL_PREFIX+`${month}-${day}-${year}` + MUNICIPIOS_CSV_SUFFIX
      return RNFetchBlob.fetch('GET',url).then(data=>{
        let text = data.text()
        // console.log(`Text is \n${text}`)
        var rowsText = text.split("\"").join("")
        var rows = rowsText.split("\n")
        for (var i = 0; i < rows.length; i++) {
          rows[i] = rows[i].split(",")
        }
        municipios = {}
        MUNICIPIOS_START_i = 2 // There is no + 78 right bound, since we do not have data for all 78 municipalities
        MUNICIPIO_NAME_i = 0
        MUNICIPIO_CASES_i = 1
        for (var i = MUNICIPIOS_START_i; i < rows.length; i++) {
          const row = rows[i]
          // console.log(`Municipio row: ${row}`)
          const name = row[MUNICIPIO_NAME_i]
          const caseNumber = row[MUNICIPIO_CASES_i]
          dataForMunicipio = {name:name,totalCases:caseNumber}
          municipios[name] = dataForMunicipio
        }
        return {...dayObject,municipiosData:municipios}
      })
      .catch(error=>{
        console.log(`Error retrieving municipios data: for ${day}` +error)
      })

    }


  loadMunicipiosData = async () =>{
    const municipioDataForLastXDays = await this.getMunicipioDataForLastXDays(1)
    const todaysMunicipiosData = municipioDataForLastXDays[0].municipiosData
    this.setState({municipioDataToday:todaysMunicipiosData})

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
