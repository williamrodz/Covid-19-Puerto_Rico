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
  ScrollView,
  RefreshControl,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

import RNFetchBlob from 'rn-fetch-blob'
const DATA_LAG_DAYS = 3

const SCROLLVIEW_MARGIN = 5

const BLOCK_WIDTH = 100
const BLOCK_HEIGHT = 60
const DATA_VALUE_BACKGROUND_COLOR = "#ecf0f1"
const DATA_VALUE_TEXT_COLOR = "white"
const DATA_LABEL_BACKGROUND_COLOR = "#8e44ad"
const BACKGROUND_COLOR = "#bdc3c7"

const LABEL_FONT_SIZE = 18.5
const DATA_FONT_SIZE = 24

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

function getPercent(amount,total,decimals){
  quotient = amount / total * 100
  return quotient.toFixed(decimals) + '%'

}

function getDataBlock(blockType,text,borderTopLeftRadius=0,borderTopRightRadius=0,borderBottomLeftRadius=0,borderBottomRightRadius=0){
  if (blockType == "label"){
    backgroundColor = DATA_LABEL_BACKGROUND_COLOR
    fontSize = LABEL_FONT_SIZE
    fontColor = DATA_VALUE_TEXT_COLOR
  }
  else if (blockType == "data"){
    backgroundColor = DATA_VALUE_BACKGROUND_COLOR
    fontSize = DATA_FONT_SIZE
    fontColor = "black"
  }
  return (
    <View style={{width: BLOCK_WIDTH, height: BLOCK_HEIGHT,
      borderTopLeftRadius: borderTopLeftRadius,borderTopRightRadius:borderTopRightRadius,borderBottomLeftRadius: borderBottomLeftRadius,borderBottomRightRadius:borderBottomRightRadius,
      backgroundColor: backgroundColor,
      alignItems:'center',justifyContent:'center'}}>
      <Text style={{textAlign: 'center',fontSize:fontSize,color: fontColor}}>{text}</Text>
    </View>
  )
}

export default class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {canDriveToday:true,confirmedCases:0,}
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

  loadCOVID19Data = async () =>{
    const covidData = await firestore().doc("data/todaysData").get() //().collection('data')
    if (covidData.exists){
      data = covidData.data()
      console.log("DATA IS\n",data)
      this.setState({
      conductedTests:data.conductedTests,
      confirmedCases:data.confirmedCases,
      deaths:data.deaths,
      negativeCases:data.negativeCases,
      testsInProgress:data.testsInProgress,
      timestamp:data.timestamp,
      saludTimeSignature:data.saludTimeSignature,

    })
    } else{
      console.log("Data for today does not exist")
    }
    const historicalDataRef = await firestore().doc("data/historicalData").get()
    if (historicalDataRef.exists){
      historicalData = historicalDataRef.data().all
      this.setState({historicalData:historicalData})
    }

  }

  async componentDidMount (){
    await this.loadCOVID19Data()
  }

  _onRefresh = () => {
    console.log("REFRESHING")
    this.setState({refreshing: true});
    this.loadCOVID19Data().then(() => {
      this.setState({refreshing: false});
    });
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
      <SafeAreaView style={{...StyleSheet.absoluteFillObject}}>
        <ScrollView contentContainerStyle={{flexGrow:1,display:'flex',flexDirection:'column',alignItems: 'center',margin:SCROLLVIEW_MARGIN,backgroundColor:BACKGROUND_COLOR}}
        refreshControl={
           <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this._onRefresh()} />
         }
        >

          <View style={{display:'flex',flexDirection:'row',paddingTop: 2}}>
            <Text style={{fontSize: 30,fontWeight: 'bold',textAlign:'center'}}>{"COVID-19 en\n Puerto Rico🇵🇷"}</Text>
          </View>
          <View style={{display:'flex',flexDirection:'row',paddingTop: 5}}>
            {getDataBlock("label","Casos positivos",15)}
            {getDataBlock("label","Casos negativos")}
            {getDataBlock("label","Muertes",0,15)}
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            {getDataBlock("data",this.state.confirmedCases,0,0,15)}
            {getDataBlock("data",this.state.negativeCases)}
            {getDataBlock("data",this.state.deaths,0,0,0,15)}
          </View>

          <View style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
            {getDataBlock("label","Porciento Positivo",15)}
            {getDataBlock("label","Porciento Negativo")}
            {getDataBlock("label","Porciento de muertes",0,15)}
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            {getDataBlock("data",getPercent(this.state.confirmedCases,this.state.conductedTests,1),0,0,15)}
            {getDataBlock("data",getPercent(this.state.negativeCases,this.state.conductedTests,1))}
            {getDataBlock("data",getPercent(this.state.deaths,this.state.conductedTests,3),0,0,0,15)}
          </View>

          <View style={{display:'flex',flexDirection:'row',paddingTop: 10}}>
            {getDataBlock("label","Pruebas en proceso",15)}
            {getDataBlock("label","Pruebas realizadas",0,15)}
          </View>

          <View style={{display:'flex',flexDirection:'row'}}>
            {getDataBlock("data",this.state.testsInProgress,0,0,15)}
            {getDataBlock("data",this.state.conductedTests,0,0,0,15)}
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            <Text>{`${this.state.saludTimeSignature ? this.state.saludTimeSignature.replace("\n","") : ""}`}</Text>
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
            <LineChart
                data={{
                  labels: this.state.historicalData ? this.state.historicalData.map((item)=>`${(new Date(item.timestamp)).getDate()}-${(new Date(item.timestamp)).getMonth() + 1}`) : ["January", "February", "March", "April", "May", "June"],
                  datasets: [
                    {
                      data: this.state.historicalData ? this.state.historicalData.map((item)=>item.confirmedCases) : [
                        4,
                        16,
                        256,
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
  // {this.getLicensePlateCard(canDriveToday,dayOfWeek)}
}
