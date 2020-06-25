import React, { Component } from 'react';
import {SafeAreaView,View,Button,Image,StyleSheet,Text,FlatList, TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import {CustomHeader} from '../../CustomHeader';
import {Icon} from 'native-base';
import {IMAGE} from '../../../constants/Image';
import {environment} from '../../../constants/environment';
import AsyncStorage from '@react-native-community/async-storage';
function Item({ id, title, selected, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? '#6e3b6e' : '#f9c2ff' },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

export class ContactList extends Component{
  constructor(props){
    super(props);
    this.getContacts();
    this.state ={
      contacts: [],
      username: '',
      id:''
  }
  }

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
        console.log(res.contacts);
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
  }

  render(){
    const uid = this.state.id;
    const userName = this.state.username;
    const contacts = this.state.contacts.map(contact=>
    <Text key={contact.id} style={styles.item} onPress={()=> this.props.navigation.navigate('Chat',{name:contact.username,sender: userName,id:contact.id,fromId:uid})}>
      <Image
          source={IMAGE.CONTACTS}
          resizeMode="contain"
          style={{width:20,height:20,borderRadius:100}}
        />{"  "+contact.username}
    </Text>)
    return (
      <View style={{ flex: 1 }}>
      <CustomHeader title="Contacts" isHome={true} navigation={this.props.navigation}/>
      <View>
      {contacts}
      </View>
    </View>
    )
  }
};

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
    borderBottomWidth:1,
    borderBottomColor:'lightgray'
  },
  title: {
    fontSize: 32,
  },
});
