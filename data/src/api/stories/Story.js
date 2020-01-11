import React, {Component} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { Alert, Platform, ActivityIndicator, ScrollView, Animated, Image, StyleSheet, View, Text, I18nManager } from 'react-native';
import { Header,Card, ListItem, ButtonGroup, Button, Icon, ThemeProvider } from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';
import { MAPBOX_KEY  } from 'react-native-dotenv';
import  distance from '@turf/distance';
import HTMLView from 'react-native-htmlview';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import Reactotron from 'reactotron-react-native';

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
    title: 'Story',
    headerShown: false
  };
  constructor(props) {
    super(props);
    this.state = {
      server: this.props.screenProps.server,
      appName: this.props.screenProps.appName,
      appDir: this.props.screenProps.AppDir,
      photo: 'file://'+this.props.screenProps.AppDir+'/'+ this.props.navigation.getParam('story').id + '/stages/'+ this.props.navigation.getParam('story').stages[0].id + '/' + this.props.navigation.getParam('story').stages[0].photo[0].name,
      downloadProgress: 0,
      story: this.props.navigation.getParam('story'),
      granted: Platform.OS === 'ios',
      transportIndex: 0,
      dlIndex: null,
      access_token: MAPBOX_KEY,
      profile: 'mapbox/walking',
      initialPosition: null,
      lastPosition: null,
      fromLat: null,
      fromLong: null,
      toLat: null ,
      toLong: null,
      distance: null
    };
    this.updateTransportIndex = this.updateTransportIndex.bind(this);
    this.updateDlIndex = this.updateDlIndex.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
  }
  updateTransportIndex = (transportIndex) => this.setState({transportIndex})
  updateDlIndex = (dlIndex) => this.setState({dlIndex})
  watchID: ?number = null;
  downloadStory = (sid) => {
    const appDir = this.state.appDir;
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
            path : appDir
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
      let path_name = appDir+'/'+'Story_'+ sid + '.zip'

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
  getCurrentLocation = async () => {
    try {
      // Instead of navigator.geolocation, just use Geolocation.
      await Geolocation.getCurrentPosition(
        position => {
          const initialPosition = position;
          this.setState({fromLat: position.coords.latitude, fromLong: position.coords.longitude});
          this.setState({initialPosition});
        },
        error => Alert.alert('Error', JSON.stringify(error)),
        { timeout: 2000, maximumAge: 1000, enableHighAccuracy: true},
      );
      this.watchID = await Geolocation.watchPosition(position => {
        const lastPosition = position;
        this.setState({lastPosition});
        this.setState({fromLat: position.coords.latitude, fromLong: position.coords.longitude});
        let from = {
          "type": "Feature",
          "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [this.state.fromLong, this.state.fromLat]
            }
          };
          let to = {
            "type": "Feature",
            "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": [this.state.toLong, this.state.toLat]
              }
            };
          let units = "kilometers";
          let dis = distance(from, to, units);
          Reactotron.log('distance', dis);
          if (dis) {
            this.setState({distance: dis.toFixed(2)});
          };
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {timeout: 2000, maximumAge: 1000, enableHighAccuracy: true, distanceFilter: 1},
      );
    } catch(e) {
      console.log(e);
    }
  }
  requestFineLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "ACCESS_FINE_LOCATION",
          message: "Mapbox navigation needs ACCESS_FINE_LOCATION"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ granted: true });
      } else {
        Reactotron.log("ACCESS_FINE_LOCATION permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  componentDidMount = async () => {
    if (!this.props.navigation.getParam('story') ) this.props.navigation.navigate('Stories');
    try {
      if (!this.state.granted) {
        await this.requestFineLocationPermission();
      }
      await this.getCurrentLocation();
    } catch(e) {
      console.log(e);
    }
  }
  launchStory = () => this.props.navigation.navigate('ToStage', {'story': this.state.story, 'position': 1, state: this.state })
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

  // storyPlay = () => <Text>Play</Text>
  // storyDelete = () => <Text>Delete</Text>
  // storyInstall = () => <Text>Install</Text>
  render() {
    const {photo, story, distance, transportIndex, dlIndex,  access_token, profile, granted, fromLat, fromLong, toLat, toLong } = this.state;
    const transportbuttons = ['Auto', 'Pedestrian', 'Bicycle'];
    const storyPlay = () => <Icon raised name='play-circle' type='font-awesome' color='#f50' onPress={() => this.launchStory()} />;
    const storyDelete = () => <Icon raised name='trash' type='font-awesome' color='#f50' onPress={() => this.deleteStory(story.id)} />;
    const storyInstall = () => <Icon raised name='download' type='font-awesome' color='#f50' onPress={() => this.downloadStory(story.id)} />;
    const dlbuttons = (story.isInstalled) ? [ { element: storyDelete }, { element: storyPlay }]: [ { element: storyInstall }];
    Reactotron.log('photo', photo);
    // if (!distance || this.state.Platform === 'web') {
    //   return (
    //     <View style={styles.loader}>
    //       <Text style={styles.loader}>{'['+ fromLong +',' +fromLat+']  ['+toLong+', '+ toLat+ ']'}</Text>
    //       <Text style={styles.loader}>Please wait while we get your GPS Position</Text>
    //       <ActivityIndicator size="large" color="#0000ff" />
    //     </View>
    //   );
    // }
    return (
      <ThemeProvider>
        <SafeAreaView style={styles.container}>
          <Header
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: story.title, style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
            />
            <Card>
              <ScrollView style={styles.sinopsys}>
                <HTMLView
                  value={story.sinopsys}
                  stylesheet={styles}
                />
              </ScrollView>

              {distance && (<Text>You are at {distance.toFixed(2)} km from the beginning of your story.</Text>)}
              <Text style={styles.bold}> Please choose your mode of transportation and press Start Navigation.</Text>
              <ButtonGroup
                onPress={this.updateTransportIndex}
                selectedIndex={transportIndex}
                buttons={transportbuttons}
                containerStyle={{height: 40}}
                disabled={[1, 2]}
                //disabled={true}
                />
              <ButtonGroup
                onPress={this.updateDlIndex}
                selectedIndex={dlIndex}
                buttons={dlbuttons}
                containerStyle={{height: 60}}

                />
            </Card>
        </SafeAreaView>
      </ThemeProvider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "whitesmoke"
  },
  sinopsys: {
    minHeight: 300,
    maxHeight: 300,
    marginHorizontal: 0,
  },
  scrollView: {
    marginHorizontal: 0,
  },
  bold: {
    fontWeight: 'bold'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "whitesmoke"
  }
});
