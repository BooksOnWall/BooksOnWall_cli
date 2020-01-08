/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid
} from "react-native";
import NavigationView from "./NavigationView";
import { NativeModules } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { MAPBOX_KEY  } from 'react-native-dotenv';
type Props = {};
export default class App extends Component<Props,$FlowFixMeState > {
  state = {
    access_token: MAPBOX_KEY,
    profile: 'mapbox/walking',
    initialPosition: null,
    lastPosition: null,
    granted: Platform.OS === "ios",
    fromLat: -34.90949779775191,
    fromLong: -56.17891507941232,
    toLat: -34.90949779775191 ,
    toLong: -56.17891507941232
  };
  watchID: ?number = null;
  componentDidMount() {
    if (!this.state.granted) {
      this.requestFineLocationPermission();
    }
    // Instead of navigator.geolocation, just use Geolocation.
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = position;
        this.setState({fromLat: position.coords.latitude, fromLong: position.coords.longitude})
        this.setState({initialPosition});
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = position;
      this.setState({lastPosition});
    });

  }
  componentWillUnmount() {
   this.watchID != null && Geolocation.clearWatch(this.watchID);
  }
  async requestFineLocationPermission() {
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
        console.log("ACCESS_FINE_LOCATION permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    const { access_token, profile, granted, fromLat, fromLong, toLat, toLong } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <Text>
            <Text style={styles.welcome}>Initial position:</Text>
            {this.state.initialPosition ? JSON.stringify(this.state.initialPosition.coords) : ''}
          </Text>
          <Text>
            <Text style={styles.welcome}>Current position: </Text>
            {this.state.lastPosition ? JSON.stringify(this.state.lastPosition.coords) : ''}
          </Text>
        <View>
        </View>
          {Platform.OS === "android" && (
            <Button
              title={"Start Navigation - NativeModule"}
              onPress={() => {
                NativeModules.MapboxNavigation.navigate(
                  fromLat,
                  fromLong,
                  toLat,
                  toLong,
                  // profile,
                  // access_token
                );
              }}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "whitesmoke"
  },
  subcontainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "whitesmoke"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  navigation: {
    backgroundColor: "gainsboro",
    flex: 1
  }
});
