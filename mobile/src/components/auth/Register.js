import React from 'react';
import {View,Image,TextInput,Dimensions, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import {Text,Button} from 'native-base';
import {IMAGE} from '../../constants/Image';
import {environment} from '../../constants/environment';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon} from 'native-base';
export class Register extends React.Component{
  constructor(props){
    super(props);
    this.state={email:'',username:'',password:''}
  }
  login = () =>{
    fetch(environment+'/users/addUser',{
      method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:this.state.email,
          username:this.state.username,
          password:this.state.password,
          status:'online'
        })
    })
    .then((response)=>response.json())
    .then((res)=>{
      if(res.success===true){
        let username=res.message;
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
            <Text style={styles.logo}>Messenger 1.0</Text>
            <View style={styles.inputContainer}>
            <TextInput underlineColorAndroid='transparent' style={styles.input} placeholder="Email"
              onChangeText={(email)=>this.setState({email})}
              value={this.state.email}>
              </TextInput>
              <TextInput underlineColorAndroid='transparent' style={styles.input} placeholder="Username"
              onChangeText={(username)=>this.setState({username})}
              value={this.state.username}>
              </TextInput>
              <TextInput secureTextEntry={true} underlineColorAndroid='transparent' style={styles.input} placeholder="Password"
              onChangeText={(password)=>this.setState({password})}
              value={this.state.password}>
              </TextInput>
            </View>
            <TouchableOpacity onPress={this.login} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>REGISTER</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center',}}>
            <Text style={{marginTop:10}}>Already have account? </Text>
      <Button light style={{borderRadius:50,marginTop:10,backgroundColor:'#1e90ff'}}
      onPress={()=>this.props.navigation.navigate('Login')}>
        <Text style={{color:'white'}}>Login</Text>
      </Button>
      </View>

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
      {/* <Button light style={{marginTop:10}}
      onPress={()=>this.props.navigation.navigate('Login')}>
        <Text>Login</Text>
      </Button> */}
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
    justifyContent: 'center',
    height:Dimensions.get('window').height-40
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
  }

})