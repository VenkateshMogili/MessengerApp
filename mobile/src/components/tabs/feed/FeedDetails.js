import React from 'react';
import {View} from 'react-native';
import {Text} from 'native-base';
import {CustomHeader} from '../../CustomHeader';

export class FeedDetails extends React.Component{
  render(){
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Feed Details" navigation={this.props.navigation}/>
      <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
      <Text>Feed Details Screen!</Text>
      </View>
    </View>
  );
  }
}