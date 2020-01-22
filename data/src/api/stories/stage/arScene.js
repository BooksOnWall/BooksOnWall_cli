'use strict';

import React, { Component } from 'react';

import {SafeAreaView,ActivityIndicator, Button, Text,StyleSheet, TouchableHighlight} from 'react-native';
//import { Button, Icon } from 'react-native-elements';
import {
  ViroConstants,
  ViroARScene,
  ViroARImageMarker,
  ViroVideo,
  ViroImage,
  ViroText,
  ViroARTrackingTargets,
  ViroAmbientLight
} from 'react-viro';
import KeepAwake from 'react-native-keep-awake';
import Sound from 'react-native-sound';

export default class ArScene extends Component {
  constructor(props) {
    super(props);
    let params = this.props.sceneNavigator.viroAppProps;
    // Set initial state here
    this.state = {
      text : "You Found me ...",
      server: params.server,
      appName: params.appName,
      appDir: params.appDir,
      story: params.story,
      index: params.index,
      stage: params.story.stages[params.index],
      pictures: params.pictures,
      picturePath: "",
      audioPath: "",
      videoPath: "",
      onZoneEnter: params.onZoneEnter,
      onZoneLeave: params.onZoneLeave,
      onPictureMatch: params.onPictureMatch
    };
    // console.table(this.state.pictures);
    // console.log(params.appDir);
    // bind 'this' to functions
    this.onInitialized = this.onInitialized.bind(this);
    this.buildTrackingTargets = this.buildTrackingTargets.bind(this);
    this.setVideoComponent = this.setVideoComponent.bind(this);
    this.loadAndPlayAudio = this.loadAndPlayAudio.bind(this);
  }
  componentDidMount = async () => {
    try {
      await KeepAwake.activate();
      await this.loadAndPlayAudio();
      await this.setVideoComponent();
      await this.buildTrackingTargets();
    } catch(e) {
      console.log(e);
    }
  }
  componentWillUnmount = async () => {
    await KeepAwake.deactivate();
    await audio.release();
  }
  onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Search for me ..."
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
  buildTrackingTargets = async () => {
    try {
      let pictures = this.state.pictures;
      //for (let picture of pictures) {
        //let path = picture.path;
        let path = pictures[0].path;
        let radius = this.state.stage.radius;
        let dimension = this.state.stage.dimension.split("x");
        let width = parseFloat(dimension[0]);
        let height = parseFloat(dimension[1]);
        path = this.state.appDir + path.replace("assets/stories", "");
        //this.setState({picturePath: path});
        await ViroARTrackingTargets.createTargets({
          "targetOne" : {
            source : { uri: path },
            orientation : "Up",
            physicalWidth : width, // real world width in meters
            type: 'Image'
          },
        });
       //}
    } catch(e) {
      console.log(e);
    }
  }
  setVideoComponent = () => {
    let path = this.state.stage.onPictureMatch[0].path;
    path = this.state.appDir + path.replace("assets/stories", "");;
    console.log(path);
    this.setState({'videoPath': path});
  }
  loadAndPlayAudio = async () => {
    //@audiofile is stage path + filename
    console.log('loadAndPlayAudio');
    try {
      let path = this.state.stage.onZoneEnter[0].path;
      path = this.state.appDir + path.replace("assets/stories", "");;
      this.setState({audioPath: path});
      console.log('audio_path', path);
      let loop = this.state.stage.onZoneEnter[0].loop;
      console.log('loop', loop);
      // Enable playback in silence mode
      Sound.setCategory('Playback');

      // Load the sound file 'audio.mp3' from the app bundle
      // See notes below about preloading sounds within initialization code below.
      const audio = await new Sound(path, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + audio.getDuration() + 'number of channels: ' + audio.getNumberOfChannels());
        // Reduce the volume by half
        audio.setVolume(0.7);

        // Position the sound to the full right in a stereo field
        // audio.setPan(1);

        // Loop indefinitely until stop() is called
        if(loop) audio.setNumberOfLoops(-1);
        // Play the sound with an onEnd callback
        audio.play((success) => {
          if (success) {
            // here as the audio is terminated we are ready for discover
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });



      // Get properties of the player instance
      console.log('volume: ' + audio.getVolume());
      console.log('pan: ' + audio.getPan());
      console.log('loops: ' + audio.getNumberOfLoops());

      // // Seek to a specific point in seconds
      // audio.setCurrentTime(2.5);
      //
      // // Get the current playback point in seconds
      // audio.getCurrentTime((seconds) => console.log('at ' + seconds));
      //
      // // Pause the sound
      // audio.pause();
      //
      // // Stop the sound and rewind to the beginning
      // audio.stop(() => {
      //   // Note: If you want to play a sound after stopping and rewinding it,
      //   // it is important to call play() in a callback.
      //   audio.play();
      // });

      // Release the audio player resource
      //audio.release();
    } catch(e) {
      console.log(e);
    }
  }
  toPath = (radius) => {
      console.log('radius', radius);
  }
  render = () => {
    if (!this.state.videoPath && this.state.videoPath === "") {
      return (
          <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </SafeAreaView>
      );
    }
    return (
      <ViroARScene onTrackingUpdated={this.onInitialized}>
        <ViroARImageMarker target={"targetOne"} >
            <ViroVideo
              source={require(this.state.videoPath)}
              height={3}
              width={3}
              loop={false}
              position={[0,2,-5]}
            />
        </ViroARImageMarker>
      </ViroARScene>
    );
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
