/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const {width, height} = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component<{}> {

  constructor(props) {
    super(props)

    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      markerPoisition: {
        latitude: 0,
        longitude: 0
      },
       coords: []
    }
  }

  watchID: ?number = null

  componentDidMount() {

    // find your origin and destination point coordinates and pass it to our method.
    // I am using Bursa,TR -> Istanbul,TR for this example
    //this.getDirections("36.6283,127.458", "36.62906382,127.45631933")

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = parseFloat(position.coords.latitude)
      const long = parseFloat(position.coords.longitude)

      const  initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      this.setState({initialPosition: initialRegion})
      this.setState({markerPoisition: initialRegion})
    },
    (error) => console.log(JSON.stringify(error)),
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000})

    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position)
      const lat = parseFloat(position.coords.latitude)
      const long = parseFloat(position.coords.longitude)

      const  lastRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      this.setState({initialPosition: lastRegion})
      this.setState({markerPoisition: lastRegion})
    },
    (error) => console.log(JSON.stringify(error)),
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000})
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

//   async getDirections(startLoc, destinationLoc) {
//     try {
//         let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Concord,MA&waypoints=Charlestown,MA|Lexington,MA`)
//         let respJson = await resp.json();
//         console.log(respJson);
//         let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
//         let coords = points.map((point, index) => {
//             return  {
//                 latitude : point[0],
//                 longitude : point[1]
//             }
//         })
//         this.setState({coords: coords})
//         return coords
//     } catch(error) {
//         alert(error)
//         return error
//     }
// }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={this.state.initialPosition}>
          <MapView.Marker
            coordinate={this.state.markerPoisition}>
            <View style={styles.radius}>
              <View style={styles.marker}>
              </View>
            </View>
          </MapView.Marker>
        </MapView>
        <Text>Latitude: {this.state.initialPosition.latitude}</Text>
        <Text>Longitude: {this.state.initialPosition.longitude}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radius: {
      height: 50,
      width: 50,
      borderRadius: 50 / 2,
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(0, 122, 255, 0.3)',
      alignItems: 'center',
      justifyContent: 'center'
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    backgroundColor: '#007AFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
