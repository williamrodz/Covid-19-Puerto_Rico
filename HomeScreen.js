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
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RNFetchBlob from 'rn-fetch-blob'
const DATA_LAG_DAYS = 1

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
const CSV_URL_SUFFIX = "/CSV/resumen.csv"

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

export default class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {canDriveToday:true,evenLicensePlate:null,
      deceased:0,positiveToday:0,recovered:0,updateSettingsFunc:this.updateSettings}
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

  getCOVIDDataForDay = async (dayObject) =>{
    const day = getTwoDigitNumber(dayObject.day)
    const month = dayObject.month
    const year = dayObject.year

    console.log(`Getting data for ${month}-${day}-${year}`)

    const url = COVID_DATA_URL_PREFIX+`${month}-${day}-${year}` + CSV_URL_SUFFIX
    console.log(`Calling url:\n${url}`)

    return RNFetchBlob.fetch('GET',url).then(data=>{
      let text = data.text()
      console.log(`Text is \n${text}`)
      var rowsText = text.split("\"").join("")
      var rows = rowsText.split("\n")
      for (var i = 0; i < rows.length; i++) {
        rows[i] = rows[i].split(",")
      }
      let totalPositive = rows[1][4]
      return {...dayObject,totalPositive:totalPositive}
    })
    .catch(error=>{
      console.log(`Error retrieving covid data: for ${day}` +error)
    })

  }

  loadCOVID19Data = async () =>{
    const dataForLastXDays = await this.getCOVID19DataForLastXDays(1)
    for (var i = 0; i < dataForLastXDays.length; i++) {
      const covidData = dataForLastXDays[i]
      if (i == 0 ){
        this.setState({positiveToday:covidData.totalPositive})
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
      <View style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <View style={{display:'flex',flexDirection:'row',width:300,height:70,backgroundColor:'purple',borderRadius:15,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:50}}>9:41</Text>
        </View>


        <View style={{display:'flex',flexDirection:'row'}}>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderTopLeftRadius:15, backgroundColor: 'powderblue',alignItems:'center',justifyContent:'center'}}>
            <Text>Deceased</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'skyblue',alignItems:'center',justifyContent:'center'}}>
            <Text>Casos Positivos</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT,borderTopRightRadius:15,  backgroundColor: 'steelblue',alignItems:'center',justifyContent:'center'}}>
            <Text>Recovered</Text>
          </View>
        </View>
        <View style={{display:'flex',flexDirection:'row'}}>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderBottomLeftRadius:15, backgroundColor: 'red',alignItems:'center',justifyContent:'center'}}>
            <Text>{this.state.deceased}</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, backgroundColor: 'green',alignItems:'center',justifyContent:'center'}}>
            <Text>{this.state.positiveToday}</Text>
          </View>
          <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT, borderBottomRightRadius:15, backgroundColor: 'blue',alignItems:'center',justifyContent:'center'}}>
            <Text>{this.state.recovered}</Text>
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
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ]
                  }
                ]
              }}
              width={Dimensions.get("window").width} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
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
        <View style={{display:'flex',flexDirection:'row'}}>
          <Button title="Settings" onPress={() => this.settingsButton()}/>

        </View>



      </View>
      )
  }
}
