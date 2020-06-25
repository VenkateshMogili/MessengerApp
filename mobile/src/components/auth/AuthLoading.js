import React from 'react';
import {View, StyleSheet, ActivityIndicator, StatusBar,Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
export class AuthLoading extends React.Component{
  constructor(props){
    super(props);
    this._loadData();
  }
  _loadData = async() =>{
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    this.props.navigation.navigate(isLoggedIn!=='1'?'auth':'app');
  }
  render(){
  return (
    <View style={styles.container}>
      <ActivityIndicator/>
      <StatusBar barStyle="default"/>
      <Text style={{color:'white',justifyContent: 'center',alignItems: 'center',}}>Loading</Text>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#1e90ff'
  }
})