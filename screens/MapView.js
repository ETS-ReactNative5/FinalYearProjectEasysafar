import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import { Platform } from "react-native";
import SearchBar from './SearchBar';


const { width, height } = Dimensions.get("screen");

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      latitude: 37.78825,
      longitude: -122.4324,
    };
  }

  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {


    if (Platform.OS === 'android' && !Constants.isDevice) {
      this._getLocationAsync();
    } else {
      this._getLocationAsync();
    }
  }
    
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
      errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  ComponentDidMount() {

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => this.setState({ errors: error.message }),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
    );
  }

  render() {

    let currentlatitudeint = 0;
    let currentlongitudeint = 0;
    let currentlatitude = "";
    let currentlongitude = "";
    let currentaddress = "";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    }
    else if (this.state.location) {
      currentlatitude = JSON.stringify(this.state.location.coords.latitude);
      currentlongitude = JSON.stringify(this.state.location.coords.longitude);
      currentlatitudeint = parseFloat(currentlatitude);
      currentlongitudeint = parseFloat(currentlongitude);
 

      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + currentlatitudeint + ',' + currentlongitudeint + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc')
        .then((response) => response.json())
        .then((responseJson) => {
        currentaddress = responseJson.results[0].formatted_address;
        console.log(currentaddress);
      })
    }

    return (
      <Block style={styles.group}>
        <MapView style={styles.map} 
          region={{
            latitude: currentlatitudeint,
            longitude: currentlongitudeint,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
          showsUserLocation={true}
        />
        <SearchBar />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  group: {
    flex: 1
  },
  map: {
    width: width,
    height: height / 2.5,
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    paddingHorizontal: theme.SIZES.BASE * 4, 
    marginBottom: theme.SIZES.BASE , 
     justifyContent: "center",
    width: width   ,
    height: theme.SIZES.BASE * 4,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  button: {
    backgroundColor: theme.COLORS.SUCCESS,  
  },

})

export default Map;