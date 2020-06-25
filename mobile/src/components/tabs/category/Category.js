import React, { Component } from 'react';
import {View,StyleSheet, TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import {CustomHeader} from '../../CustomHeader';

export class Category extends Component{
  render(){
    return (
      <View style={{ flex: 1 }}>
      <CustomHeader title="Category" isHome={true} navigation={this.props.navigation}/>
      </View>
    )
  }
};

let randomColor = ['black','blue'];
const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin:10
  },
  category:{
    backgroundColor: randomColor[0],
    height:160,
    borderRadius:10,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: "cover",
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName:{
    color:'white',
    textShadowColor:'black',
    textShadowRadius:10
  }
})