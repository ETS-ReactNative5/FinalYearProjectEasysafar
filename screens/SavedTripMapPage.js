import React, { Component } from "react";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    Image,
    Dimensions,
} from "react-native";

import { AsyncStorage } from 'react-native';

import Polyline from '@mapbox/polyline';

import haversine from 'haversine-distance'

var distance = require('euclidean-distance')

import Spinner from 'react-native-loading-spinner-overlay';

import { Button } from 'react-native-elements';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;

const CARD_WIDTH = CARD_HEIGHT - 50;

class SavedTripMapPage extends Component {

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
            query: "",

            markers1: [],

            flag: 0,
            max: -100,


            DepartureID: "",
            DestinationID: "",
            Waypoints: ""



        };
    }

    componentDidMount() {


        this.getDetails();
    }

    async getDetails() {
        let SavedTripID = await AsyncStorage.getItem('SavedTripID');

        await fetch('http://192.168.0.100:3006/getsavedtripsbyid?id=' + SavedTripID + ' ')
            .then(res => res.json())

            .then(res => {
                //console.warn( res[0].DepartureID);
                this.setState({
                    DepartureID: res[0].DepartureID,
                    DestinationID: res[0].DestinationID,
                    Waypoints: res[0].Waypoints
                })

            });

        //this.getDirections();
        this.places();
    }

    async places() {
        this.setState({
            spinner: true
        });

        var DepartureID = this.state.DepartureID;
        var DestinationID = this.state.DestinationID;
        var Waypoints = this.state.Waypoints;

        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + DepartureID + `&fields=geometry,name,photos&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
            .then(res => res.json())

            .then(async  starting => {

                let startingLatitude = starting.result.geometry.location.lat;
                let startingLongitude = starting.result.geometry.location.lng;

                const startingObj = {};

                startingObj.place_id = starting.result.place_id;

                startingObj.image = starting.result.photos[0].photo_reference;

                startingObj.name = starting.result.name;

                startingObj.StartTime = await AsyncStorage.getItem('TripStartTime');

                startingObj.marker = {
                    latitude: startingLatitude,
                    longitude: startingLongitude
                };

                this.state.places_nearby.push(startingObj);
            });

        

        var waypointsArray = Waypoints.split("place_id:");
        var waypointsArray1 = waypointsArray.toString().split("|");
        // var waypointsArray = await waypointsArray.toString().split("|");

        // var waypointsArray = await waypointsArray.toString().split(",");

        for (var i = 0; i < waypointsArray1.length; i++) {
            console.warn(i);
            if(waypointsArray1[i].replace(",","")!="")
            {
                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=`+waypointsArray1[i].replace(",","")+`&fields=geometry,name,photos&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                .then(res => res.json())

                .then(async intermediate => {
                    console.warn(waypointsArray[i])
                    //Longitute and Latitude of destnation 
                    let endingLatitude = intermediate.result.geometry.location.lat;
                    let endingLongitude = intermediate.result.geometry.location.lng;

                    const destinationObj = {};

                    destinationObj.place_id = intermediate.result.place_id;

                    destinationObj.image = intermediate.result.photos[0].photo_reference;

                    destinationObj.name = intermediate.result.name;

                    destinationObj.marker = {
                        latitude: endingLatitude,
                        longitude: endingLongitude
                    };

                    this.state.places_nearby.push(destinationObj);

                });
            }
           
        }

        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + DestinationID + `&fields=geometry,name,photos&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
            .then(res => res.json())

            .then(async destination => {

                //Longitute and Latitude of destnation 
                let endingLatitude = destination.result.geometry.location.lat;
                let endingLongitude = destination.result.geometry.location.lng;

                const destinationObj = {};

                destinationObj.place_id = destination.result.place_id;

                destinationObj.image = destination.result.photos[0].photo_reference;

                destinationObj.name = destination.result.name;

                destinationObj.marker = {
                    latitude: endingLatitude,
                    longitude: endingLongitude
                };

                this.state.places_nearby.push(destinationObj);

            });

        this.setState({
            spinner: false
        });

        this.getDirections();


    }

    async getDirections() {

        console.warn(this.state.Waypoints)

        var DepartureID = this.state.DepartureID;
        var DestinationID = this.state.DestinationID;
        var Waypoints = this.state.Waypoints;

        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + DepartureID + `&destination=place_id:` + DestinationID + `&waypoints=optimize:true|` + Waypoints + `&alternatives=true&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`);

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

            })


            const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            const coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1],
                };
            });
            this.setState({ coords });

            const markers1 = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1],
                };
            });
            this.setState({ markers1 });

        }

    }

    // async savetrip() {
    //     let email = await AsyncStorage.getItem('Email');
    //     let destinationPlaceID1 = "ChIJDZUT1dY9sz4RJniLuy58ltM"; //await AsyncStorage.getItem('destinationPlaceID');
    //     let departurePlaceID1 = "ChIJpe3UA-I4sz4R2HyQM4ea-pQ"; //await AsyncStorage.getItem('departurePlaceID');

    //     this.setState({
    //         spinner: true
    //     });

    //     await fetch('http://192.168.0.100:3006/savetrip?Email=' + email + '&DepartureID=' + departurePlaceID1 + '&DestinationID=' + destinationPlaceID1 + '&Waypoints=' + this.state.query + ' ')
    //         .then(users => {

    //             alert("inserted");
    //             this.props.navigation.navigate("Home");
    //         })
    //         .catch(res => {

    //         });

    //     this.setState({
    //         spinner: false
    //     });
    // }

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

                    {places_nearby.map((marker, i) => (

                        <MapView.Marker
                            key={i}
                            coordinate={{
                                latitude: marker.marker.latitude,
                                longitude: marker.marker.longitude
                            }}
                            title={marker.name}
                        >

                        </MapView.Marker>
                    ))}

                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={2}
                        strokeColor="red" />

                </MapView>

                <Animated.ScrollView
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH}
                    // onScroll={Animated.event(
                    //   [
                    //     {
                    //       nativeEvent: {
                    //         contentOffset: {
                    //           x: this.animation,
                    //         },
                    //       },
                    //     },
                    //   ],
                    //   { useNativeDriver: true }
                    // )}
                    style={styles.scrollView}
                    contentContainerStyle={styles.endPadding}
                >

                    {places_nearby.map((marker, i) => (

                        <View style={styles.card} key={i}>
                            <Image

                                style={styles.cardImage}
                                source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + marker.image + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
                                resizeMode="cover"
                            />
                            <View style={styles.textContent}>
                                {/* <Text numberOfLines={1} style={styles.cardDescription}>{marker.image}</Text> */}
                                <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                                <Text numberOfLines={1} style={styles.cardDescription}>Counter: {marker.counter}</Text>
                            </View>
                        </View>


                    ))}


                </Animated.ScrollView>


            </View >
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

    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
});

export default SavedTripMapPage;


