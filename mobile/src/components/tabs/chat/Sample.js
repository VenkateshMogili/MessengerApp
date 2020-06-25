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
  Image
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { GiftedChat,Bubble } from 'react-native-gifted-chat'
// import VideoPlayer from 'react-native-video-player';
// import Video from 'react-native-af-video-player'
import io from 'socket.io-client';
// import {VideoPlayer} from './screens/VideoPlayer';

import {environment} from '../../../constants/environment';
export class Sample extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
    }
  }
  componentDidMount() {
    this.socket = io(environment);
    let userDetails = {userid:2};
    this.socket.emit("connected",userDetails);
    this.socket.on("chat message",msg=>{
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, msg),
    }))
  });
  }

  onSend(messages = []) {
    this.socket.emit("chat message",messages[0]);
    // this.setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }))
    // this.socket.on("chat message",messages=>{
    //   console.log(messages);
    //   this.setState(previousState => ({
    //     messages: GiftedChat.append(previousState.messages, messages),
    //   }))
    // });
  }
  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    )
  }

  // renderMessageVideo = (props: any) => {
  //   const { currentMessage } = props;
  //   return (
  //     <View style={{ padding: 20 }}>
  //     <Text>Video</Text>
  //     {/* <VideoPlayer url={currentMessage.video}/> */}
  //     </View>
  //   );
  // };

  render() {
    return (
      <View style={{flex:1}}>
      <View style={styles.chatHeader}>
      <Text style={{color:"white"}}>Chat Messenger</Text>
      </View>
      <GiftedChat
      scrollToBottom
      showUserAvatar
       loadEarlier
        placeholder="Type your message..."
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
          name:"Ramani Venkatesh"
        }}
        useNativeDriver={true}
        renderBubble={this.renderBubble}
        renderMessageVideo={this.renderMessageVideo}
        timeTextStyle={{left:{color:'red'},right:{color:'yellow'}}}
      />
      </View>
    )
  }
}
//   componentDidMount(){
//     // this.socket = io("http://192.168.42.166:3000");
//     // this.socket.on("chat message",msg=>{
//     //   this.setState({chatMessages:[...this.state.chatMessages,msg]});
//     // });
//   }
//   componentWillUnmount(){
//     // this.state.chatMessages =[];
//   }
//   submitChatMessage(){
//     // this.socket.emit("chat message",this.state.chatMessage);
//     // this.setState({chatMessage:""});
//   }
//   render(){
//     // const chatMessages = this.state.chatMessages.map(chatMessage=><Text key={chatMessage}>{chatMessage}</Text>);
//   return (
//           <View>
//           <Example></Example>
//           </View>
//   );
//   }
// };

const styles = StyleSheet.create({
  chatHeader:{
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#3399cc",
    padding:5,
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: 'black',
  }
});