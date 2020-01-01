import React, {Component} from 'react';
import { Alert, Platform, TouchableOpacity, ScrollView, SafeAreaView, Animated, Image, StyleSheet, View, Text, I18nManager } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

export default class Story extends Component {
  static navigationOptions = {
    title: 'Story'
  };
  constructor(props) {
    super(props);
    this.state = {
      server: this.props.screenProps.server,
      appName: this.props.screenProps.appName,
      AppDir: this.props.screenProps.AppDir,
      downloadProgress: 0,
      story: this.props.navigation.getParam('story'),
    };
  }

  downloadStory = (sid) => {
    const AppDir = this.state.AppDir;
    RNFetchBlob
    .config({
        addAndroidDownloads : {
            title : 'Story_'+ sid + '.zip',
            useDownloadManager : true, // <-- this is the only thing required
            // Optional, override notification setting (default to true)
            notification : true,
            // Optional, but recommended since android DownloadManager will fail when
            // the url does not contains a file extension, by default the mime type will be text/plain
            mime : 'application/zip',
            description : 'Story downloaded by BooksOnWall.',
            mediaScannable: true,
            path : AppDir
        }
    })
    .fetch('POST', this.state.server + '/zip/' + sid)
    // .progress({ interval: 250 },(received,total)=>{
    //   console.log('progress:',received/total);
    //   this.setState({downloadProgress:(received/total)*100});
    // })
    .then((resp) => {
      // the path of downloaded file
      //const p = resp.path(); android manager can't get the downloaded path
      this.setState({downloadProgress:0});
      let path_name = AppDir+'/'+'Story_'+ sid + '.zip'

      return this.installStory(sid, path_name);
    });
  }
  installStory = (sid, path) => {
  //   RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  // .then((result) => {
  //   console.log('GOT RESULT', result);
  //
  //   // stat the first file
  //   return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  // })
  // .then((statResult) => {
  //   if (statResult[0].isFile()) {
  //     // if we have a file, read it
  //     return RNFS.readFile(statResult[1], 'utf8');
  //   }
  //
  //   return 'no file';
  // })
  // .then((contents) => {
  //   // log the file contents
  //   console.log('content:', contents);
  // })
  // .catch((err) => {
  //   console.log(err.message, err.code);
  // });
    return true;
  }
  componentDidMount() {
    if (!this.props.navigation.getParam('story') ) this.props.navigation.navigate('Stories');
  }
  launchStory = () => this.props.navigation.navigate('ToStage', {'story': this.state.story, 'position': 1})
  deleteStory = async (sid) => {
    try {
      await Alert.alert(
        'Delete Story',
        'Are you sure you want to do this ?',
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Yes destroy it!', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    } catch(e) {
      console.log(e);
    }

  }
  render() {
    const story = this.state.story;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Card title={story.title}>
            <HTMLView
              value={story.sinopsys}
              stylesheet={styles}
              />
            <TouchableOpacity style={styles.bottomButtons}>
              <Icon
                raised
                name='download'
                type='font-awesome'
                color='#f50'
                onPress={() => this.downloadStory(story.id)}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtons}>
              <Icon
                raised
                name='trash'
                type='font-awesome'
                color='#f50'
                onPress={() => this.deleteStory(story.id)}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtons}>
              <Icon
                raised
                name='play-circle'
                type='font-awesome'
                color='#f50'
                onPress={() => this.launchStory()}
              />
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'yellow',
    marginHorizontal: 0,
  },
  bottomButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 100,
    paddingLeft: 8
  }
});
