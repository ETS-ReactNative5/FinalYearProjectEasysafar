import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, SegmentedControlIOSComponent, } from "react-native";
import { AsyncStorage } from 'react-native';
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

            startingLatMarker: 0,
            startingLongMarker: 0,
            endingLatMarker: 0,
            endingLongMarker: 0,

            places_nearby: []

        };
    }

    componentDidMount() {
        this.getPlaces();
        this.getDirections();
    }

    async getPlaces() {
        try {
            let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
            let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
            const { places_nearby } = this.state;
            const markers = [];

            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + departurePlaceID1 + `&destinations=place_id:` + destinationPlaceID1 + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                .then(res => res.json())

                .then(res => {
                    let originaldistance = res.rows[0].elements[0].distance.value;
                    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                        .then(res => res.json())

                        .then(res => {
                            let startingLatitude = res.result.geometry.location.lat;
                            let startingLongitude = res.result.geometry.location.lng;
                            fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` + startingLatitude + `,` + startingLongitude + `&radius=1000&type=restaurant&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                .then(res => res.json())

                                .then(res => {
                                    res.results.map((element) => {
                                        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + destinationPlaceID1 + `&destinations=place_id:` + element.place_id + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                            .then(res => res.json())

                                            .then(res => {
                                                let currentdistance = res.rows[0].elements[0].distance.value;

                                                if (currentdistance > originaldistance) {

                                                }
                                                else {
                                                    fetch(``)
                                                        .then(res => res.json())

                                                        .then(res => {
                                                            


                                                        });
                                                }


                                            });


                                    });
                                    this.setState({ places_nearby: markers });

                                });
                        });

                });
            return;
        } catch (error) {
            alert(error);
        }
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

            // const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + departurePlaceID1 + `&destination=place_id:` + destinationPlaceID1 + `&waypoints=optimize:true|30.1575%2C71.5249&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`);
            // const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=Adelaide,SA&destination=Connawarra,SA&waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`);

            const respJson = await resp.json();
            if (respJson.routes.length > 0) {
                const startingLong = respJson.routes[0].legs[0].start_location.lng;
                const startingLat = respJson.routes[0].legs[0].start_location.lat;
                const endingLat = respJson.routes[0].legs[0].end_location.lat;
                const endingLong = respJson.routes[0].legs[0].end_location.lng;


                this.setState({
                    startingLong: startingLong,
                    startingLat: startingLat,
                    endingLat: endingLat,
                    endingLong: endingLong,

                    startingLatMarker: startingLat,
                    startingLongMarker: startingLong,
                    endingLatMarker: endingLat,
                    endingLongMarker: endingLong

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
        const { startingLat, startingLong, places_nearby } = this.state;

        // alert(this.state.startingLong);
        return (



            <MapView style={styles.map} initialRegion={{
                latitude: startingLat,
                longitude: startingLong,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }}>

                {places_nearby.map((marker, i) => (

                    <MapView.Marker
                        key={i}
                        coordinate={{
                            latitude: marker.marker.latitude,
                            longitude: marker.marker.longitude
                        }}
                        title={marker.name}
                    />
                ))}

                <MapView.Marker

                    coordinate={{
                        latitude: this.state.startingLatMarker,
                        longitude: this.state.startingLongMarker,

                    }}


                />

                <MapView.Marker

                    coordinate={{
                        latitude: this.state.endingLatMarker,
                        longitude: this.state.endingLongMarker,

                    }}


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


