import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { AsyncStorage } from 'react-native';

import {
    FlatList,
    ActivityIndicator,
} from "react-native";
import { ListItem } from "react-native-elements";
import { Container, Content } from "native-base";
import { Card } from 'react-native-elements';
import Polyline from '@mapbox/polyline';

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

        };
    }

    componentDidMount() {
        this.getDirections();
    }

    async getDirections() {
        try {
            let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
            let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
            this.setState({
                departurePlaceID: departurePlaceID1,
                destinationPlaceID: destinationPlaceID1
            })
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + departurePlaceID1 + `&destination=place_id:` + destinationPlaceID1 + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`);
            const respJson = await resp.json();
            if (respJson.routes.length > 0) {
                const startingLong= respJson.routes[0].legs[0].start_location.lng;
                const startingLat= respJson.routes[0].legs[0].start_location.lat;
                
                const endingLat= respJson.routes[0].legs[0].end_location.lat;
                const endingLong= respJson.routes[0].legs[0].end_location.lng;
                this.setState({
                    startingLong:startingLong,
                    startingLat:startingLat,
                    endingLat:endingLat,
                    endingLong:endingLong
                })
                
               
                const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
                const coords = points.map((point, index) => {
                    return {
                        latitude: point[0],
                        longitude: point[1],
                    };
                });
                this.setState({ coords });
                // console.warn(coords)
            }
            return;
        } catch (error) {
            alert(error);
        }
    }



    render() {
        const { startingLat, startingLong } = this.state;
// alert(this.state.startingLong);
        return (
            
            <MapView style={styles.map} initialRegion={{
                latitude: startingLat,
                longitude: startingLong,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }}>

                <MapView.Marker

                    coordinate={{
                        latitude: 24.8607333,
                        longitude: 67.0011246,

                    }}
                // title={marker.id}
                />


                <MapView.Polyline
                    coordinates={this.state.coords}
                    strokeWidth={2}
                    strokeColor="red" />

            </MapView>
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
});

export default createtrip;


