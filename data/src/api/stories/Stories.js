import React, { Component } from 'react';
import {
  Platform,
  Animated,
  Linking,
  StyleSheet,
  Text,
  View,
  I18nManager,
  ActivityIndicator,
  TouchableOpacity } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from 'react-native-vector-icons/MaterialIcons';
import GmailStyleSwipeableRow from './GmailStyleSwipeableRow';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
//  To toggle LTR/RTL uncomment the next line
I18nManager.allowRTL(true);
const Row = ({ item }) => (
  <RectButton style={styles.rectButton} onPress={() => this.props.navigation.navigate('Story', {'story': item})} >
    <Text style={styles.fromText}>{item.title}}</Text>
    <Text numberOfLines={1} style={styles.messageText}>
      {item.aa.name}
    </Text>
    <Text style={styles.dateText}>
      {item.updatedAt} {'❭'}
    </Text>
  </RectButton>
);
const SwipeableRow = ({ item, index }) => {
  if (index % 2 === 0) {
  return (
    <AppleStyleSwipeableRow>
      <Row item={item} />
    </AppleStyleSwipeableRow>
  );
} else {
  return (
    <GmailStyleSwipeableRow>
      <Row item={item} />
    </GmailStyleSwipeableRow>
  );
}
};
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
    return (
      <View style={styles.container}>

      <FlatList
        data={this.state.stories}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <SwipeableRow item={item} index={index}  />
        )}
        keyExtractor={(item, index) => `id ${index}`}
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#388e3c',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end'
  },
  container: {
    flex:1,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'center',
  },
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
});
