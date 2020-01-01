import React, {Component} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {
  Platform,
  Text,
  PermissionsAndroid,
  Alert,
  SafeAreaView,
  StyleSheet } from 'react-native';
import {Button} from 'react-native-elements';
import {lineString as makeLineString} from '@turf/helpers';
import NavigationView from "./NavigationView";
import { NativeModules } from "react-native";

type Props = {};
export default class ToStage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      granted: Platform.OS === "ios",
      fromLat: -56.17891507941232,
      fromLong: -34.90949779775191,
      toLat: -56.177511043686316,
      toLong: -34.909745005492645
    };
  }
  componentDidMount() {
    if (!this.state.granted) {
      this.requestFineLocationPermission();
    }
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
    const { granted, fromLat, fromLong, toLat, toLong } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.subcontainer}>
          <Text style={styles.welcome}>
            Welcome to Mapbox Navigation for React Native
          </Text>
        </SafeAreaView>
        {granted && (
          <NavigationView
            style={styles.navigation}
            destination={{
              lat: toLat,
              long: toLong
            }}
            origin={{
              lat: fromLat,
              long: fromLong
            }}
          />
        )}
        <SafeAreaView style={styles.subcontainer}>
          <Text style={styles.welcome}>Another View !</Text>
          {Platform.OS === "android" && (
            <Button
              title={"Start Navigation - NativeModule"}
              onPress={() => {
                NativeModules.MapboxNavigation.navigate(
                  fromLat,
                  fromLong,
                  toLat,
                  toLong
                );
              }}
            />
          )}
        </SafeAreaView>
      </SafeAreaView>
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
