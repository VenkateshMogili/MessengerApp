import React from 'react';
import {View} from 'react-native';
import {Text} from 'native-base';
import {CustomHeader} from '../CustomHeader';

export class Settings extends React.Component{
  render(){
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Setting" navigation={this.props.navigation}/>
      <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings Screen!</Text>
      </View>
    </View>
  );
  }
}