import 'react-native-gesture-handler';
import React from 'react';
import { Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import {IMAGE} from './constants/Image';
import { createDrawerNavigator } from 'react-navigation-drawer';

import {SideMenu,Feed,FeedDetails,Search,SearchDetails,
  Category,CategoryDetails,Profile,Settings,Login,Register} from './components';

const navOptionHandler = (navigation)=>({
  headerShown: false
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
const MainTabs = createBottomTabNavigator({
  Category: {
    screen: CategoryStack,
    navigationOptions:{
      tabBarLabel: 'Categories',
      tabBarIcon: ({tintColor}) =>(
        <Image
          source={IMAGE.ICON_MENU}
          resizeMode="contain"
          style={{width:20,height:20}}
        />
    )
    }
  },
  Feed: {
    screen: FeedStack,
    navigationOptions:{
      tabBarLabel: 'Cart',
      tabBarIcon: ({tintColor}) =>(
        <Image
          source={IMAGE.ICON_MENU}
          resizeMode="contain"
          style={{width:20,height:20}}
        />
    )
    }
  },
  Search:  {
    screen: SearchStack,
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
    screen:MainTabs,
    navigationOptions: navOptionHandler
  },
  Settings: {
    screen: Settings,
    navigationOptions: navOptionHandler
  },
  Profile:{
    screen: Profile,
    navigationOptions: navOptionHandler
  }
},{initialRouteName:'Home'})

const appDrawer = createDrawerNavigator(
  {
    drawer: MainStack
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width*3/4
  }
);

const authStack = createStackNavigator({
  Login:{
    screen: Login,
    navigationOptions: navOptionHandler
  },
  Register:{
    screen: Register,
    navigationOptions: navOptionHandler
  }
});


const MainApp = createSwitchNavigator(
  {
    app:appDrawer,
    auth:authStack
  },
  {
    initialRouteName:'auth'
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