import React, { Component,useRef } from 'react';
// import {View,StyleSheet,Text, TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import {CustomHeader} from '../../CustomHeader';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Icon} from 'native-base';
// import { GiftedChat,Bubble } from 'react-native-gifted-chat'
import ImagePicker from "react-native-image-picker";
import {GiftedChat, Bubble} from "react-native-gifted-chat-video-support";
import io from 'socket.io-client';
import {environment} from '../../../constants/environment';
console.reportErrorsAsExceptions = false;
export class Chat extends Component{
  _isMounted = false;
  constructor(props){
    super(props);
    this.getUserDetails();
    this.timeout =  0;
    this.state = {
      image:'',
      video:'',
      messages: [],
      chats: [],
      userid:'',
      username:'',
      connected: 0,
      customMessage:'',
      messageText:'',
      status:'online',
      appState: AppState.currentState,
      loading: false,
      chatsLen: 0,
      nextLen: 0,
      nextToLen: 10,
      resourcePath: {},
      imageUploading: false,
      isMessageTyping: false
    }
  }

  getUserDetails = async() =>{
    let username = await AsyncStorage.getItem('username');
    let userid = await AsyncStorage.getItem('id');
    let userFrom = this.props.navigation.getParam('fromId');
    this.setState({username,userid});
    // console.log(this.state.connected);
    // if(this.state.connected==0){
    //   console.log("run once");
    // this.socket.emit('add user', userFrom);
    // this.socket.on('login', (data) => {
    //   console.log("logged in");
    //   // Display the welcome message
    //   var message = "Welcome to Socket.IO Chat – ";
    //   console.log(data);
    // });
    // this.socket.on('user joined', (data) => {
    //   console.log(data.username + ' joined');
    // });
    // let connected = 1;
    // this.setState({connected});
    // }
  }


  getChat = async() =>{
    let userTo = this.props.navigation.getParam('id');
    let userFrom = this.props.navigation.getParam('fromId');
    let onlineStatus = false;
    if(this.state.status=="online"){
      onlineStatus=true;
    } else{
      onlineStatus = false;
    }
    fetch(environment+'/users/getChat',{
      method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          userTo: userTo,
          userFrom: userFrom,
          online: onlineStatus
        })
    })
    .then((response)=>response.json())
    .then((res)=>{
      if(res.success===true){
        let messages = res.messages;
        let firstPart =[]
        if(messages.length>10){
          firstPart = messages.slice(0,9);
        } else{
          firstPart = messages;
        }
        let chatsLen = messages.length;

        // console.log(messages);
        this.setState({messages:[...firstPart],chats:[...messages],chatsLen});
      } else{
        alert(res.message);
        this.props.navigation.navigate('Login');
      }
    })
    .done();
  }

  componentDidMount() {
    this._isMounted = true;
    // AppState.addEventListener('change', this._handleAppStateChange);
    this.socket = io(environment);
    let userTo = this.props.navigation.getParam('id');
    let userFrom = this.props.navigation.getParam('fromId');
    let userDetails = {userFrom,userTo};
    // this.socket.emit("connected",userDetails);
    this.socket.emit("add user",userFrom);
    this.socket.on("user joined",user=>{
      let foundUser = user.username.findIndex(user=>parseInt(user)==parseInt(userTo));
      // console.log(foundUser);
      // let messages = this.state.messages;
      if(foundUser!==-1){
        let status ="online";
        this.getChat();
        this.setState({status});
      } else{
        // console.log("else")
        let status ="offline";
        this.setState({status});
      }
    })
    this.socket.on("receive message",msg=>{
      // console.log("received",msg);
      if((msg.userFrom==userFrom && msg.userTo==userTo) || (msg.userFrom==userTo && msg.userTo==userFrom)){
      // this.setState(prevState => ({
      //   messages: [...prevState.messages, msg]
      // }))
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, msg),
      customMessage: ''
    }));
      }
    });
    this.getChat();
  }

  componentWillUnmount() {
    // console.log("unmounted");
    this._isMounted = false;
    let userFrom = this.props.navigation.getParam('fromId');
    // console.log(userFrom);
      this.socket.emit("close connection",userFrom);
      this.socket.on("user left",user=>{
        // console.log("user details",user);
        let foundUser = user.username.findIndex(user=>parseInt(user)==parseInt(userFrom));
        // console.log(foundUser);
        if(foundUser!==-1){
          let status ="online";
          this.setState({status});
        } else{
          // console.log("else")
          let status ="offline";
          this.setState({status});
        }
      })
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // _handleAppStateChange = (nextAppState) => {
  //   // console.log(nextAppState);
  //   if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
  //     console.log('App has come to the foreground!')
  //   }
  //   this.setState({appState: nextAppState});
    // console.log(nextAppState=='background');
    // if(nextAppState=='background' || nextAppState=='inactive'){
    //   let userTo = this.props.navigation.getParam('id');
    //   this.socket.emit("disconnect",userTo);
    //   this.socket.on("user left",user=>{
    //     console.log("user details",user);
    //     let foundUser = user.username.findIndex(user=>parseInt(user)==parseInt(userTo));
    //     console.log(foundUser);
    //     if(foundUser!==-1){
    //       let status ="online";
    //       this.setState({status});
    //     } else{
    //       console.log("else")
    //       let status ="offline";
    //       this.setState({status});
    //     }
    //   })
    //   }
  // }

  onSend(messages = []) {
    // this.setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }))
    // console.log("sending message",messages);
    let userTo = this.props.navigation.getParam('id');
    let userFrom = this.props.navigation.getParam('fromId');
    messages[0].userTo = userTo;
    messages[0].userFrom = userFrom;
    messages[0].sent = 1;
    if(this.state.status=="online"){
      messages[0].received = 1;
    } else{
      messages[0].received = 0;
    }
    if(messages[0].text.length>0 || messages[0]?.image?.length>0 || messages[0]?.video?.length>0){
      this.socket.emit("chat message",messages[0]);
    }
  }
  // renderBubble = props => {
  //   return (
  //     <Bubble
  //       {...props}
  //       wrapperStyle={{
  //         left: {
  //           backgroundColor: 'white',
  //         },
  //       }}
  //     />
  //   )
  // }

  // renderMessageVideo = (props: any) => {
  //   const { currentMessage } = props;
  //   return (
  //     <View style={{ padding: 20 }}>
  //     <Text>Video</Text>
  //     {/* <VideoPlayer url={currentMessage.video}/> */}
  //     </View>
  //   );
  // };

  sendMessage = (text)=>{
    // console.log(text);
    let messages = [{message:{text:'',_id:'',createdAt:new Date(),userTo:'',userFrom:'',user:{}}}];
    let userTo = this.props.navigation.getParam('id');
    let userFrom = this.props.navigation.getParam('fromId');
    let sender=this.props.navigation.getParam('sender');
    let randomTime = new Date().getTime();
    messages[0].message.text=text;
    messages[0].message._id = randomTime;
    messages[0].message.user = {_id:userFrom,name:sender}
    messages[0].message.userTo = userTo;
    messages[0].message.userFrom = userFrom;
    // this.socket.emit("chat message",messages[0].message);
    // this.setState({messageText:''});
  }

  chooseImage() {
    const options = {
        title: "Select Image",
        takePhotoButtonTitle: "Take photo",
        chooseFromLibraryButtonTitle: "Choose from library",
        chooseWhichLibraryTitle:"Choose Anyone",
        allowsEditing: true,
        storageOptions: {
          skipBackup: true,
          path:'images'
        },
        cancelButtonTitle: "cancel",
        cameraType: 'front',
        mediaType: 'photo',
        aspectX: 1,
        aspectY: 1,
        quality: 1.0
    };
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ');
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ');
        } else if (response.customButton) {
            if (response.customButton === 'remove') {
                console.log('User tapped custom button: ');
                this.setState({ Images: undefined });
            }
        } else {
          let source = {uri: response.uri};
          this.setState({
            resourcePath: response
          });
          this.sendToBackend(response);
          // let fromId=parseInt(this.props.navigation.getParam('fromId'));
          // let userTo=parseInt(this.props.navigation.getParam('id'));
          // let sender=this.props.navigation.getParam('sender');
          // console.log("response uri",response.uri);
          //   const source = { uri: response.uri };
          //   const uriParts = response.uri.split('.');
          //   const fileType = uriParts[uriParts.length - 1];
          //   let photo = {
          //     uri: response.uri,
          //     type: 'image/jpeg',
          //     name: new Date().getTime()+".jpg",
          //   };

          //   let form = new FormData();
          //   form.append("upload", photo);
          //   fetch(environment+'/users/imageMsg',
          //     {
          //       method: "POST",
          //       headers: {
          //         'Content-Type':'multipart/formdata'
          //       },
          //       body: form
          //     }
          //   ).then((response) => response.json())
          //   .then((responseData) => {
          //     console.log("Image sent",responseData);
          //     if(responseData.success){
          //       let img_url = environment+"/images/"+source.uri;
          //   let msg = [{
          //     _id: new Date().getTime(),
          //     createdAt: new Date(),
          //     user: {
          //         _id: fromId,
          //         name: sender,
          //     },
          //     image: img_url
          // }]
          // this.onSend(msg)
            //   } else{
            //     alert(responseData.message);
            //   }
            // }).done();
        }
    });
}

sendToBackend(response){
  this.setState({imageUploading: true});
          let fromId=parseInt(this.props.navigation.getParam('fromId'));
          let userTo=parseInt(this.props.navigation.getParam('id'));
          let sender=this.props.navigation.getParam('sender');
          // console.log("response uri",response.uri);
            const source = { uri: response.uri };
            const uriParts = response.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            let photo = {
              uri: 'data:images/jpeg;base64,'+this.state.resourcePath.data,
              type: 'image/jpeg',
              name: new Date().getTime()+".jpg",
            };

            let form = new FormData();
            form.append("upload", photo);
            let fileOk = JSON.stringify(form);
            // let parsed = JSON.parse(fileOk);
            // console.log(parsed._parts[0][1]['uri']);
            fetch(environment+'/users/imageMsg',
              {
                method: "POST",
                headers: {
                  'Content-Type':'application/json'
                },
                body: JSON.stringify(form)
              }
            ).then((response) => response.json())
            .then((responseData) => {
              // console.log("Image sent",responseData);
              if(responseData.success){
                let img_url = environment+"/images/"+responseData.fileName;
                // console.log(img_url);
            let msg = [{
              text: this.state.customMessage,
              _id: new Date().getTime(),
              createdAt: new Date(),
              user: {
                  _id: fromId,
                  name: sender,
              },
              image: img_url
          }];

          this.setState({imageUploading: false});
          // alert(responseData.message);
          this.onSend(msg)
              } else{
                alert(responseData.message);
              }
            }).done();
}

chooseVideo() {
    // console.log("choose vids called ");
    const options = {
        title: null,
        takePhotoButtonTitle: "Take video",
        chooseFromLibraryButtonTitle: "choose video",
        cancelButtonTitle: "cancel",
        cameraType: 'front',
        mediaType: 'video',
        videoQuality:'medium',
        aspectX: 1,
        aspectY: 1,
        allowsEditing: true,
        quality: 1.0,
    };
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
            console.log('User cancelled video picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            if (response.customButton === 'remove') {
                console.log('User tapped custom button: ', response.customButton);
                this.setState({ Vids: undefined });
            }
        } else {
          let fromId=parseInt(this.props.navigation.getParam('fromId'));
          let userTo=parseInt(this.props.navigation.getParam('id'));
          let sender=this.props.navigation.getParam('sender');
            const source = { uri: response.uri };
            let msg = [{
                _id: new Date().getTime().toString(),
                createdAt: new Date(),
                user: {
                    _id: fromId,
                    name: sender,
                },
                video: source.uri,
            }]
            this.onSend(msg)
        }
    });
}

renderLeftIcon = () =>{
    return(
        <View  style={{ height:'100%',alignItems:'center'  , justifyContent:'flex-start' , flexDirection:'row' , paddingLeft:5,paddingRight: 5}}>

            {/* <TouchableOpacity onPress={this.chooseVideo.bind(this)} >
            <Icon name="camera"/>
            </TouchableOpacity> */}
            {!this.state.imageUploading?
            <TouchableOpacity onPress={this.chooseImage.bind(this)}>
            <Icon name="camera" style={styles.camera}/>
            </TouchableOpacity>:null}

            {this.state.imageUploading?
            <TouchableOpacity>
            <Icon name="sync" style={styles.camera}/>
            </TouchableOpacity>:null}

        </View>
    );
}


renderLoading = ()=>{
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:25,color:'#3399cc'}}><Icon name="sync" style={{color:'#3399cc'}}/> Loading...</Text>
    </View>
  )
}

loadMessages =() =>{
  this.setState({loading:true});
  if(this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let message;
        if(Math.ceil(this.state.chatsLen/10)>0){
        let chatsLen = this.state.chatsLen-10;
        let nextLen = this.state.nextLen;
        nextLen +=10;
        let nextToLen = this.state.nextToLen;
        if(nextToLen>=19){
        nextToLen += 10;
        } else{
          nextToLen += 9;
        }
        this.setState({nextLen,nextToLen});
        message = this.state.chats.slice(nextLen,nextToLen);
        this.setState({chatsLen,loading:false});
        } else{
          nextLen = this.state.chats.length-10;
          nextToLen = 10;
          this.setState({nextLen,nextToLen});
        message = this.state.chats.slice(nextLen,this.state.chats.length);
        this.setState({chatsLen:0,loading:false});
        }
        if(message){
        this.setState(previousState=>({
          messages: GiftedChat.prepend(previousState.messages,message)
        }))
        }
      }, 500);

}

onMessageTyping(message){
  this.setState({customMessage:message});
  let fromId=parseInt(this.props.navigation.getParam('fromId'));
  let userTo=parseInt(this.props.navigation.getParam('id'));
    this.socket.emit("typing",fromId);
    this.socket.on("is typing",user=>{
      // console.log("typer",user);
      if(parseInt(user)==parseInt(userTo) && parseInt(user)!=parseInt(fromId)){
    this.setState({isMessageTyping:true});
    if(this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({isMessageTyping:false});
      }, 500);
      }
    });
}

  render(){
    const connect = this.state.connected;
    let title=this.props.navigation.getParam('name');
    let sender=this.props.navigation.getParam('sender');
    let id=this.props.navigation.getParam('id');
    let fromId=parseInt(this.props.navigation.getParam('fromId'));
    let allmsgs = this.state.messages.map(msg=><Text key={msg._id} style={msg.user._id==fromId?styles.rightMessage:styles.leftMessage}>{msg.text}</Text>)
    let { customMessage } = this.state
    return (
      <View style={{flex:1,flexDirection: 'column',backgroundColor: '#fff'}}>
      <CustomHeader title={title} status={this.state.status} typing={this.state.isMessageTyping} navigation={this.props.navigation}/>
      <View style={{justifyContent:'center',alignItems:'center'}}>
      {this.state.imageUploading?<Text style={{fontSize:15,color:'#3399cc'}}>Sending Image</Text>:null}
      </View>
      {/* {this.renderLoading()} */}
<View style={{flex:1,backgroundColor:'lightgray'}}>
      <GiftedChat
      // renderUsernameOnMessage={true}
      alwaysShowSend={true}
      scrollToBottom
      showUserAvatar
      // renderUsernameOnMessage
      isAnimated={true}
        placeholder="Type your message..."
        messages={this.state.messages}
        text={customMessage}
        onInputTextChanged={text=> this.onMessageTyping(text)}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: fromId,
          name: sender,
          // avatar: 'https://www.facebook.com/images/fb_icon_325x325.png'
        }}
        useNativeDriver={true}
        // renderBubble={this.renderBubble}
        // renderMessageVideo={this.renderMessageVideo}
        renderLoading={this.renderLoading}
        onLoadEarlier={this.loadMessages}
        isLoadingEarlier={this.state.loading}
        // renderAvatarOnTop
        loadEarlier={this.state.chatsLen >= 10}
        scrollToBottomComponent={() => (
          <Icon name='camera' size={20} color='#fff' />
        )}
        // extraData={this.state}
        timeTextStyle={{left:{color:'gray'},right:{color:'white'}}}
        renderActions={this.renderLeftIcon}
        // renderActions={() => {
        //   if (Platform.OS === "android") {
        //     return (
        //       <Icon
        //         name="mic"
        //         size={35}
        //         hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
        //         color={this.state.startAudio ? "red" : "black"}
        //         style={{
        //           bottom: 50,
        //           right: Dimensions.get("window").width / 2,
        //           position: "absolute",
        //           shadowColor: "#000",
        //           shadowOffset: { width: 0, height: 0 },
        //           shadowOpacity: 0.5,
        //           zIndex: 2,
        //           backgroundColor: "transparent"
        //         }}
        //         onPress={this.handleAudio}
        //       />);
        //     }
        //   }}
      />
      <KeyboardAvoidingView />
      </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  camera:{
    paddingVertical: 8,
    paddingHorizontal: 16,
    color:"lightgray",
  }
});