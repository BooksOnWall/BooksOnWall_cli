import React, {Component} from 'react';
import { TouchableOpacity, ScrollView, SafeAreaView, Animated, Image, StyleSheet, View, Text, I18nManager } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import RNFetchBlob from 'rn-fetch-blob';

export default class Story extends Component {
  static navigationOptions = {
    title: 'Story'
  };
  constructor(props) {
    super(props);
    this.state = {
      story: this.props.navigation.getParam('story'),
    };
  }
  downloadStory = (sid) => {
    RNFetchBlob
    .config({
        addAndroidDownloads : {
            useDownloadManager : true, // <-- this is the only thing required
            // Optional, override notification setting (default to true)
            notification : true,
            // Optional, but recommended since android DownloadManager will fail when
            // the url does not contains a file extension, by default the mime type will be text/plain
            mime : 'application/tar',
            description : 'Story downloaded by download manager.'
        }
    })
    .fetch('POST', 'https://api.booksonwall.art/assets/export/stories/'+sid+'/story_'+sid+'.tar')
    .then((resp) => {
      // the path of downloaded file
      resp.path();
      console.warn(resp.path);
    })

  }
  componentDidMount() {
    if (!this.props.navigation.getParam('story') ) this.props.navigation.navigate('Stories');
  }
  render() {
    const story = this.props.navigation.getParam('story');
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
                onPress={() => this.downloadStory(story.id)} />
              <Icon
                raised
                name='trash'
                type='font-awesome'
                color='#f50'
                onPress={() => console.warn('trash')} />
              <Icon
                raised
                name='play-circle'
                type='font-awesome'
                color='#f50'
                onPress={() => console.warn('play')} />
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
