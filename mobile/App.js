import 'react-native-gesture-handler';
import React, { Component,useState } from 'react';
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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import {IMAGE} from './src/constants/Image';
import {ChatList, Chat, ContactList, Contact,Profile, Feed,FeedDetails,Search,SearchDetails,
  Category,CategoryDetails,Login,Register,
  ForgotPassword,AuthLoading,Logout} from './src/components';
console.reportErrorsAsExceptions = false;
console.disableYellowBox = true;
const navOptionHandler = (navigation)=>({
  headerShown: false,
  tabBarOnPress: (scene, jumpToIndex) => {
    console.log('onPress:', scene.route);
    jumpToIndex(scene.index);
  },
})
const FeedStack = createStackNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: navOptionHandler
  },
  FeedDetails: {
    screen: FeedDetails,
    navigationOptions: navOptionHandler
  }
});

const CategoryStack = createStackNavigator({
  Category: {
    screen: Category,
    navigationOptions: navOptionHandler
  },
  CategoryDetails: {
    screen: CategoryDetails,
    navigationOptions: navOptionHandler
  }
});

const SearchStack = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: navOptionHandler
  },
  SearchDetails: {
    screen: SearchDetails,
    navigationOptions: navOptionHandler
  }
});
const ChatStack = createStackNavigator({
  ChatList: {
    screen: ChatList,
    navigationOptions: navOptionHandler
  },
  Chat: {
    screen: Chat,
    navigationOptions: navOptionHandler
  }
});
const ContactStack = createStackNavigator({
  ContactList: {
    screen: ContactList,
    navigationOptions: navOptionHandler
  },
  Contact: {
    screen: Contact,
    navigationOptions: navOptionHandler
  },
  Chat: {
    screen: Chat,
    navigationOptions: navOptionHandler
  }
});
const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: navOptionHandler
  }
});
// const Tab = createMaterialTopTabNavigator();
// function MainTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Chats" component={ChatList} />
//       <Tab.Screen name="Contacts" component={ContactList} />
//       <Tab.Screen name="Profile" component={Profile} />
//     </Tab.Navigator>
//   );
// }

// function MainTabsScreen(){
//   return (
//     <NavigationContainer>
//       <MainTabs/>
//     </NavigationContainer>
//   )
// }
ChatStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'Chat' ) {
      tabBarVisible = false
  }

  return {
      tabBarVisible,
  }
}
ContactStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'Chat' ) {
      tabBarVisible = false
  }

  return {
      tabBarVisible,
  }
}
const MainTabs = createBottomTabNavigator({
  Chat: {
    screen: ChatStack,
    navigationOptions:{
      tabBarLabel: 'Chats',
      tabBarIcon: ({tintColor}) =>(
        <Image
          source={IMAGE.MESSENGER}
          resizeMode="contain"
          style={{width:20,height:20}}
        />
    )
    }
  },
  Contact: {
    screen: ContactStack,
    navigationOptions:{
      tabBarLabel: 'Contacts',
      tabBarIcon: ({tintColor}) =>(
        <Image
          source={IMAGE.CONTACTS}
          resizeMode="contain"
          style={{width:20,height:20}}
        />
    )
    }
  },
  Profile:  {
    screen: ProfileStack,
    navigationOptions:{
      tabBarLabel: 'Profile',
      tabBarIcon: ({tintColor}) =>(
        <Image
          source={IMAGE.ICON_USER_DEFAULT}
          resizeMode="contain"
          style={{width:20,height:20}}
        />
      )
    }
  },
});

const MainStack = createStackNavigator({
  Home:{
    screen: MainTabs,
    navigationOptions: navOptionHandler
  },
},{initialRouteName:'Home'})

const authStack = createStackNavigator({
  Login:{
    screen: Login,
    navigationOptions: navOptionHandler
  },
  Register:{
    screen: Register,
    navigationOptions: navOptionHandler
  },
  ForgotPassword:{
    screen: ForgotPassword,
    navigationOptions: navOptionHandler
  },
  Logout:{
    screen: Logout,
    navigationOptions: navOptionHandler
  }
});


const MainApp = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    app:MainStack,
    auth:authStack
  },
  {
    initialRouteName:'AuthLoading'
  }
)
const AppNavigator = createAppContainer(MainApp);

export default class App extends React.Component{
  render(){
    return(
      <AppNavigator/>
    )
  }
}