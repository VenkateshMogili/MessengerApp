import React from 'react';
import {View,Text, ImageBackground} from 'react-native';
import {CustomHeader} from '../../CustomHeader';
export class Contact extends React.Component{
  render(){
    let title=this.props.navigation.getParam('name');
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title={title} navigation={this.props.navigation}/>
    <Text>Contact Details</Text>
    </View>
  );
  }
}