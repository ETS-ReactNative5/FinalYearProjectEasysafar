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

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;

const CARD_WIDTH = CARD_HEIGHT - 50;

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
            query: "",

            markers1: [],

            flag: 0,
            max: -100,



        };
    }

    componentDidMount() {
        this.function();


    }

    async function() {

        // this.setState({
        //     spinner: true
        // });

        //Destination ID
        let destinationPlaceID1 = "ChIJDZUT1dY9sz4RJniLuy58ltM"; //await AsyncStorage.getItem('destinationPlaceID'); 

        let departurePlaceID1 = "ChIJpe3UA-I4sz4R2HyQM4ea-pQ"; //await AsyncStorage.getItem('departurePlaceID'); 
        // var placesvisited = "";

        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry,name,photos,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
            .then(res => res.json())

            .then(async  starting => {

                placesvisited = departurePlaceID1;

                let startingLatitude = starting.result.geometry.location.lat;
                let startingLongitude = starting.result.geometry.location.lng;

                const startingObj = {};

                startingObj.place_id = starting.result.place_id;

                startingObj.image = starting.result.photos[0].photo_reference;

                startingObj.name = starting.result.name;

                startingObj.rating = starting.result.rating;

                startingObj.StartTime = await AsyncStorage.getItem('TripStartTime');

                startingObj.marker = {
                    latitude: startingLatitude,
                    longitude: startingLongitude
                };

                this.state.places_nearby.push(startingObj);


                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + destinationPlaceID1 + `&fields=geometry,name,photos,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                    .then(res => res.json())

                    .then(async destination => {

                        //Longitute and Latitude of destnation 
                        let endingLatitude = destination.result.geometry.location.lat;
                        let endingLongitude = destination.result.geometry.location.lng;

                        const destinationObj = {};

                        destinationObj.place_id = destination.result.place_id;

                        destinationObj.image = destination.result.photos[0].photo_reference;

                        destinationObj.name = destination.result.name;

                        destinationObj.rating = destination.result.rating;

                        destinationObj.marker = {
                            latitude: endingLatitude,
                            longitude: endingLongitude
                        };

                        //Haversine Distance from Starting Location to destination
                        const a = { latitude: startingLatitude, longitude: startingLongitude }
                        const b = { latitude: endingLatitude, longitude: endingLongitude }

                        let distanceStartToEnd = haversine(a, b);

                        var SpotToDestination = 100000;

                        var flag = false;

                        let finalstring = "";

                        let i = 0;
                        var place = departurePlaceID1;
                        var radius = 2000;

                        while (SpotToDestination > 1000) {
                            i = i + 1;

                            var place1 = await this.PickRestaurant(place, radius);

                            if (place1.length > 0) {

                                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + place1 + `&fields=geometry,name,photos,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                    .then(res => res.json())

                                    .then(async intermediate => {
                                        let intermediateLatitude = intermediate.result.geometry.location.lat;
                                        let intermediateLongitude = intermediate.result.geometry.location.lng;

                                        //Haversine Distance from Spot to destination
                                        const c = { latitude: intermediateLatitude, longitude: intermediateLongitude }
                                        const d = { latitude: endingLatitude, longitude: endingLongitude }

                                        SpotToDestination = haversine(c, d);

                                        console.warn(SpotToDestination + " " + intermediate.result.name)

                                        const intermediateObj = {};

                                        intermediateObj.place_id = intermediate.result.place_id;

                                        intermediateObj.image = intermediate.result.photos[0].photo_reference;
                                        //console.warn(intermediate.result.photos[0].photo_reference)
                                        intermediateObj.name = intermediate.result.name;

                                        intermediateObj.rating = intermediate.result.rating;

                                        intermediateObj.counter = i + 1;

                                        intermediateObj.marker = {

                                            latitude: intermediateLatitude,
                                            longitude: intermediateLongitude

                                        };

                                        this.state.places_nearby.push(intermediateObj);

                                        let string = "place_id:" + place1 + "|";
                                        finalstring = finalstring + string;

                                        place = place1;
                                        // i = i + 1;

                                    })
                                    .catch(async api5error => {

                                    });

                            }
                            else {
                                console.log("NULL " + place)
                                console.warn("NULL " + place)
                                radius = radius * 2;
                                place = place;

                            }


                        }

                        this.state.places_nearby.push(destinationObj);

                        // place = place1;


                        this.setState({
                            spinner: false
                        });
                        this.setState({ query: finalstring })
                        this.getDirections();
                    });
            });


    }

    TimeConversion(StartTime) {


        let hours = (StartTime.toString()).substring(0, 2);
        let minutes = (StartTime.toString()).substring(2, 4);
        let hours_seconds = parseInt(hours) * 60 * 60;
        let minutes_seconds = parseInt(minutes) * 60;
        return (hours_seconds + minutes_seconds);
    }

    async PickRestaurant(departurePlaceID1, radius) {

        var array = [];

        //Destination ID
        let destinationPlaceID1 = "ChIJDZUT1dY9sz4RJniLuy58ltM";  //await AsyncStorage.getItem('destinationPlaceID'); 

        //Start Time in seconds
        let StartTime = await AsyncStorage.getItem('TripStartTime');
        let StartTripTime_seconds = this.TimeConversion(StartTime);

        //End Time in seconds
        let EndTime = await AsyncStorage.getItem('TripEndTime');
        let EndTripTime_seconds = this.TimeConversion(EndTime);

        let i = 1;

        //Max for rating
        var max1 = 1.00;
        var maxIndex = 0;

        var PlaceID = "";
        var flag = 0;

        // await AsyncStorage.removeItem('placeratings');
        return new Promise(function (resolve, reject) {
            fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry,photos,name&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                .then(res => res.json())

                .then(api1 => {

                    //Longitute and Latitude of starting location 
                    let startingLatitude = api1.result.geometry.location.lat;
                    let startingLongitude = api1.result.geometry.location.lng;

                    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + destinationPlaceID1 + `&fields=geometry,name,photos&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                        .then(res => res.json())

                        .then(api2 => {
                            //Longitute and Latitude of destnation 
                            let endingLatitude = api2.result.geometry.location.lat;
                            let endingLongitude = api2.result.geometry.location.lng;


                            //Haversine Distance from Starting Location to destination
                            const a = { latitude: startingLatitude, longitude: startingLongitude }
                            const b = { latitude: endingLatitude, longitude: endingLongitude }

                            let distanceStartToEnd = haversine(a, b);

                            //API for places nearby starting location
                            fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` + startingLatitude + `,` + startingLongitude + `&radius=` + radius + `&type=restaurant&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                .then(res => res.json())

                                .then(async api3 => {

                                    //LOOP for all nearby from starting
                                    var j = 1

                                    api3.results.map((element, index) => {

                                        // if (await element.place_id.toString() != departurePlaceID1.toString()) {

                                        if (element.place_id == destinationPlaceID1) {
                                            console.warn("Hello I am equal");
                                        }
                                        else if (element.place_id == departurePlaceID1) {

                                        }
                                        else {
                                            const c = { latitude: element.geometry.location.lat, longitude: element.geometry.location.lng }
                                            const d = { latitude: endingLatitude, longitude: endingLongitude }

                                            let DistanceSpotToDestination = haversine(c, d);

                                            //Haversine Distance from Starting Location to Spot
                                            const e = { latitude: startingLatitude, longitude: startingLongitude }
                                            const f = { latitude: element.geometry.location.lat, longitude: element.geometry.location.lng }

                                            let DistanceStartToSpot = haversine(e, f);

                                            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + departurePlaceID1 + `&destinations=place_id:` + element.place_id + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                .then(res => res.json())

                                                .then(api4 => {
                                                    //Time taken to reach from starting to spot 
                                                    let TravellingTime = api4.rows[0].elements[0].duration.value;

                                                    //TOTAL WHEN WE WILL REACH FROM STARTING TO SPOT
                                                    let TimeToReachSpot = StartTripTime_seconds + TravellingTime;

                                                    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + element.place_id + `&fields=opening_hours,price_level,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                        .then(res => res.json())

                                                        .then(async api5 => {

                                                            j++;


                                                            if (DistanceSpotToDestination < distanceStartToEnd && DistanceStartToSpot > 1000) {
                                                                let rating = api5.result.rating;

                                                                if (api5.result.opening_hours != undefined) {
                                                                    let StartTime = await api5.result.opening_hours.periods[0].open.time;
                                                                    let Starthours = (StartTime.toString()).substring(0, 2);
                                                                    let Startminutes = (StartTime.toString()).substring(2, 4);
                                                                    let Starthours_seconds = parseInt(Starthours) * 60 * 60;
                                                                    let Startminutes_seconds = parseInt(Startminutes) * 60;
                                                                    let OpenTime_place = Starthours_seconds + Startminutes_seconds;

                                                                    let CloseTime = await api5.result.opening_hours.periods[0].open.time;
                                                                    let Closehours = (CloseTime.toString()).substring(0, 2);
                                                                    let Closeminutes = (CloseTime.toString()).substring(2, 4);
                                                                    let Closehours_seconds = parseInt(Closehours) * 60 * 60;
                                                                    let Closeminutes_seconds = parseInt(Closeminutes) * 60;
                                                                    let CloseTime_place = Closehours_seconds + Closeminutes_seconds;

                                                                    if (CloseTime_place < 43200) {
                                                                        CloseTime_place = CloseTime_place + 86400;
                                                                    }



                                                                    // if (TimeToReachSpot >= OpenTime_place && TimeToReachSpot < CloseTime_place - 1800) {
                                                                    if (rating > max1) {
                                                                        PlaceID = element.place_id;
                                                                    }
                                                                    // }

                                                                    if (api3.results.length == j) {
                                                                        resolve(PlaceID)
                                                                    }

                                                                }


                                                            }

                                                            else {

                                                                if (api3.results.length == j) {
                                                                    //console.warn(PlaceID);
                                                                    resolve(PlaceID)

                                                                }
                                                            }


                                                        })
                                                        .catch(async api5error => {
                                                            console.warn("API5 " + api5error)

                                                        });
                                                    //

                                                });


                                        }

                                    })


                                })

                        })

                })
        });

    }

    async PickSpot(departurePlaceID1, radius) {

        //Destination ID
        let destinationPlaceID1 = "ChIJDZUT1dY9sz4RJniLuy58ltM";  //await AsyncStorage.getItem('destinationPlaceID'); 

        //Start Time in seconds
        let StartTime = await AsyncStorage.getItem('TripStartTime');
        let StartTripTime_seconds = this.TimeConversion(StartTime);

        //End Time in seconds
        let EndTime = await AsyncStorage.getItem('TripEndTime');
        let EndTripTime_seconds = this.TimeConversion(EndTime);

        let i = 1;

        //Max for rating
        var max1 = 1.00;
        var maxIndex = 0;

        var PlaceID = "";
        var flag = 0;     

        return new Promise(function (resolve, reject) {
            fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry,photos,name&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                .then(res => res.json())

                .then(api1 => {

                    //Longitute and Latitude of starting location 
                    let startingLatitude = api1.result.geometry.location.lat;
                    let startingLongitude = api1.result.geometry.location.lng;

                    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + destinationPlaceID1 + `&fields=geometry,name,photos&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                        .then(res => res.json())

                        .then(api2 => {
                            //Longitute and Latitude of destnation 
                            let endingLatitude = api2.result.geometry.location.lat;
                            let endingLongitude = api2.result.geometry.location.lng;


                            //Haversine Distance from Starting Location to destination
                            const a = { latitude: startingLatitude, longitude: startingLongitude }
                            const b = { latitude: endingLatitude, longitude: endingLongitude }

                            let distanceStartToEnd = haversine(a, b);

                            //API for places nearby starting location
                            fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` + startingLatitude + `,` + startingLongitude + `&radius=` + radius + `&type=restaurant&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                .then(res => res.json())

                                .then(async api3 => {

                                    //LOOP for all nearby from starting
                                    var j = 1

                                    api3.results.map((element, index) => {

                                        // if (await element.place_id.toString() != departurePlaceID1.toString()) {

                                        if (element.place_id == destinationPlaceID1) {
                                            console.warn("Hello I am equal");
                                        }
                                        else if (element.place_id == departurePlaceID1) {

                                        }
                                        else {
                                            const c = { latitude: element.geometry.location.lat, longitude: element.geometry.location.lng }
                                            const d = { latitude: endingLatitude, longitude: endingLongitude }

                                            let DistanceSpotToDestination = haversine(c, d);

                                            //Haversine Distance from Starting Location to Spot
                                            const e = { latitude: startingLatitude, longitude: startingLongitude }
                                            const f = { latitude: element.geometry.location.lat, longitude: element.geometry.location.lng }

                                            let DistanceStartToSpot = haversine(e, f);

                                            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + departurePlaceID1 + `&destinations=place_id:` + element.place_id + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                .then(res => res.json())

                                                .then(api4 => {
                                                    //Time taken to reach from starting to spot 
                                                    let TravellingTime = api4.rows[0].elements[0].duration.value;

                                                    //TOTAL WHEN WE WILL REACH FROM STARTING TO SPOT
                                                    let TimeToReachSpot = StartTripTime_seconds + TravellingTime;

                                                    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + element.place_id + `&fields=opening_hours,price_level,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                        .then(res => res.json())

                                                        .then(async api5 => {

                                                            j++;


                                                            if (DistanceSpotToDestination < distanceStartToEnd && DistanceStartToSpot > 1000) {
                                                                let rating = api5.result.rating;

                                                                if (api5.result.opening_hours != undefined) {
                                                                    let StartTime = await api5.result.opening_hours.periods[0].open.time;
                                                                    let Starthours = (StartTime.toString()).substring(0, 2);
                                                                    let Startminutes = (StartTime.toString()).substring(2, 4);
                                                                    let Starthours_seconds = parseInt(Starthours) * 60 * 60;
                                                                    let Startminutes_seconds = parseInt(Startminutes) * 60;
                                                                    let OpenTime_place = Starthours_seconds + Startminutes_seconds;

                                                                    let CloseTime = await api5.result.opening_hours.periods[0].open.time;
                                                                    let Closehours = (CloseTime.toString()).substring(0, 2);
                                                                    let Closeminutes = (CloseTime.toString()).substring(2, 4);
                                                                    let Closehours_seconds = parseInt(Closehours) * 60 * 60;
                                                                    let Closeminutes_seconds = parseInt(Closeminutes) * 60;
                                                                    let CloseTime_place = Closehours_seconds + Closeminutes_seconds;

                                                                    if (CloseTime_place < 43200) {
                                                                        CloseTime_place = CloseTime_place + 86400;
                                                                    }



                                                                    // if (TimeToReachSpot >= OpenTime_place && TimeToReachSpot < CloseTime_place - 1800) {
                                                                    if (rating > max1) {
                                                                        PlaceID = element.place_id;
                                                                    }
                                                                    // }

                                                                    if (api3.results.length == j) {
                                                                        resolve(PlaceID)
                                                                    }

                                                                }


                                                            }

                                                            else {

                                                                if (api3.results.length == j) {
                                                                    //console.warn(PlaceID);
                                                                    resolve(PlaceID)

                                                                }
                                                            }


                                                        })
                                                        .catch(async api5error => {
                                                            console.warn("API5 " + api5error)

                                                        });
                                                    //

                                                });


                                        }

                                    })


                                })

                        })

                })
        });

    }


    async getDirections() {
        const { query } = this.state;

        try {
            let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
            let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
            this.setState({
                departurePlaceID: departurePlaceID1,
                destinationPlaceID: destinationPlaceID1
            })
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + departurePlaceID1 + `&destination=place_id:` + destinationPlaceID1 + `&waypoints=optimize:true|` + query + `&alternatives=true&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`);

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
            return;
        } catch (error) {
            alert(error);
        }
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
                                <Text numberOfLines={1} style={styles.cardDescription}>Rating: {marker.rating}</Text>
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

export default createtrip;


