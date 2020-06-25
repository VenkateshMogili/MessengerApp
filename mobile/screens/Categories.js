import React, { Component } from 'react';
import {View,Text, StyleSheet, TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import Grid from 'react-native-grid-component';
export default class Categories extends Component{

  _renderItem = (data, i) => (
    <View style={styles.item} key={i}>
      <TouchableOpacity style={styles.category}>
        <ImageBackground source={require('../android/app/src/main/res/mipmap-mdpi/splash_icon.png')} style={styles.image}>
        <Text style={styles.categoryName}>{data.name}</Text>
        </ImageBackground>
      </TouchableOpacity>
      </View>
  );

  _renderPlaceholder = i => <View style={styles.item} key={i} />;
  render(){
    let categories = [
      {key:1,name:'Category 1',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
      {key:2,name:'Category 2',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
      {key:3,name:'Category 3',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
      {key:4,name:'Category 4',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
      {key:5,name:'Category 5',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
      {key:6,name:'Category 6',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
      {key:7,name:'Category 7',img:'../android/app/src/main/res/mipmap-mdpi/splash_icon.png'},
    ];
    return (

      <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}>
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={categories}
        numColumns={2}
      />
      </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 160,
    margin: 10
  },
  list: {
    flex: 1
  },
  category:{
    backgroundColor:'white',
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