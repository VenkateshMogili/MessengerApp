import React from 'react';
import {View,Text,TextInput, ImageBackground,TouchableOpacity,StyleSheet,Image} from 'react-native';
import {CustomHeader} from '../../CustomHeader';
import {Icon} from 'native-base';
import {IMAGE} from '../../../constants/Image';
import {environment} from '../../../constants/environment';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import io from 'socket.io-client';
import { Badge } from 'react-native-elements'
import { Button,Header,Left,Body,Right,Title} from 'native-base';
export class SearchList extends React.Component{
  constructor(props){
    super(props);
    this.getUserDetails();
    this.state ={
      chats: [],
      contacts:[],
      username:'',
      id:'',
      searchTerm:'',
    }
  }

  getUserDetails = async() =>{
    console.log("calling");
    let username = await AsyncStorage.getItem('username');
    let id = await AsyncStorage.getItem('id');
    this.setState({username,id});
    this.getChats();
  }

  getChats = async() =>{
    console.log(this.state.id);
    fetch(environment+'/users/chats',{
      method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          id: this.state.id
        })
    })
    .then((response)=>response.json())
    .then((res)=>{
      if(res.success===true){
        let chats = res.chats;
        this.setState({chats});
      } else{
        // alert(res.message);
        this.props.navigation.navigate('ContactList');
      }
    })
    .done();
};

getContacts = async() =>{
  let email = await AsyncStorage.getItem("email");
  let username = await AsyncStorage.getItem("username");
  let id = await AsyncStorage.getItem("id");
  this.setState({username,id})
  fetch(environment+'/users/contacts',{
    method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email: email
      })
  })
  .then((response)=>response.json())
  .then((res)=>{
    if(res.success===true){
      // console.log(res.contacts);
      let contacts = res.contacts;
      this.setState({contacts});
    } else{
      alert(res.message);
      this.props.navigation.navigate('Login');
    }
  })
  .done();
}

componentDidMount(){
  console.log("called");
  this.socket = io(environment);
  this.socket.on("receive message",msg=>{
    // console.log("received",msg);
    if(msg.userFrom==this.state.id || msg.userTo==this.state.id){
      this.getUserDetails();
    }
  });
}

days_between(createdTime: any) {
    createdTime = new Date(createdTime).getTime();
    const d = new Date();
    const currentTime = d.getTime();
    const localOffset = d.getTimezoneOffset() / 60;
    const msec = (currentTime - createdTime) + (3600000 * localOffset);
    const mins = Math.floor(msec / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (hrs < 24) {
      return moment(createdTime).format(" hh:mm a");
    } else if (days > 1) {
      return moment(createdTime).format("DD/MM/YYYY");
    }
  }

  getBack(){
    this.socket.emit('clicked back',{name:"clicked"});
    this.props.navigation.navigate("ChatList");
  }
  searchChats(searchTerm){
    this.setState({searchTerm});
    this.getContacts();
  }
  render(){
    const uid = this.state.id;
    const userName = this.state.username;
    const chats = this.state.chats.filter((data)=>{
      if(this.state.searchTerm.length==0)
          return data
      else if(data.username.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
          return data
      }
    }).map(chat=>
      <View style={{flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap"}} key={chat.id} style={styles.item}>
      <TouchableOpacity style={{height:35}}  onPress={()=> {this.getUserDetails();this.props.navigation.navigate('Chat',{name:chat.username,sender:userName ,id:chat.id,fromId:uid})}}>
      <View style={{flexDirection: "row",
                flexWrap: "wrap"}}>
        <Icon name="person" style={{fontSize:30,color:'gray'}}/>
          <Text style={{fontSize:15}}>{"   "+chat.username.substring(0,20)}</Text>
          {chat.received==0?<Badge value={chat.unread<100?chat.unread:'99+'} status="success" />:null}
      </View>
      <View>
          {chat.text.length>0?<Text style={{color:'gray',fontStyle:'italic',fontSize:10,position: 'absolute', left: 35,top:-10}}>{chat.text.substring(0,40)}{chat.text.length>10?"...":''}</Text>:null}
          {chat.text.length<=0?<Icon name="image" style={{color:'gray',fontStyle:'italic',fontSize:10,position: 'absolute', left: 35,top:-10}}/>:null}
          <Text style={{color:'gray',fontStyle:'italic',fontSize:10,position: 'absolute', right: 0,top:-25}}>{this.days_between(chat.lastActive)}</Text>
    </View>
    </TouchableOpacity>
      </View>);

      const contacts = this.state.contacts.filter((data)=>{
        if(this.state.searchTerm.length==0)
            return;
        else if(data.username.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
            return data
        }
      }).map(contact=>
        <View style={{flexDirection: "row",
                  justifyContent: "space-around",
                  flexWrap: "wrap"}} key={contact.id} style={styles.item}>
        <TouchableOpacity style={{height:35}}  onPress={()=> {this.getUserDetails();this.props.navigation.navigate('Chat',{name:contact.username,sender:userName,id:contact.id,fromId:uid})}}>
        <View style={{flexDirection: "row",
                  flexWrap: "wrap"}}>
          <Icon name="person" style={{fontSize:30,color:'gray'}}/>
            <Text style={{fontSize:15}}>{"   "+contact.username.substring(0,20)}</Text>
        </View>
      </TouchableOpacity>
        </View>)
  return (
    <View style={{ backgroundColor:'white' }}>
    <Header style={{backgroundColor:'white'}}>
          <Left>
            <Button transparent onPress={()=>this.getBack()}>
            <Icon name='arrow-back' style={{color:'gray'}}/>
          </Button>
          </Left>
          <Right>
            <TextInput autoFocus underlineColorAndroid='transparent' placeholder="Search..."
              onChangeText={(searchTerm)=>this.searchChats(searchTerm)}
              value={this.state.searchTerm} placeholderTextColor="gray" style={styles.input}>
              </TextInput>
          <Text>{"      "}</Text>
            <Icon name='close'  style={{color:this.state.searchTerm.length>0?'gray':'white'}} onPress={()=>this.setState({searchTerm:''})}/>
          </Right>
        </Header>
        {this.state.chats.length>0?
        <Text style={{fontSize:15,padding:5,paddingLeft:20,backgroundColor:'lightgray'}}>Chats</Text>:null}

      {chats}

      {this.state.searchTerm.length>0?
        <Text style={{fontSize:15,padding:5,paddingLeft:20,backgroundColor:'lightgray'}}>Other contacts</Text>:null}
      {contacts}
    </View>
  );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    margin:10,
    marginVertical: 8,
    marginHorizontal: 10,
    fontSize:20,
    borderBottomWidth:0,
    borderBottomColor:'lightgray'
  },
  title: {
    fontSize: 32,
  },
  input:{
    padding:0,
    color:'gray',
    borderColor:'lightgray',
    width:'100%',
    margin:0,
  },
});