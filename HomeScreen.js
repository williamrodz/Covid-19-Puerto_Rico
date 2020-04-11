import React from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

//To render a responsive chart, use Dimensions react-native library to get the width of the screen of your device like such
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

import {
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RNFetchBlob from 'rn-fetch-blob'
const DATA_LAG_DAYS = 1

const SCROLLVIEW_MARGIN = 5

const BLOCK_WIDTH = 100
const BLOCK_HEIGHT = 60

const DAYS_FOR_EVEN_PLATES = {1:true,3:true,5:true}
const DAYS_FOR_ODD_PLATES = {2:true,4:true,6:true}

const CAN_DRIVE_TEXT = "Puedes guiar"
const CANT_DRIVE_TEXT = "Esta prohibido guiar"

const GO_COLOR = "#2ecc71"
const STOP_COLOR = "#c0392b"

const DAYS_OF_WEEK_SPANISH = {0:"domingo",1:"lunes",2:"martes",3:"miércoles",4:"jueves",5:"viernes",6:"sábado"}
const SAMPLE_DATA_URL =  "https://raw.githubusercontent.com/Code4PuertoRico/covid19-pr-api/master/data/PuertoRicoTaskForce/4-07-2020/CSV/resumen.csv"
const COVID_DATA_URL_PREFIX = "https://raw.githubusercontent.com/Code4PuertoRico/covid19-pr-api/master/data/PuertoRicoTaskForce/"
const SUMMARY_CSV_SUFFIX = "/CSV/resumen.csv"
const MUNICIPIOS_CSV_SUFFIX = "/CSV/municipios.csv"

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

function getTwoDigitNumber(number){
  if (number < 10){
    return `0${number}`
  }
}

// <View style={{display:'flex',flexDirection:'row'}}>
//   <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'chartreuse',alignItems:'center',justifyContent:'center'}}>
//     <Text>{this.state.deceased}</Text>
//   </View>
//   <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'green',alignItems:'center',justifyContent:'center'}}>
//     <Text>{this.state.positiveToday}</Text>
//   </View>
// </View>

function getMunicipiosRowsWithData(municipios){
  const allContent = []
  MUNICIPIO_BLOCK_WIDTH = 125
  MUNICIPIO_BLOCK_HEIGHT = 40
  const municipioNames = Object.keys(municipios)
  for (var i = 0; i < municipioNames.length; i++) {
    const municipio = municipioNames[i]
    const borderTopLeftRadius = i == 0 ? 15 : 0
    const borderTopRightRadius = i == 0 ? 15 : 0
    const borderBottomLeftRadius = i == municipioNames.length - 1 ? 15 : 0
    const borderBottomRightRadius = i == municipioNames.length - 1 ? 15 : 0
    // const cellColor
    // // if municipio.totalCases >= 30


    var rowContent = (
      <View key={municipio} style={{display:'flex',flexDirection:'row'}}>
        <View style={{borderColor: 'black', borderWidth: 1, borderTopLeftRadius: borderTopLeftRadius,borderBottomLeftRadius: borderBottomLeftRadius, width: MUNICIPIO_BLOCK_WIDTH, height: MUNICIPIO_BLOCK_HEIGHT, backgroundColor: 'ghostwhite',alignItems:'center',justifyContent:'center'}}>
          <Text>{municipio}</Text>
        </View>
        <View style={{borderColor: 'black', borderWidth: 1,borderTopRightRadius: borderTopRightRadius,borderBottomRightRadius:borderBottomRightRadius, width: MUNICIPIO_BLOCK_WIDTH, height: MUNICIPIO_BLOCK_HEIGHT, backgroundColor: 'ghostwhite',alignItems:'center',justifyContent:'center'}}>
          <Text>{municipios[municipio].totalCases}</Text>
        </View>
      </View>

    )
    allContent.push(rowContent)

  }
  return allContent


}

export default class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {canDriveToday:true,evenLicensePlate:null,
      deceased:0,positiveToday:0,recovered:0,
      updateSettingsFunc:this.updateSettings}
  }

  updateSettings = (newState) =>{
    console.log("Updating state")
    console.log(`New state is ${newState}`)
    console.log(`New state keys are ${Object.keys(newState)}`)

    this.setState(newState)

  }

  settingsButton = () =>{
    this.props.navigation.navigate('Settings',{...this.state})

  }

  getCOVID19DataForLastXDays = async (numDays) => {
    const days = getLastXDaysCode(numDays)
    var dataForDays = []
    for (var i = 0; i < days.length; i++) {
      dataForDays.push(this.getCOVIDDataForDay(days[i]))
    }
    return Promise.all(dataForDays)

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

  getCOVIDDataForDay = async (dayObject) =>{
    const day = getTwoDigitNumber(dayObject.day)
    const month = dayObject.month
    const year = dayObject.year

    // console.log(`Getting data for ${month}-${day}-${year}`)

    const url = COVID_DATA_URL_PREFIX+`${month}-${day}-${year}` + SUMMARY_CSV_SUFFIX
    // console.log(`Calling url:\n${url}`)

    return RNFetchBlob.fetch('GET',url).then(data=>{
      let text = data.text()
      // console.log(`Text is \n${text}`)
      var rowsText = text.split("\"").join("")
      var rows = rowsText.split("\n")
      for (var i = 0; i < rows.length; i++) {
        rows[i] = rows[i].split(",")
      }
      let totalPositive = rows[1][4]
      let totalTests = rows[5][4]
      return {...dayObject,totalPositive:totalPositive,totalTests:totalTests}
    })
    .catch(error=>{
      console.log(`Error retrieving covid data: for ${day}` +error)
    })

  }
  loadCOVID19Data = async () =>{
    const municipioDataForLastXDays = await this.getMunicipioDataForLastXDays(1)
    const todaysMunicipiosData = municipioDataForLastXDays[0].municipiosData


    const dataForLastXDays = await this.getCOVID19DataForLastXDays(3)
    var weeksPositives = []
    var dateAbbreviations = []
    for (var i = 0; i < dataForLastXDays.length; i++) {
      const covidData = dataForLastXDays[i]
      const dateAbbreviation = `${covidData.month}-${covidData.day}`
      console.log(`${dateAbbreviation} has ${covidData.totalPositive}`)
      if (i == 0 ){
        this.setState({positiveToday:covidData.totalPositive,totalTests:covidData.totalTests,municipioDataToday:todaysMunicipiosData})
      }
      weeksPositives.push(covidData.totalPositive)
      dateAbbreviations.push(dateAbbreviation)
      if (i==dataForLastXDays.length - 1){
        this.setState({weeksPositives:weeksPositives.reverse(),dateAbbreviations:dateAbbreviations.reverse()})

      }
    }
  }

  async componentDidMount (){
    this.loadCOVID19Data()

  }

  render(){
    var currentDate = new Date()
    const dayOfWeek = currentDate.getDay()

    const canDriveToday = (this.state.evenLicensePlate && dayOfWeek in DAYS_FOR_EVEN_PLATES) || (!this.state.evenLicensePlate && dayOfWeek in DAYS_FOR_ODD_PLATES)
    const drivingDayDescription = `Hoy es ${DAYS_OF_WEEK_SPANISH[dayOfWeek]}, día para tabillas ${dayOfWeek % 2 != 0 ? "impares": "pares"}`

    return (
      <SafeAreaView style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <ScrollView contentContainerStyle={{flexGrow:1,display:'flex',flexDirection:'column',alignItems: 'center',margin:SCROLLVIEW_MARGIN}}>
          <View style={{display:'flex',flexDirection:'row',width:300,height:70,backgroundColor:'purple',borderRadius:15,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:50}}>9:41</Text>
          </View>

          <View style={{display:'flex',flexDirection:'row'}}>
            <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderTopLeftRadius:15, backgroundColor: 'powderblue',alignItems:'center',justifyContent:'center'}}>
              <Text>Deceased</Text>
            </View>
            <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'skyblue',alignItems:'center',justifyContent:'center'}}>
              <Text>Casos positivos</Text>
            </View>
            <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT,borderTopRightRadius:15,  backgroundColor: 'steelblue',alignItems:'center',justifyContent:'center'}}>
              <Text>Pruebas realizadas</Text>
            </View>
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderBottomLeftRadius:15, backgroundColor: 'red',alignItems:'center',justifyContent:'center'}}>
              <Text>{this.state.deceased}</Text>
            </View>
            <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'deepskyblue',alignItems:'center',justifyContent:'center'}}>
              <Text>{this.state.positiveToday}</Text>
            </View>
            <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderBottomRightRadius:15, backgroundColor: 'deepskyblue',alignItems:'center',justifyContent:'center'}}>
              <Text>{this.state.totalTests}</Text>
            </View>
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            <View style={{backgroundColor:canDriveToday ? GO_COLOR : STOP_COLOR,height:100,width:300,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
              <Text>{drivingDayDescription}</Text>
              <Text>{canDriveToday ? CAN_DRIVE_TEXT : CANT_DRIVE_TEXT}</Text>
            </View>
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            <LineChart
                data={{
                  labels: this.state.dateAbbreviations ? this.state.dateAbbreviations : ["January", "February", "March", "April", "May", "June"],
                  datasets: [
                    {
                      data: this.state.weeksPositives ? this.state.weeksPositives : [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                      ]
                    }
                  ]
                }}
                width={Dimensions.get("window").width - SCROLLVIEW_MARGIN * 2} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#3498db",
                  backgroundGradientTo: "#34c5db",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
          </View>
          {this.state.municipioDataToday ? getMunicipiosRowsWithData(this.state.municipioDataToday) : <Text>Hi</Text>}

          <View style={{display:'flex',flexDirection:'row'}}>
            <Button title="Settings" onPress={() => this.settingsButton()}/>

          </View>


        </ScrollView>
      </SafeAreaView>
      )
  }
}
