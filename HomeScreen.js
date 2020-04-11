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
const DATA_LAG_DAYS = 2

const SCROLLVIEW_MARGIN = 5

const BLOCK_WIDTH = 100
const BLOCK_HEIGHT = 60

const DAYS_FOR_EVEN_PLATES = {1:true,3:true,5:true}
const DAYS_FOR_ODD_PLATES = {2:true,4:true,6:true}

const CAN_DRIVE_TEXT = "Puedes guiar para gestiones de primera necesidad"
const CANT_DRIVE_TEXT = "\nEstá prohibido guiar, salvo para ciertas exenciones"

const GO_COLOR = "#2ecc71"
const STOP_COLOR = "#c0392b"

const DAYS_OF_WEEK_SPANISH = {0:"domingo",1:"lunes",2:"martes",3:"miércoles",4:"jueves",5:"viernes",6:"sábado"}
const SAMPLE_DATA_URL =  "https://raw.githubusercontent.com/Code4PuertoRico/covid19-pr-api/master/data/PuertoRicoTaskForce/4-07-2020/CSV/resumen.csv"
const COVID_DATA_URL_PREFIX = "https://raw.githubusercontent.com/Code4PuertoRico/covid19-pr-api/master/data/PuertoRicoTaskForce/"
const SUMMARY_CSV_SUFFIX = "/CSV/resumen.csv"


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
    this.state = {canDriveToday:true,
      deceased:0,positiveToday:0,recovered:0,
      updateSettingsFunc:this.updateSettings}
  }


  getLicensePlateCard = (canDriveToday,dayOfWeek) =>{
    if (canDriveToday == null){
      cardColor = "gray"
      drivingRecommendation = <Button title={"Toca aquí para saber si puedes guiar"} onPress={()=>this.props.navigation.navigate("Settings")}/>
    } else if (canDriveToday) {
      cardColor = GO_COLOR
      drivingRecommendation = <Text>{CAN_DRIVE_TEXT}</Text>
    } else{
      cardColor = STOP_COLOR
      drivingRecommendation = <Text style={{textAlign: 'center'}}>{CANT_DRIVE_TEXT}</Text>
    }

    const drivingDayDescription = `Hoy es ${DAYS_OF_WEEK_SPANISH[dayOfWeek]}, día para tabillas ${dayOfWeek % 2 != 0 ? "impares": "pares"}`

    return (
      <View style={{display:'flex',flexDirection:'row'}}>
        <View style={{backgroundColor:cardColor,height:100,width:300,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
          <Text>{drivingDayDescription}</Text>
          {drivingRecommendation}
        </View>
      </View>
    )


  }

  updateSettings = (newState) =>{
    console.log("Updating state")
    console.log(`New state is ${newState}`)
    console.log(`New state keys are ${Object.keys(newState)}`)

    this.setState(newState)

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


    const dataForLastXDays = await this.getCOVID19DataForLastXDays(3)
    var weeksPositives = []
    var dateAbbreviations = []
    for (var i = 0; i < dataForLastXDays.length; i++) {
      const covidData = dataForLastXDays[i]
      const dateAbbreviation = `${covidData.month}-${covidData.day}`
      console.log(`${dateAbbreviation} has ${covidData.totalPositive}`)
      if (i == 0 ){
        this.setState({positiveToday:covidData.totalPositive,totalTests:covidData.totalTests})
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

    const evenLicensePlate = this.props.route.params.evenLicensePlate
    var canDriveToday
    if (evenLicensePlate == null){
      canDriveToday = null
    } else{
      canDriveToday = (evenLicensePlate && dayOfWeek in DAYS_FOR_EVEN_PLATES) || (!evenLicensePlate && dayOfWeek in DAYS_FOR_ODD_PLATES)
    }

    return (
      <SafeAreaView style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <ScrollView contentContainerStyle={{flexGrow:1,display:'flex',flexDirection:'column',alignItems: 'center',margin:SCROLLVIEW_MARGIN,}}>

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
          {this.getLicensePlateCard(canDriveToday,dayOfWeek)}
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

        </ScrollView>
      </SafeAreaView>
      )
  }
}
