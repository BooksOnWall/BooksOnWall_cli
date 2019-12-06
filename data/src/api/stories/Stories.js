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


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

function Item({ id, title, selected, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? '#6e3b6e' : '#f9c2ff' },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

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
      <SafeAreaView style={styles.container}>
        <FlatList
          ItemSeparatorComponent={
            <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
          }
          data={[{title: 'Title Text', key: 'item1'}]}
          renderItem={({item, index, separators}) => (
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('Story', {'story': item})}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{backgroundColor: 'white'}}>
                <Text>{item.title}</Text>
              </View>
            </TouchableHighlight>
          )}
          />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
