import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, SegmentedControlIOSComponent, } from "react-native";
import { AsyncStorage } from 'react-native';
import Polyline from '@mapbox/polyline';
import haversine from 'haversine-distance'
var distance = require('euclidean-distance')

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
        let departurePlaceID1 = "ChIJpe3UA-I4sz4R2HyQM4ea-pQ" // await AsyncStorage.getItem('departurePlaceID');
        let i = 0;
        var place = departurePlaceID1;

        while (i < 6) {
            let place1 = await this.getPlaces(place);
            await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + place1 + `&fields=name,place_id&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                .then(res => res.json())

                .then(res => {
                    console.warn("location #" + i + ": " + res.result.name + " " + res.result.place_id)
                });
            place = place1;
            i = i + 1;
        }
        // console.warn(place1);
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
        let destinationPlaceID1 = "ChIJDZUT1dY9sz4RJniLuy58ltM" // await  AsyncStorage.getItem('destinationPlaceID');

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

        let count = 1;

        //API for place details of starting location
        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
            .then(res => res.json())

            .then(async api1 => {

                //Longitute and Latitude of starting location 
                let startingLatitude = api1.result.geometry.location.lat;
                let startingLongitude = api1.result.geometry.location.lng;

                //API for place details of destination
                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + destinationPlaceID1 + `&fields=geometry&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`)
                    .then(res => res.json())

                    .then(async api2 => {
                        //Longitute and Latitude of destnation 
                        let endingLatitude = api2.result.geometry.location.lat;
                        let endingLongitude = api2.result.geometry.location.lng;

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

                                    if (await element.place_id == await departurePlaceID1) {
                                        console.warn("mana kara tha par phir bhe aya");
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
                                        // console.warn("distance start to spot  "+DistanceStartToSpot);
                                        

                                        if (await DistanceSpotToDestination < distanceStartToEnd && DistanceStartToSpot>0) {

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
                                                                            // console.warn(element.name)
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
                                                                            
                                                                            if(marketObj!=null)
                                                                            {
                                                                                // console.warn(marketObj)
                                                                                // console.warn("hi i am not emoty")
                                                                                console.warn(element.name+" "+DistanceStartToSpot);
                                                                                this.state.places_nearby.push(marketObj);
                                                                                // console.warn(element.name+":"+this.state.places_nearby)
                                                                                // this.state.places_nearby.push(marketObj);
                                                                                // Object.assign(this.state.places_nearby,markers)
                                                                            }
                                                                            else
                                                                            {
                                                                            //     console.warn("hi i am not emoty")
                                                                            }
                                                                            
                                                                                

                                                                            i = i + 1;
                                                                            // console.warn(element.place_id)
                                                                            // return (element.place_id).toString();
                                                                            // this.setState({ places_nearby: markers });
                                                                            // console.warn("no hello" + DistanceStartToSpot)
                                                                            let FinalPlaceID = (element.place_id).toString();
                                                                            AsyncStorage.setItem('FinalPlace', FinalPlaceID);
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                        });

                                                });
                                        }
                                    }
                                });
                            });

                    });
            });

        let FinalPlaceID = await AsyncStorage.getItem('FinalPlace');
        return FinalPlaceID;
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
        // console.warn(places_nearby)

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


