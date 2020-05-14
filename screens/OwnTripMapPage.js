import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, SegmentedControlIOSComponent, View } from "react-native";
import { AsyncStorage } from 'react-native';
import Polyline from '@mapbox/polyline';
import haversine from 'haversine-distance'
var distance = require('euclidean-distance')
import Spinner from 'react-native-loading-spinner-overlay';

class createtrip extends Component {
    constructor(props) {
        super(props);
        //Initial State
        this.state = {
            latitude: null,
            longitude: null,
            error: null,
            coords: [],
            departurePlaceID: "",
            destinationPlaceID: "",
            startingLat: null,
            startingLong: null,
            endingLat: null,
            endingLong: null,

            startingLatMarker: 0,
            startingLongMarker: 0,
            endingLatMarker: 0,
            endingLongMarker: 0,

            places_nearby: [],
            spinner: false,
            query: ""



        };
    }

    componentDidMount() {
        this.function();



    }

    async function() {
        // let string;
        this.setState({
            spinner: true
        });
        // var PlacesSelected = await AsyncStorage.getItem('PlacesSelected');
        // let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
        // let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');

        // var PlacesArray = PlacesSelected.split(',');
        // let finalstring = "";
        // for (var i = 0; i < PlacesArray.length; i++) {
        //     let string = "place_id:" + PlacesArray[i] + "|";
        //     finalstring = finalstring + string;
        // }

        // console.warn(finalstring)
        this.setState({
            spinner: false
        });
        // this.setState({ query: finalstring })
        this.getDirections();
    }


    render() {
        const { startingLat, startingLong, places_nearby, finalstring } = this.state;

        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Preparing your trip'}
                    textStyle={styles.spinnerTextStyle}
                />



                <MapView style={styles.map} initialRegion={{
                    latitude: startingLat,
                    longitude: startingLong,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}>

                    {/* {places_nearby.map((marker, i) => (

                        <MapView.Marker
                            key={i}
                            coordinate={{
                                latitude: marker.marker.latitude,
                                longitude: marker.marker.longitude
                            }}
                            title={marker.name}
                        />
                    ))} */}


                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={2}
                        strokeColor="red" />

                    <MapView.Marker
                        draggable
                        coordinate={{
                            latitude: 24.8607,

                            longitude: 67.0011
                        }}
                    />



                </MapView>
            </View>
        );
    }

}

const styles = StyleSheet.create({

    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
});

export default createtrip;


