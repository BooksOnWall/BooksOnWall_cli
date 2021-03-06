'use strict';

import React, { Component } from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  ViroConstants,
  ViroARScene,
  ViroARObjectMarker,
  ViroMaterials,
  ViroVideo,
  ViroSound,
  ViroARTrackingTargets,
  ViroAmbientLight
} from 'react-viro';
import KeepAwake from 'react-native-keep-awake';
import I18n from "../../utils/i18n";
import { Patricie } from './Patricie';
import TOTEM from '../../../assets/object/TOBAL_v1.obj';


export default class TotemScene extends Component {
  constructor(props) {
    super(props);
    let params = this.props.sceneNavigator.viroAppProps;
    // Set initial state here
    console.log('theme',params.theme);
    this.toogleButtonAudio = params.toggleButtonAudio;
    this.goToMap = params.goToMap;
    this.next = params.next;
    let scene_options = (typeof(params.stage.scene_options) === 'string') ? JSON.parse(params.stage.scene_options) : params.stage.scene_options;

    this.state = {
      server: params.server,
      appName: params.appName,
      appDir: params.appDir,
      storyDir: params.appDir+'/stories/',
      story: params.story,
      index: params.index,
      pIndex: 0,
      scene_options: scene_options,
      stage: params.stage,
      pictures: params.pictures,
      picturePath: "",
      audioPath: "",
      paused: (params.paused) ? params.paused : false,
      muted: (params.muted) ? params.muted : false,
      MatchAudioPath: null,
      MatchAudioPaused: true,
      MatchAudioMuted: false,
      MatchAudioLoop: false,
      finishAll: params.finishAll,
      animate: {name: 'movePicture'},
      anchorFound: false,
      imageTracking: params.imageTracking,
      message : I18n.t("NextPath", "Go to the next point"),
      theme: params.theme,
      fontFamily: params.theme.font3,
      color: params.theme.color1,
      audios: [],
      video: {},
      audioLoop: false,
      videoPath: "",
      videoLoop: false,
      lockVideo: false,
      onZoneEnter: params.onZoneEnter,
      onZoneLeave: params.onZoneLeave,
      onPictureMatch: params.onPictureMatch
    };
    this.onInitialized = this.onInitialized.bind(this);
    this.buildTrackingTargets = this.buildTrackingTargets.bind(this);
    this.setVideoComponent = this.setVideoComponent.bind(this);
    this.loadAndPlayAudio = this.loadAndPlayAudio.bind(this);
  }
  componentDidMount = async () => {
    try {
      await KeepAwake.activate();
      await this.dispatchMedia();
      await this.setVideoComponent();
      await this.buildTrackingTargets();
    } catch(e) {
      console.log(e);
    }
  }
  componentWillUnmount = async () => {
    try {
      await KeepAwake.deactivate();
    } catch(e) {
      console.log(e.message);
    }

  }
  goToNext = () => {
    this.setState({animate: 'rotate'});
    setTimeout(() => {
      return this.props.sceneNavigator.viroAppProps.goToNext();
    }, 5000);

  }
  onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {

    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
  configureAnimations = async (finishAll, loop=false) => {
    const name ='movePicture';
    const run = finishAll;
    //this.setState({animate:{name, run, loop}});
    return ({name , run, loop});
  }
  buildTrackingTargets = async () => {
    const {pIndex, stage, pictures, storyDir, scene_options} = this.state;
    try {
        let radius = stage.radius;
        let width = (scene_options.pictures && scene_options.pictures.length >0 ) ? parseFloat(scene_options.pictures[pIndex].width) : 1;
        let height = (scene_options.pictures && scene_options.pictures.length >0 ) ? parseFloat(scene_options.pictures[pIndex].height) : 1;
        //let path = 'file://' + this.state.storyDir + path.replace("assets/stories", "");
        //this.setState({picturePath: path});
        await ViroARTrackingTargets.createTargets({
          "targetTotem" : {
            source : TOTEM,
            orientation : "Up",
            physicalWidth : width, // real world width in meters
            type: 'Object'
          },
        });

       // create materials

    } catch(e) {
      console.log(e);
    }
  }
  audio = null
  stopAudio = () => {
    const {anchorFound} = this.state;
    console.log('anchorFound', anchorFound);
    if(anchorFound === null) {
      console.log('stop audio');
      this.setState({anchorFound: true, audioLoop: false});
      this.toggleButtonAudio();
    }
  }
  dispatchMedia = async () => {
    try  {
      const {story, index, storyDir} = this.state;
      let stage =  story.stages[index];
      stage.onZoneEnter = (typeof(stage.onZoneEnter) === 'string') ? JSON.parse(stage.onZoneEnter) : stage.onZoneEnter;
      stage.onPictureMatch = (typeof(stage.onPictureMatch) === 'string') ? JSON.parse(stage.onPictureMatch) : stage.onPictureMatch;
      let audios = [];
      let videos = [];
      audios['onZoneEnter'] = (stage.onZoneEnter && stage.onZoneEnter.length > 0 ) ? stage.onZoneEnter.filter(item => item.type === 'audio'): null;
      audios['onPictureMatch'] = (stage.onPictureMatch && stage.onPictureMatch.length > 0) ? stage.onPictureMatch.filter(item => item.type === 'audio') : null;
      videos['onPictureMatch'] = (stage.onPictureMatch && stage.onPictureMatch.length > 0) ? stage.onPictureMatch.filter(item => item.type === 'video') : null;

      this.setState({audios: audios, videos: videos});

      if (audios['onPictureMatch'] && audios['onPictureMatch'].length > 0 ) {
        let MatchAudio = audios['onPictureMatch'][0];
        let Matchpath = MatchAudio.path.replace(" ", "\ ");
        Matchpath = 'file://'+ storyDir + Matchpath.replace("assets/stories", "");
        let Matchloop = MatchAudio.loop;
        this.setState({MatchAudioPath: Matchpath,MatchAudioLoop: Matchloop });
      }
      if (audios['onZoneEnter'] && audios['onZoneEnter'].length > 0 ) {
        let audio = audios['onZoneEnter'][0];
        let path = audio.path.replace(" ", "\ ");
        path = 'file://'+ storyDir + path.replace("assets/stories", "");
        let loop = audio.loop;
        this.setState({'audioPath': path,'audioLoop': loop });
      }
    } catch(e) {
      console.log(e);
    }

  }
  setVideoComponent = () => {
    const { videos, storyDir} = this.state;

    if (videos.onPictureMatch && videos.onPictureMatch.length > 0 ) {
      const video =  videos.onPictureMatch[0];
      if (video) {
        let path = video.path.replace(" ", "\ ");
        path = 'file://' + storyDir + path.replace("assets/stories/", "");
        let loop = video.loop;
        this.setState({'videoPath': path, 'videoLoop': loop});
      }
    }
  }
  loadAndPlayAudio = (zone) => {
    // play the first audio onZoneEnter or onPictureMatch after the video is finished
    // @zone string onZoneEnter or onPictureMatch
    const {audios, storyDir} = this.state;
      // set path & loop to audios : one by zone
      (zone === 'onPictureMatch' && audios && audios[zone] && audios[zone].length > 0) ? this.setState({MatchAudioPaused: false}) : this.setState({audioPaused: true, finishAll: true});
  }
  toggleButtonAudio = async () => this.props.sceneNavigator.viroAppProps.toggleButtonAudio()
  onFinishAll = () => this.setState({finishAll: true})
  onFinishSound = () => {
    this.toggleButtonAudio();
    console.log("Sound terminated");
  }
  onAnchorFound = e => {
    const {lockVideo} = this.state;
    if(!lockVideo) {
      this.setState({lockVideo: true});
      this.toggleButtonAudio();
    }
    console.log(e);
  }
  onBufferStart = () => {
    console.log("On Buffer Start");
  }
  onFinishVideo = () => {
    this.setState({imageTracking:  false});
    this.loadAndPlayAudio('onPictureMatch');
    console.log("Video terminated");
  }
  onVideoError = (event) => {
    console.log("Video loading failed with error: " + event.nativeEvent.error);
  }
  onErrorSound = (event) => {
    console.log("Audio loading failed with error: " + event.nativeEvent.error);
  }
  toPath = (radius) => {
      console.log('radius', radius);
  }
  onButtonGaze() {
      this.setState({ buttonStateTag: "onGaze" });
  }
  onButtonTap() {
      this.setState({ buttonStateTag: "onTap" });
  }

  render = () => {
    const {index, message,animate, fontFamily, color, imageTracking, finishAll, theme, pIndex, scene_options, MatchAudioPath, MatchAudioLoop, MatchAudioPaused, MatchAudioMuted, audioPath, audioLoop, videoPath, videoLoop } = this.state;
    const {audioPaused, audioMuted} = this.props.sceneNavigator.viroAppProps;
    const font = String(theme.font3,theme.font2,theme.font1);
    const textColor = String(color);
    // <ViroARImageMarker onAnchorFound={() => this.stopAudio()} ...
    return (
      <SafeAreaView>
      <ViroARScene onTrackingUpdated={this.onInitialized} >
        <ViroSound
           paused={audioPaused}
           muted={audioMuted}
           source={{uri: audioPath }}
           loop={audioLoop}
           volume={.8}
           onFinish={this.onFinishSound}
           onError={this.onErrorSound}
        />
      <ViroARObjectMarker visible={imageTracking} target={"targetTotem"} onAnchorFound={this.onAnchorFound}  >
            <ViroVideo
              source={{uri: videoPath}}
              dragType="FixedToWorld"
              onDrag={()=>{}}
              width={parseFloat(scene_options.videos[0].width)}
              height={parseFloat(scene_options.videos[0].height)}
              muted={false}
              paused={false}
              visible={imageTracking}
              loop={videoLoop}
              position={[0,0,0]}
              rotation={[-90,0,0]}
              opacity={1}
              onBufferStart={this.onBufferStart}
              onFinish={this.onFinishVideo}
              onError={this.onVideoError}
              materials={["chromaKeyFilteredVideo"]}
            />
        </ViroARObjectMarker>
        {(MatchAudioPath) ?
          <ViroSound
             paused={MatchAudioPaused}
             muted={MatchAudioMuted}
             source={{uri: MatchAudioPath }}
             loop={MatchAudioLoop}
             volume={1.0}
             onFinish={this.onFinishAll}
             onError={this.onErrorSound}
          /> : null}
          <Patricie
            animate={{name: 'movePicture', run: finishAll, loop: false}}
            animate2={{name: 'moveBaloon', run: finishAll, loop: false}}
            animate3={{name:  'moveText', run: finishAll, loop: false }}
            finishAll={finishAll}
            theme={theme}
            next={this.next}
            message={message}
            theme={theme}
            font={font}
            textColor={color}
            />


      </ViroARScene>
      </SafeAreaView>
    );
  }
}
ViroMaterials.createMaterials({
  chromaKeyFilteredVideo : {
    chromaKeyFilteringColor: "#00FF00"
  },
});

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
