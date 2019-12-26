import React, {Component} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {lineString as makeLineString} from '@turf/helpers';

import RouteSimulator from './utils/RouteSimulator';
import {directionsClient} from './MapboxClient';
import sheet from './styles/sheet';
import {SF_OFFICE_COORDINATE} from './utils';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';
import PulseCircleLayer from './common/PulseCircleLayer';

const SF_ZOO_COORDINATE = [-122.505412, 37.737463];
const styles = StyleSheet.create({
  buttonCnt: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  button: {
    borderRadius: 3,
    backgroundColor: 'blue',
  },
});

const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'white',
  },
  route: {
    lineColor: 'white',
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
};

MapboxGL.setAccessToken('pk.eyJ1IjoiY3JvbGwiLCJhIjoiY2p4cWVmZDA2MDA0aTNkcnQxdXhldWxwZCJ9.3pr6-2NQQDd59UBRCEeenA');

class ToStage extends Component {
  static navigationOptions = {
    title: 'To Stage'
  };
  static propTypes = {
    ...BaseExamplePropTypes,
  };
  constructor(props) {
    super(props);

    this.state = {
      prevLatLng: null,
      track: null,
      distanceTotal:null,
      latitude: null,
      record: null,
      showUserLocation: true,
      route: null,
      currentPoint: null,
      routeSimulator: null,
      server: this.props.screenProps.server,
      appName: this.props.screenProps.appName,
      AppDir: this.props.screenProps.AppDir,
      story: this.props.navigation.getParam('story'),
      order: this.props.navigation.getParam('order'),
      location: [],
      position: {},
    };

    this.onStart = this.onStart.bind(this);
  }

  onStart() {
    const routeSimulator = new RouteSimulator(this.state.route);
    routeSimulator.addListener(currentPoint => this.setState({currentPoint}));
    routeSimulator.start();
    this.setState({routeSimulator});
  }
  componentDidMount = async () => {
    try {
      const reqOptions = {
        waypoints: [
          {coordinates: SF_OFFICE_COORDINATE},
          {coordinates: SF_ZOO_COORDINATE},
        ],
        profile: 'walking',
        geometries: 'geojson',
      };

      const res = await directionsClient.getDirections(reqOptions).send();

      this.setState({
        route: makeLineString(res.body.routes[0].geometry.coordinates),
      });
      await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
        }),
      );
      await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
      );
      //await findCoordinates();

      await navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({position: position});
          console.log(JSON.stringify(position));
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 1}
      );

      this.watchID = await navigator.geolocation.watchPosition((lastPosition) => {
        var { distanceTotal, record } = this.state;
        this.setState({lastPosition});
        if(record) {
          var newLatLng = {latitude:lastPosition.coords.latitude, longitude: lastPosition.coords.longitude};
          this.setState({ track: this.state.track.concat([newLatLng]) });
          this.setState({ distanceTotal: (distanceTotal + this.calcDistance(newLatLng)) });
          this.setState({ prevLatLng: newLatLng });
        }
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1});
    } catch(e) {
      console.log(e);
    }
  }
  componentWillUnmount() {
    if (this.state.routeSimulator) {
      this.state.routeSimulator.stop();
    }
  }

  renderRoute() {
    if (!this.state.route) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id="routeSource" shape={this.state.route}>
        <MapboxGL.LineLayer
          id="routeFill"
          style={layerStyles.route}
          belowLayerID="originInnerCircle"
          />
      </MapboxGL.ShapeSource>
    );
  }

  renderCurrentPoint() {
    if (!this.state.currentPoint) {
      return;
    }
    return (
      <PulseCircleLayer
        shape={this.state.currentPoint}
        aboveLayerID="destinationInnerCircle"
        />
    );
  }

  renderProgressLine() {
    if (!this.state.currentPoint) {
      return null;
    }

    const {nearestIndex} = this.state.currentPoint.properties;
    const coords = this.state.route.geometry.coordinates.filter(
      (c, i) => i <= nearestIndex,
    );
    coords.push(this.state.currentPoint.geometry.coordinates);

    if (coords.length < 2) {
      return null;
    }

    const lineString = makeLineString(coords);
    return (
      <MapboxGL.Animated.ShapeSource id="progressSource" shape={lineString}>
        <MapboxGL.Animated.LineLayer
          id="progressFill"
          style={layerStyles.progress}
          aboveLayerID="routeFill"
          />
      </MapboxGL.Animated.ShapeSource>
    );
  }

  renderOrigin() {
    let backgroundColor = 'white';

    if (this.state.currentPoint) {
      backgroundColor = '#314ccd';
    }

    const style = [layerStyles.origin, {circleColor: backgroundColor}];

    return (
      <MapboxGL.ShapeSource
        id="origin"
        shape={MapboxGL.geoUtils.makePoint(SF_OFFICE_COORDINATE)}
        >
        <MapboxGL.Animated.CircleLayer id="originInnerCircle" style={style} />
      </MapboxGL.ShapeSource>
    );
  }

  renderActions() {
    if (this.state.routeSimulator) {
      return null;
    }
    return (
      <View style={styles.buttonCnt}>
        <Button
          raised
          title="Start"
          onPress={this.onStart}
          style={styles.button}
          disabled={!this.state.route}
          />
      </View>
    );
  }

  render() {
    return (
      <Page {...this.props}>
        <MapboxGL.MapView
          ref={c => (this._map = c)}
          style={sheet.matchParent}
          styleURL={MapboxGL.StyleURL.Dark}
          >
          <MapboxGL.Camera
            zoomLevel={11}
            centerCoordinate={[-122.452652, 37.762963]}
            />

          {this.renderOrigin()}

          {this.renderRoute()}
          {this.renderCurrentPoint()}
          {this.renderProgressLine()}

          <MapboxGL.ShapeSource
            id="destination"
            shape={MapboxGL.geoUtils.makePoint(SF_ZOO_COORDINATE)}
            >
            <MapboxGL.CircleLayer
              id="destinationInnerCircle"
              style={layerStyles.destination}
              />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>

        {this.renderActions()}
      </Page>
    );
  }
}

export default ToStage;
