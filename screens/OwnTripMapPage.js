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
            query:""



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
        var PlacesSelected =  await AsyncStorage.getItem('PlacesSelected');
        let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
        let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');

        var PlacesArray = PlacesSelected.split(',');
        let finalstring="";
        for(var i=0;i<PlacesArray.length;i++)
        {
            let string = "place_id:"+PlacesArray[i]+"|";
            finalstring = finalstring+string;
        }

        console.warn(finalstring)
        this.setState({
            spinner: false
        });
        this.setState({query:finalstring})
        this.getDirections();
    }

    TimeConversion(StartTime) {


        let hours = (StartTime.toString()).substring(0, 2);
        let minutes = (StartTime.toString()).substring(2, 4);
        let hours_seconds = parseInt(hours) * 60 * 60;
        let minutes_seconds = parseInt(minutes) * 60;
        return (hours_seconds + minutes_seconds);
    }

    async getPlaces(departurePlaceID1) {

        //Destination ID
        let destinationPlaceID1 =  await  AsyncStorage.getItem('destinationPlaceID');

        //Start Time in seconds
        let StartTime = await AsyncStorage.getItem('TripStartTime');
        let StartTripTime_seconds = this.TimeConversion(StartTime);

        //End Time in seconds
        let EndTime = await AsyncStorage.getItem('TripEndTime');
        let EndTripTime_seconds = this.TimeConversion(EndTime);

        let i = 1;

        //Max for rating
        var max = -1000;

        const markers = [];

        //API for place details of starting location
        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry,name&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
            .then(res => res.json())

            .then(async api1 => {

                //Longitute and Latitude of starting location 
                let startingLatitude = api1.result.geometry.location.lat;
                let startingLongitude = api1.result.geometry.location.lng;

                const marketObj = {};

                marketObj.place_id = api1.result.place_id;

                marketObj.name = api1.result.name;

                marketObj.marker = {
                    latitude: startingLatitude,
                    longitude: startingLongitude
                };
                this.state.places_nearby.push(marketObj);

                //API for place details of destination
                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + destinationPlaceID1 + `&fields=geometry,name&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                    .then(res => res.json())

                    .then(async api2 => {
                        //Longitute and Latitude of destnation 
                        let endingLatitude = api2.result.geometry.location.lat;
                        let endingLongitude = api2.result.geometry.location.lng;


                        const marketObj = {};

                        marketObj.place_id = api2.result.place_id;

                        marketObj.name = api2.result.name;

                        marketObj.marker = {
                            latitude: endingLatitude,
                            longitude: endingLongitude
                        };
                        this.state.places_nearby.push(marketObj);

                        //Haversine Distance from Starting Location to destination
                        const a = { latitude: startingLatitude, longitude: startingLongitude }
                        const b = { latitude: endingLatitude, longitude: endingLongitude }

                        let distanceStartToEnd = haversine(a, b); // 10026 (in meters)

                        //API for places nearby starting location
                        await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` + startingLatitude + `,` + startingLongitude + `&radius=5000&type=restaurant&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                            .then(res => res.json())

                            .then(async api3 => {

                                //LOOP for all nearby from starting
                                api3.results.map(async (element) => {

                                    if (await element.place_id == destinationPlaceID1) {
                                        console.warn("Hello I am equal");
                                    }
                                    else if (await element.place_id == await departurePlaceID1) {
                                        // console.warn("mana kara tha par phir bhe aya");
                                    }
                                    else {

                                        //Haversine Distance from Spot to destination
                                        const c = { latitude: element.geometry.location.lat, longitude: element.geometry.location.lng }
                                        const d = { latitude: endingLatitude, longitude: endingLongitude }

                                        let DistanceSpotToDestination = haversine(c, d);

                                        //Haversine Distance from Starting Location to Spot
                                        const e = { latitude: startingLatitude, longitude: startingLongitude }
                                        const f = { latitude: element.geometry.location.lat, longitude: element.geometry.location.lng }

                                        let DistanceStartToSpot = haversine(e, f);
                                        // console.warn(haversine(c, f)); 


                                        if (DistanceSpotToDestination < distanceStartToEnd && DistanceStartToSpot > 0) {

                                            await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + departurePlaceID1 + `&destinations=place_id:` + element.place_id + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                .then(res => res.json())

                                                .then(async api4 => {
                                                    //Time taken to reach from starting to spot 
                                                    let TravellingTime = api4.rows[0].elements[0].duration.value;

                                                    //TOTAL WHEN WE WILL REACH FROM STARTING TO SPOT
                                                    let TimeToReachSpot = StartTripTime_seconds + TravellingTime;

                                                    await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + element.place_id + `&fields=opening_hours,price_level,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                        .then(res => res.json())

                                                        .then(api5 => {

                                                            //Opening time of place
                                                            let OpenTime_place = this.TimeConversion(api5.result.opening_hours.periods[0].open.time);

                                                            //Closing Time of place
                                                            let CloseTime_place = this.TimeConversion(api5.result.opening_hours.periods[0].close.time);

                                                            if (CloseTime_place < 43200) {
                                                                CloseTime_place = CloseTime_place + 86400;
                                                            }

                                                            //Price level of place
                                                            let pricelevel = api5.result.price_level;

                                                            //Rating of place
                                                            let rating = api5.result.rating;

                                                            if (TimeToReachSpot >= OpenTime_place && TimeToReachSpot < CloseTime_place - 1800) {
                                                                if (pricelevel == undefined || pricelevel == 3) {

                                                                    api3.results.map((element1) => {
                                                                        if (element1.place_id == element.place_id) {
                                                                            if (element1.rating > max) {
                                                                                max = element1.rating;
                                                                            }
                                                                        }
                                                                    });

                                                                    if (rating == max) {

                                                                        while (i == 1) {

                                                                            const marketObj = {};
                                                                            marketObj.id = element.id;
                                                                            marketObj.place_id = element.place_id;
                                                                            this.setState({ placeid: marketObj.id });
                                                                            marketObj.name = element.name;
                                                                            marketObj.photos = element.photos;
                                                                            marketObj.rating = element.rating;
                                                                            marketObj.vicinity = element.vicinity;
                                                                            marketObj.marker = {
                                                                                latitude: element.geometry.location.lat,
                                                                                longitude: element.geometry.location.lng
                                                                            };

                                                                            markers.push(element.name);

                                                                            this.state.places_nearby.push(marketObj);

                                                                            i = i + 1;
                                                                            let FinalPlaceID = (element.place_id).toString();
                                                                            AsyncStorage.setItem('FinalPlace', FinalPlaceID);
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                        })
                                                        .catch(async api5error => {
                                                            // console.warn("api5 error: "+  api5error);
                                                            OpenTime_place = 43200;
                                                            CloseTime_place = 86400;
                                                        });

                                                })
                                                .catch(async api4error => {
                                                    // console.warn(error);
                                                });


                                        }
                                    }
                                })
                                    .catch(async api3looperror => {
                                        // console.warn(error);
                                    });
                            })
                            .catch(async api3error => {
                                // console.warn(error);
                            });

                    })
                    .catch(async api2error => {
                        // console.warn(error);
                    });
            })
            .catch(async api1error => {
                // console.warn(error);
            });

        let FinalPlaceID = await AsyncStorage.getItem('FinalPlace');
        return FinalPlaceID;
    }



    async getDirections() {
        const { startingLat, startingLong, places_nearby, query } = this.state;
        // console.warn(query);

        try {
            let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
            let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
            this.setState({
                departurePlaceID: departurePlaceID1,
                destinationPlaceID: destinationPlaceID1
            })
            console.log(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + departurePlaceID1 + `&destination=place_id:` + destinationPlaceID1 + `&waypoints=optimize:true|`+query+`&alternatives=true&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + departurePlaceID1 + `&destination=place_id:` + destinationPlaceID1 + `&waypoints=optimize:true|`+query+`&alternatives=true&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`);

            const respJson = await resp.json();
            if (respJson.routes.length > 0) {
                const startingLong = respJson.routes[0].legs[0].start_location.lng;
                const startingLat = respJson.routes[0].legs[0].start_location.lat;
                const endingLat = respJson.routes[0].legs[0].end_location.lat;
                const endingLong = respJson.routes[0].legs[0].end_location.lng;

                // alert("Hello")


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
                        />
                    ))}


                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={2}
                        strokeColor="red" />

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


