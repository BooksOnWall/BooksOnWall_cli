import React, { Component } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  View,
  Platform,
  I18nManager,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { Button, ThemeProvider, ListItem } from 'react-native-elements';

export default class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Platform: Platform,
      stories: [],
      storiesURL: 'https://api.booksonwall.art/stories',
      isLoading: true,
    };
  }
  static navigationOptions = {
    title: 'Stories',
  };
  componentDidMount = async () => {
    try {
      if(Platform === 'web') {
        return this.props.navigation.navigate('Intro');
      }
      this.setState({stories: this.props.screenProps.stories, isLoading: false});
    }catch(e) {
      console.log("Error fetching data-----------", e);
    }
  }
  render() {
    if (this.state.isLoading || this.state.Platform === 'web') {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    const stories = this.state.stories;

    return (
      <SafeAreaView style={styles.container}>
        <ThemeProvider>
          {
            stories.map((story, i) => (
              <ListItem
                key={i}
                onPress={() => this.props.navigation.navigate('Story', {'story': story})}
                title={story.title}
                bottomDivider
                chevron
              />
            ))
          }
        </ThemeProvider>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
