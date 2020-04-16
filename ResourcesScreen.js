import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';

import InAppBrowser from 'react-native-inappbrowser-reborn'
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont()

const SCROLLVIEW_MARGIN = 5
const PR_SALUD_SYMPTOMS_LINK = "http://www.salud.gov.pr/Pages/COVID-19-Transmision.aspx"
const CDC_SYMPTOMS_LINK = "https://espanol.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html"
const SALUD_PHONE_NUMBER = "787-765-2929"
export default class Recursos extends React.Component{
  constructor(props){
    super(props)
  }

  openLink = async (target) => {
      try {
        const url = target
        if (await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: '#453AA4',
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'overFullScreen',
            modalTransitionStyle: 'partialCurl',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
            toolbarColor: '#6200EE',
            secondaryToolbarColor: 'black',
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
            // Specify full animation resource identifier(package:anim/name)
            // or only resource name(in case of animation bundled with app).
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right'
            },
            headers: {
              'my-custom-header': 'my custom header value'
            }
          })
          Alert.alert(JSON.stringify(result))
        }
        else Linking.openURL(url)
      } catch (error) {
        Alert.alert(error.message)
      }
    }
    // <TouchableOpacity
    //   onPress={()=>InAppBrowser.open("https://twitter.com/DeptSaludPR")}
    //   style={{display:'flex',flexDirection:'row',alignItems: 'center',backgroundColor: "#00acee"}}>
    //   <Icon name="twitter" size={40} color={"white"} />
    //   <Text style={{fontSize: 20}}>@DeptSaludPR</Text>
    // </TouchableOpacity>

  getExternalResourceBlock = (text,blockSide,onPressFunction) =>{
    return (
      <TouchableOpacity
      onPress= {onPressFunction}
      style={{width: 150,height: 150,backgroundColor: "green",
        borderRadius: 15,
        padding: 10,
        left: blockSide=="left" ? 0 : 10,
        right: blockSide=="left" ? 10 : 0,
        justifyContent: 'center',alignItems: 'center'}}>
        <Text style={{color:"white",fontSize: 100}}>😷</Text>
      </TouchableOpacity>

    )

  }
  getExternalResourceBar = (text,iconName,backgroundColor,onPressFunction) =>{
      return (
        <View style={{display:'flex',flexDirection:'row', alignItems:'stretch',padding: 5}}>
          <TouchableOpacity
            onPress={onPressFunction}
            style={{display:'flex',flexDirection:'row',
            width:250,height: 70,
            top: 10,
            borderRadius: 15,
            alignItems: 'center',justifyContent: "center",
            backgroundColor: backgroundColor}}>
            <View style={{width:"30%",alignItems:'center'}}>
              <Icon name={iconName} size={40} color={"white"} />
            </View>
            <View style={{width:"70%"}}>
              <Text style={{fontSize: 20,color:"white",textAlign: 'center'}}>{text}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
  }

  render (){
    return (
      <SafeAreaView style={{...StyleSheet.absoluteFillObject,flex:1,flexDirection: 'column',}}>
        <ScrollView contentContainerStyle={{flexGrow:1,flexDirection:'column',alignItems: 'center',}}>
          <View style={{display:'flex',flexDirection:'row', justifyContent: 'space-between',padding: 10}}>
            {this.getExternalResourceBlock("PR symptoms","left",()=>InAppBrowser.open(PR_SALUD_SYMPTOMS_LINK))}
            {this.getExternalResourceBlock("CDC symptoms","right",()=>InAppBrowser.open(CDC_SYMPTOMS_LINK))}
          </View>
          <View style={{display:'flex',flexDirection:'row', justifyContent: 'space-between'}}>
            {this.getExternalResourceBlock("Al salir de la casa","left",()=>InAppBrowser.open("http://www.salud.gov.pr/PublishingImages/Pages/coronavirus/Al%20salir%20de%20casa.png"))}
            {this.getExternalResourceBlock("Lávase las manos","right",()=>InAppBrowser.open("http://www.salud.gov.pr/Documents/coronavirus/Images/L%C3%A1vate%20las%20manos.jpg"))}
          </View>
          {this.getExternalResourceBar("@DeptSaludPR","twitter","#00acee",()=>InAppBrowser.open("https://twitter.com/DeptSaludPR"))}
          {this.getExternalResourceBar("/DeptSaludPR","facebook","#3b5998",()=>InAppBrowser.open("https://www.facebook.com/deptsaludpr"))}
          <View style={{display:'flex',flexDirection:'row', justifyContent: 'space-between',padding: 5}}>
            <TouchableOpacity
              onPress={()=>Linking.openURL(`tel:${SALUD_PHONE_NUMBER}`)}
              style={{display:'flex',flexDirection:'row',
              width:250,height: 70,
              top: 10,
              borderRadius: 15,
              alignItems: 'center',justifyContent: "center",
              backgroundColor: "#2ecc71"}}>
              <View style={{width:"30%",alignItems:'center' }}>
                <Icon name={"phone"} size={40} color={"white"} />
              </View>
              <View style={{width:"70%"}}>
                <Text style={{fontSize: 16,color:"white",textAlign: 'center'}}>{"Departamento de Salud"}</Text>
                <Text style={{fontSize: 20,color:"white",textAlign: 'center'}}>{SALUD_PHONE_NUMBER}</Text>

              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>

    )

  }
}
