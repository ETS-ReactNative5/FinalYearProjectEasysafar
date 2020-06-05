import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, SegmentedControlIOSComponent, View } from "react-native";
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
        this.setState({
            spinner: true
        });
        
        this.setState({
            spinner: false
        });
        this.getDirections();
    }


    render() {
        const { startingLat, startingLong } = this.state;

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


