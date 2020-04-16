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

const SCROLLVIEW_MARGIN = 5
const PR_SALUD_SYMPTOMS_LINK = "http://www.salud.gov.pr/Pages/COVID-19-Transmision.aspx"
const CDC_SYMPTOMS_LINK = "https://espanol.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html"

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


  render (){
    return (
      <SafeAreaView style={{...StyleSheet.absoluteFillObject,display:'flex',flexDirection: 'column', alignItems:'stretch',justifyContent:'center'}}>
        <ScrollView contentContainerStyle={{flexGrow:1,display:'flex',flexDirection:'column',alignItems: 'center',margin:SCROLLVIEW_MARGIN}}>
          <View style={{display:'flex',flexDirection:'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
            onPress= {()=>InAppBrowser.open(PR_SALUD_SYMPTOMS_LINK)}
            style={{width: 150,height: 150,backgroundColor: "green", right:10,
              borderTopLeftRadius:15,borderTopRightRadius: 15,borderBottomLeftRadius:15,borderBottomRightRadius: 15,
              justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{color:"white",fontSize: 30}}>PR Síntomas</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress= {()=>InAppBrowser.open(CDC_SYMPTOMS_LINK)}
            style={{width: 150,height: 150,backgroundColor: "green",
              borderTopLeftRadius:15,borderTopRightRadius: 15,borderBottomLeftRadius:15,borderBottomRightRadius: 15,
              justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{color:"white",fontSize: 30}}>Síntomas</Text>
            </TouchableOpacity>
          </View>
          <View style={{display:'flex',flexDirection:'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
            onPress= {()=>InAppBrowser.open("http://www.salud.gov.pr/PublishingImages/Pages/coronavirus/Al%20salir%20de%20casa.png")}
            style={{width: 150,height: 150,backgroundColor: "green", right:10,
              borderTopLeftRadius:15,borderTopRightRadius: 15,borderBottomLeftRadius:15,borderBottomRightRadius: 15,
              justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{color:"white",fontSize: 30}}>Al salir de casa</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress= {()=>InAppBrowser.open("http://www.salud.gov.pr/Documents/coronavirus/Images/L%C3%A1vate%20las%20manos.jpg")}
            style={{width: 150,height: 150,backgroundColor: "green",
              borderTopLeftRadius:15,borderTopRightRadius: 15,borderBottomLeftRadius:15,borderBottomRightRadius: 15,
              justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{color:"white",fontSize: 30}}>Lávase las manos</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>

    )

  }
}
