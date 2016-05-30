/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  View
} from 'react-native';
// import {
//   MapView
// } from 'react-native-maps';

const REQUEST_URL = "https://fy34jriqn4.execute-api.eu-central-1.amazonaws.com/prod/react_resource";

class SpikeReactNative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pharmacies: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      // region: {
      //   latitude: 37.78825,
      //   longitude: -122.4324,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({initialPosition}),
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      var latitude = 0;
      var longitude = 0;
      if(lastPosition !== undefined) {
        latitude = lastPosition.coords.latitude;
        longitude = lastPosition.coords.longitude;
        this.fetchData(latitude,longitude);
      }

    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  fetchData(latitude, longitude) {
    fetch(REQUEST_URL + "?latitude=" + latitude + "&longitude=" + longitude)
      .then((response) => response.json())
      .then((pharmacies) => {
        this.setState({
          pharmacies: this.state.pharmacies.cloneWithRows(pharmacies),
          //pharmacies: pharmacies,
          loaded: true,
          // region: {
          //   latitude: latitude,
          //   longitude: longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }
        });
      })
      .done();
  }

  onRegionChange(region) {
    this.setState({region});
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.pharmacies}
        renderRow={this.renderPharmacies}
        style={styles.listView}
      />
    );
    // return renderMapView();
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading your position and retrieving nearest pharmacies...
        </Text>
      </View>
    );
  }

  renderPharmacies(pharmacy) {
    return (
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{pharmacy.name}</Text>
          <Text style={styles.year}>{pharmacy.city}</Text>
        </View>
      </View>
    );
  }

  // renderMapView() {
  //    return (
  //       <MapView
  //        initialRegion={{
  //          latitude: 37.78825,
  //          longitude: -122.4324,
  //          latitudeDelta: 0.0922,
  //          longitudeDelta: 0.0421
  //        }}
  //       />
  //    );
  // }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 5,
    paddingBottom: 5,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('SpikeReactNative', () => SpikeReactNative);
