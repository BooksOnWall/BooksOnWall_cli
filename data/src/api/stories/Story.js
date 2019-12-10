import React, {Component} from 'react';
import { TouchableOpacity, ScrollView, SafeAreaView, Animated, Image, StyleSheet, View, Text, I18nManager } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';

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
                onPress={() => console.warn('download')} />
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
