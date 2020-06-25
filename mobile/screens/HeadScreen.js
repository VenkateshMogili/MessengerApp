import React, { Component } from 'react';
import {View,Text, StyleSheet,Image} from 'react-native';

export default class HeadScreen extends Component{
  render(){
    return (
      <View style={styles.container}>
      <Text style={styles.menu}>Menu</Text>
        <Text style={styles.appName}>Foodie</Text>
        <Text style={styles.login}>Login</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'tomato',
  },
  appName: {
    justifyContent: 'center',
    alignItems: 'center',
    color:'white',
    margin:10,
  },
  login:{
    position:"absolute",
    right:1,
    backgroundColor:'#fff',
    padding:10,
    borderRadius:50
  },
  menu:{
    position:"absolute",
    left:1,
    backgroundColor:'#fff',
    padding:10,
    borderRadius:50
  },
  icon:{
    width:25,
    height:25,
  }
})