'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroConstants,
  ViroARScene,
  ViroARImageMarker,
  ViroVideo,
  ViroText,
  ViroARTrackingTargets,
  ViroAmbientLight
} from 'react-viro';
import KeepAwake from 'react-native-keep-awake';
import Sound from 'react-native-sound';

// import mural from './storage/emulated/0/Android/data/com.booksonwall/BooksOnWall/8/stages/20/pictures/IMG_4868.jpg';
//
// import video from '../assets/video/small.3gp';
// ViroARTrackingTargets.createTargets({
//   "targetOne" : {
//     source : mural,
//     orientation : "Up",
//     physicalWidth : 0.1 // real world width in meters
//   },
// });

export default class ArScene extends Component {
  constructor(props) {
    super(props);
    let params = this.props.sceneNavigator.viroAppProps;
    // Set initial state here
    this.state = {
      text : "Start BooksOnWall AR ...",
      text2 : "Mural detected ...",
      server: params.server,
      appName: params.appName,
      appDir: params.appDir,
      initialPosition: null,
      lastPosition: null,
      fromLat: null,
      fromLong: null,
      toLat: null ,
      toLong: null,
      distance: null,
      story: params.story,
      index: params.index,
      stage: params.story.stages[params.index],
      pictures: params.pictures,
      onZoneEnter: params.onZoneEnter,
      onZoneLeave: params.onZoneLeave,
      onPictureMatch: params.onPictureMatch
    };
    console.table(this.state.pictures);
    console.log(params.appDir);
    // bind 'this' to functions
    this.onInitialized = this.onInitialized.bind(this);
  }
  componentDidMount = async () => {
    try {
      await KeepAwake.activate();
      await this.buildTrackingTargets();
      // console.table(stage);
      // let audiofile = this.state.appDir+'/'+this.state.story.id+'/stages/onZoneEnter/'+this.state.stage.onZoneEnter[0].name;
      // console.log(audiofile);
      // let loop = this.state.stage.onZoneEnter[0].loop;
      // await this.loadAndPlayAudio(audiofile, loop);
    } catch(e) {
      console.log(e);
    }
  }
  componentWillUnmount = async () => KeepAwake.deactivate();
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
    let pictures = this.state.pictures;
    try {
      for (let picture of pictures) {
        let path = picture.path;
        let radius = this.state.stage.radius;
        let dimension = this.state.stage.dimension.split("x")[0].parseFloat().toFixed(2);
        path = path.replace("assets/stories", "");
        path = "file:///"+ this.state.appDir + path;
        console.log('image_path', path);
        console.log('appDir', this.state.appDir);
        console.log('dimension', dimension);

        await ViroARTrackingTargets.createTargets({
          "targetOne" : {
            source : {uri:'file:///storage/emulated/0/Pictures/myImage.jpg'},
            orientation : "Up",
            physicalWidth : dimension, // real world width in meters
            type: 'Image'
          },
        });
       }
    } catch(e) {
      console.log(e);
    }

  }
  loadAndPlayAudio = async (audiofile, loop) => {
    //@audiofile is stage path + filename
    try {
      // Enable playback in silence mode
      Sound.setCategory('Playback');

      // Load the sound file 'audio.mp3' from the app bundle
      // See notes below about preloading sounds within initialization code below.
      const audio = await new Sound(audiofile, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + audio.getDuration() + 'number of channels: ' + audio.getNumberOfChannels());

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

      // Reduce the volume by half
      audio.setVolume(0.7);

      // Position the sound to the full right in a stereo field
      // audio.setPan(1);

      // Loop indefinitely until stop() is called
      if(loop) await audio.setNumberOfLoops(-1);

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
      audio.release();
    } catch(e) {

    }
  }
  render() {
    return (
      <ViroARScene onTrackingUpdated={this.onInitialized}>
        <ViroARImageMarker target={"targetOne"} >
            <ViroText text={this.state.text} width={2} height={2} position={[0, 0, -2]} style={styles.helloWorldTextStyle} />
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
