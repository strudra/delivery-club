import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';




export default class Logo extends Component<{}> {
  render() {
      return (
        <View style={styles.container}>
        <View style={styles.logoGoo}>
        <Image style={{width: 200, height: 300}} source={require('../assets/logo.png')}/>
        </View>
        </View>
      )
  }
}  

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    },
  logoGoo : {
     flex: 1,
     justifyContent: "flex-start"
  }  
});