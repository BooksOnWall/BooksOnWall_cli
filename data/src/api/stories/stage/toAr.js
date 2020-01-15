/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
import React, { PureComponent } from 'react';
import {
  Platform,
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';

import { ViroARSceneNavigator} from 'react-viro';
import InitialARScene from './arScene';
import KeepAwake from 'react-native-keep-awake';
/*
 TODO: Insert your API key below unneeded sin v.2.17
 */
let sharedProps = {
  apiKey:"API_KEY_HERE",
};
let UNSET = "UNSET";
let AR_NAVIGATOR_TYPE = "AR";

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
let defaultNavigatorType = "AR";

export default class ToAR extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      navigatorType : defaultNavigatorType,
      server: this.props.screenProps.server,
      appName: this.props.screenProps.appName,
      appDir: this.props.screenProps.AppDir,
      initialPosition: null,
      lastPosition: null,
      fromLat: null,
      fromLong: null,
      toLat: null ,
      toLong: null,
      distance: null,
      story: this.props.navigation.getParam('story'),
      index: this.props.navigation.getParam('index'),
      stage: this.props.navigation.getParam('story').stages[this.props.navigation.getParam('index')],
      sharedProps : sharedProps
    }
    console.table(this.state.stage);
    // this.getExperienceSelector = this.getExperienceSelector.bind(this);
    // this.getARNavigator = this.getARNavigator.bind(this);
    // this.getExperienceButtonOnPress = this.getExperienceButtonOnPress.bind(this);
    // this.exitViro = this.exitViro.bind(this);
  }
  static navigationOptions = {
    title: 'To Augmented Reality',
    headerShown: false
  };
  componentDidMount = async () => await KeepAwake.activate();
  componentWillUnmount = async () => {
    try {
      await KeepAwake.deactivate();
      this.setState({
        navigatorType : UNSET
      });
    } catch(e) {
      console.log(e);
    }

  }
  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {
    let params = {
      sharedProps: this.state.sharedProps,
      server: this.state.server,
      story: this.state.story,
      index: this.state.index,
      pictures: this.state.stage.pictures,
      onZoneEnter: this.state.stage.onZoneEnter,
      onZoneLeave: this.state.stage.onZoneLeave,
      onPictureMatch: this.state.stage.onPictureMatch,
      appDir: this.state.appDir
    };
    return (
      //shadowsEnabled={true} bloomEnabled={true} hdrEnabled={true}
      <ViroARSceneNavigator viroAppProps={params}
        initialScene={{scene: InitialARScene}} />
    );
    // if (this.state.navigatorType == UNSET) {
    //   return this.getExperienceSelector();
    // } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
    //   return this.getARNavigator();
    // }
  }
  // Presents the user with a choice of an AR or VR experience
  // getExperienceSelector() {
  //   return (
  //     <View style={localStyles.outer} >
  //       <View style={localStyles.inner} >
  //         <Text style={localStyles.titleText}>
  //           Choose your desired experience:
  //         </Text>
  //         <TouchableHighlight style={localStyles.buttons}
  //           onPress={this.getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)}
  //           underlayColor={'#68a0ff'} >
  //           <Text style={localStyles.buttonText}>AR</Text>
  //         </TouchableHighlight>
  //
  //         <TouchableHighlight style={localStyles.buttons}
  //           onPress={this.getExperienceButtonOnPress(VR_NAVIGATOR_TYPE)}
  //           underlayColor={'#68a0ff'} >
  //
  //           <Text style={localStyles.buttonText}>VR</Text>
  //         </TouchableHighlight>
  //       </View>
  //     </View>
  //   );
  // }

  // // Returns the ViroARSceneNavigator which will start the AR experience
  // getARNavigator() {
  //   let params = {
  //     sharedProps: this.state.sharedProps,
  //     server: this.state.server,
  //     story: this.state.story,
  //     index: this.state.index,
  //     pictures: this.state.stage.pictures,
  //     onZoneEnter: this.state.stage.onZoneEnter,
  //     onZoneLeave: this.state.stage.onZoneLeave,
  //     onPictureMatch: this.state.stage.onPictureMatch,
  //     appDir: this.state.appDir
  //   };
  //   return (
  //     <ViroARSceneNavigator viroAppProps={params}
  //       initialScene={{scene: InitialARScene}} />
  //   );
  // }

  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  // getExperienceButtonOnPress(navigatorType) {
  //   return () => {
  //     this.setState({
  //       navigatorType : navigatorType
  //     })
  //   }
  // }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  // exitViro() {
  //   this.setState({
  //     navigatorType : UNSET
  //   })
  // }
}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});
