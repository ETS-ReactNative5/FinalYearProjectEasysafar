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

            places_nearby: [],



        };
    }

    componentDidMount() {
        this.function();


        this.getDirections();
    }

    async function() {
        let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
        
        let i = 3;
        var place = departurePlaceID1;
        // console.warn("didmount:" + place);

        // while (i < 6) {
            // console.warn(i);
            // let place1 = this.getPlaces(place)
            // i=i+1;
            let place1 = await this.getPlaces(place);
            await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + place1 + `&fields=name&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                .then(res => res.json())

                .then(res => {
                    console.warn("location #  : " + res.result.name)
                });
            // place = place1;
            // // console.warn(place);
            // i = i + 1;
        // }

        // }  
    }

    TimeConversion(StartTime) {
        let hours = (StartTime.toString()).substring(0, 2);
        let minutes = (StartTime.toString()).substring(2, 4);
        let hours_seconds = parseInt(hours) * 60 * 60;
        let minutes_seconds = parseInt(minutes) * 60;
        return (hours_seconds + minutes_seconds);
    }

    async getPlaces(departurePlaceID1) {
        try {
            console.warn("function: " + departurePlaceID1)
            // let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
            let destinationPlaceID1 =  AsyncStorage.getItem('destinationPlaceID');
            let StartTime = await AsyncStorage.getItem('TripStartTime'); //hours string "1300"
            let StartTripTime_seconds = this.TimeConversion(StartTime);
            let EndTime = await AsyncStorage.getItem('TripEndTime');
            let EndTripTime_seconds = this.TimeConversion(EndTime);



            // let final_place= "abc";

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

                             fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=` + startingLatitude + `,` + startingLongitude + `&radius=5000&type=restaurant&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                .then(res => res.json())

                                .then(res => {
                                    res.results.map((element) => {
                                         fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + destinationPlaceID1 + `&destinations=place_id:` + element.place_id + `&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                            .then(res => res.json())

                                            .then(res => {
                                                // if (element.place_id == destinationPlaceID1) {
                                                //     return (element.place_id).toString();
                                                //     // break;
                                                // }

                                                let distance = res.rows[0].elements[0].distance.value;
                                                let duration = res.rows[0].elements[0].duration.value; //seconds 14100

                                                if (distance > originaldistance) {

                                                }
                                                else {
                                                      fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + element.place_id + `&fields=opening_hours,price_level,rating&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                                                        .then(res => res.json())

                                                        .then(res => {

                                                            let OpenTime_place = res.result.opening_hours.periods[0].open.time;
                                                            let CloseTime_place = res.result.opening_hours.periods[0].close.time;
                                                            let pricelevel = res.result.price_level;
                                                            let rating = res.result.rating;


                                                            let max = -1000;

                                                            let OpenTime_place_seconds = this.TimeConversion(OpenTime_place);

                                                            let CloseTime_place_seconds = this.TimeConversion(CloseTime_place);
                                                            if (CloseTime_place_seconds < 43200) {
                                                                CloseTime_place_seconds = CloseTime_place_seconds + 86400;
                                                            }

                                                            let Time_StartToSpot = StartTripTime_seconds + duration;

                                                            if (Time_StartToSpot < CloseTime_place_seconds - 1800 && Time_StartToSpot >= OpenTime_place_seconds) {
                                                                if (pricelevel == undefined || pricelevel == 2) {
                                                                    // console.warn(element.name);
                                                                    // console.warn(element.place_id);
                                                                    if (rating > max) {
                                                                        max = rating;
                                                                    }

                                                                    if (rating == max) {
                                                                        // this.setState({final_place: element.name})
                                                                        // final_place = element.name;
                                                                        const marketObj = {};
                                                                        marketObj.id = element.id;
                                                                        marketObj.place_id = element.place_id;
                                                                        // this.setState({ placeid: marketObj.id });
                                                                        marketObj.name = element.name;
                                                                        // marketObj.photos = element.photos;
                                                                        // marketObj.rating = element.rating;
                                                                        marketObj.vicinity = element.vicinity;
                                                                        marketObj.marker = {
                                                                            latitude: element.geometry.location.lat,
                                                                            longitude: element.geometry.location.lng
                                                                        };

                                                                        markers.push(marketObj);
                                                                        let name = (element.place_id).toString();
                                                                        AsyncStorage.setItem('FinalPlace', name);
                                                                        // return name;
                                                                    }

                                                                }
                                                                else {

                                                                }

                                                            }
                                                            else {
                                                            }
                                                        });
                                                }
                                            });
                                    });
                                    this.setState({ places_nearby: markers });
                                });
                        });

                });
            // console.warn(final_place);
            // console.warn(
            let final_place = await AsyncStorage.getItem('FinalPlace');
            return final_place;
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


