import React , { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { fromRight } from 'react-navigation-transitions';
import AR from './src/Ar';
import Intro from './src/api/intro/intro';
import Stories from './src/api/stories/Stories';
import Story from './src/api/stories/Story';
import Stages from './src/api/stories/stages/Stages';
import Stage from './src/api/stories/stage/Stage';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import SplashScreen from 'react-native-splash-screen';
import FirstRun from './src/api/firstRun/FirstRun';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RNLocalize from "react-native-localize";
import {check, request,  PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import NetInfo from "@react-native-community/netinfo";
import { Overlay } from 'react-native-elements';
const MainNavigator = createStackNavigator({
  Intro: { screen: Intro},
  Stories: {screen: Stories},
  Story: {screen: Story}
},
{
    headerMode: 'none',
    initialRouteName: 'Intro',
    navigationOptions: {
      header: null
    }

});


const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      storiesURL: 'https://api.booksonwall.art/stories',
      isLoading: false,
    };
  }
  componentDidMount = async () => {
    try {
      if(Platform.OS !== 'web') {
        await this.handleLocales();
        //await this.networkCheck();
        await this.checkPermissions();
        await this.loadStories();
        SplashScreen.hide();
      }
    } catch (e) {
      console.warn(e);
    }
  }
  networkCheck = () => {
    NetInfo.fetch().then(state => {
      // console.warn("Connection type", state.type);
      // console.warn("Is connected?", state.isConnected);
      !state.isConnected ? console.error('No internet connection') : '';


    });
  }
  checkPermissions = async () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
      }),
    );
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
        // The user has accepted to enable the location services
        // data can be :
        //console.warn(data);
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      }).catch(err => {
        console.warn(err);
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
      });
  }
  handleLocales = async () => {
    this.locales = RNLocalize.getLocales();
  }
  loadStories = async () => {
    try {
      this.setState({isLoading: true});
      await fetch(this.state.storiesURL, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            return this.setState({stories: data.stories, isLoading: false});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.error(error);
      });
    } catch(e) {
      console.warn(e);
    }
  }
  render() {

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
        <AppContainer screenProps={this.state} setState={this.setState} />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    alignContent:'center',
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'center',
  },
});
