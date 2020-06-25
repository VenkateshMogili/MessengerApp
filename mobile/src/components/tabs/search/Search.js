import React from 'react';
import {View} from 'react-native';
import {Button,Text} from 'native-base';
import {CustomHeader} from '../../CustomHeader';

export class Search extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
      <CustomHeader title="Search" isHome={true} navigation={this.props.navigation}/>
      <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
      <Text>Search!</Text>
      <Button light
        onPress={()=> this.props.navigation.navigate('SearchDetails')}
        title="Go to Details"
      >
        <Text>Go to Search details!</Text>
        </Button>
      </View>
    </View>
    );
  }
}