import React from 'react';
import {Text, TextInput, StyleSheet} from 'react-native';
import { Button, Header,Left,Body,Right,Icon,Title} from 'native-base';
import io from 'socket.io-client';
import {environment} from '../constants/environment';
import AsyncStorage from '@react-native-community/async-storage';
export class CustomHeader extends React.Component{
  constructor(props){
    super(props);
    this.getUserDetails();
    this.state = {username:'',enableSearch:false,searchTerm:''};
  }
  componentDidMount(){
    this.socket = io(environment);
  }
  getUserDetails = async() =>{
    let username = await AsyncStorage.getItem('username');
    this.setState({username});
  }
  getBack(){
    this.socket.emit('clicked back',{name:"clicked"});
    this.props.navigation.navigate("ChatList");
  }
  render(){
    let {title,isHome,status,typing}= this.props;
  return (
        <Header>
          <Left>
          {
            isHome?
            <Button transparent>
            {title=="Contacts"?
              <Icon name="person"/>:null
            }
            {title=="Chats"?
              <Icon name="chatboxes"/>:null
            }
            {title=="Profile"?
              <Icon name="person"/>:null
            }
            </Button>:
            <Button transparent onPress={()=>this.getBack()}>
            <Icon name='arrow-back'/>
          </Button>
          }
          </Left>
          <Body style={{marginRight:100}}>
            <Title>
            {!isHome?
            <Icon name="person" style={{marginRight:20,color:'white',fontSize:20}}></Icon>
            :null}
              {"  "+title.substring(0,10)}
               {status && !typing?<Text style={{fontSize:10}}>{"  ("+status+")"}</Text>:null}
               {status=="online" && typing?<Text style={{fontSize:10}}>{"  ( typing... )"}</Text>:null}
               </Title>
          </Body>
          {isHome && title=="Chats"?<Right>
          <Icon name="search" style={{color:'white'}} onPress={()=>this.props.navigation.navigate('SearchList')}/>
          </Right>:null}
        </Header>
  )
  }
}
