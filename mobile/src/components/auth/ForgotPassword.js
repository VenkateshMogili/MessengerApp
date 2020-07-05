import React from 'react';
import {View,Image,TextInput,Dimensions, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import {Text,Button} from 'native-base';
import {IMAGE} from '../../constants/Image';
import {environment} from '../../constants/environment';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon} from 'native-base';
export class ForgotPassword extends React.Component{
  constructor(props){
    super(props);
    this.state={username:''}
  }
  login = () =>{
    fetch(environment+'/users/forgotPassword',{
      method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          username:this.state.username
        })
    })
    .then((response)=>response.json())
    .then((res)=>{
      if(res.success===true){
        alert(res.message);
        this.props.navigation.navigate('Login');
      } else{
        alert(res.message);
      }
    })
    .done();
  }
  render(){
  return (
      <View style={{flex: 1}}>
      <View style={styles.container}>
        {/* <ImageBackground source={IMAGE.ICON_MENU} style={styles.backgroundImage}> */}
          <View style={styles.content}>

      <Icon name="arrow-back" onPress={()=>this.props.navigation.navigate('Login')} style={styles.back}> Back</Icon>
            <Text style={styles.logo}>Messenger 1.0</Text>
            <View style={styles.inputContainer}>
              <TextInput underlineColorAndroid='transparent' style={styles.input} placeholder="Enter your email address"
              onChangeText={(username)=>this.setState({username})}
              value={this.state.username}>
              </TextInput>
            </View>
            <TouchableOpacity onPress={this.login} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.madeInIndia}>Made In <Icon name="heart" style={styles.india}/> India</Text>
      </View>
          </View>
        {/* </ImageBackground> */}
      </View>
      {/* <Button light style={{marginTop:10}}
      onPress={()=>this.props.navigation.navigate('Login')}>
        <Text>Login</Text>
      </Button> */}
      {/* <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center',}}>
      <Button light style={{marginTop:10,width:'50%',justifyContent: 'center',}}
      onPress={()=>this.props.navigation.navigate('Login')}>
        <Text>Login</Text>
      </Button>
      <Button light style={{marginTop:10,width:'50%',justifyContent: 'center',}}
      onPress={()=>this.props.navigation.navigate('Register')}>
        <Text>Register</Text>
      </Button>
      </View> */}
      </View>
  );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#1e90ff'
  },
  backgroundImage:{
    flex:1,
    alignSelf:'stretch',
    width:null,
    justifyContent: 'center',
  },
  content:{
    backgroundColor:'white',
    margin:10,
    alignItems: 'center',
    borderRadius:10,
    flex:1,
    alignSelf:'stretch',
    width:null,
    justifyContent: 'center',
  },
  logo:{
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:35,
    color:'#1e90ff',
  },
  inputContainer:{
  },
  input:{
    borderRadius:10,
    padding:10,
    color:'black',
    borderWidth:1,
    borderColor:'lightgray',
    width:Dimensions.get('window').width-100,
    margin:5
  },
  buttonContainer:{
    margin:10,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText:{
    borderRadius:100,
    padding:10,
    backgroundColor:'magenta',
    color:'white',
    textAlign:'center',
    width:100
  },
  footer:{
    position:"absolute",
    bottom:0,
    backgroundColor:"#1e90ff",
    padding:10,
  },
  madeInIndia:{
    color:'white'
  },
  india:{
    color:'red',
    fontSize:20
  },
  back:{
    position:"absolute",
    top:0,
    left:0,
    backgroundColor:"#1e90ff",
    padding:10,
    margin:2,
    borderRadius:50,
    color:'white',
    width:100,
    fontSize:20
  }

})