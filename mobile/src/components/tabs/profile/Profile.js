import React from 'react';
import {View,Text,Button, ImageBackground} from 'react-native';
import {CustomHeader} from '../../CustomHeader';
import AsyncStorage from '@react-native-community/async-storage';
export class Profile extends React.Component{
  constructor(props){
    super(props);
    this.getUserDetails();
    this.state = {username:''};
  }
  getUserDetails = async() =>{
    let username = await AsyncStorage.getItem('username');
    this.setState({username});
  }
  render(){
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Profile" isHome={true} navigation={this.props.navigation}/>
      <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
      <Text>Profile Details!</Text>
      <Text>{this.state.username}</Text>
      <Button light
        onPress={()=> this.props.navigation.navigate('Logout')}
        title="Logout"
      >
        <Text>Logout</Text>
        </Button>
      </View>
    </View>
  );
  }
}