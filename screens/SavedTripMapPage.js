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
import { Block, theme } from 'galio-framework';
import Polyline from '@mapbox/polyline';
import Spinner from 'react-native-loading-spinner-overlay';
import { GOOGLE_API_KEY } from "react-native-dotenv";

var distance = require('euclidean-distance')



const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3;
const CARD_WIDTH = CARD_HEIGHT - 100;

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
            Waypoints: "",
            StartTime: "",
            StartDate: "",
            LunchTime: "",
            DinnerTime: "",

            Day: 1,


        };
    }

    componentDidMount() {

        this.getDetails();
    }

    async getDetails() {
        let SavedTripID = await AsyncStorage.getItem('SavedTripID');
        let ip = await AsyncStorage.getItem('ip');

        await fetch('http://' + ip + '/getsavedtripsbyid?id=' + SavedTripID + ' ')
            .then(res => res.json())

            .then(res => {

                this.setState({
                    DepartureID: res[0].DepartureID,
                    DestinationID: res[0].DestinationID,
                    Waypoints: res[0].Waypoints,
                    StartTime: res[0].StartTime,
                    StartDate: res[0].StartDate,
                    LunchTime: res[0].LunchTime,
                    DinnerTime: res[0].DinnerTime,

                })

            });

        this.places();
    }

    TimeConversion(StartTime) {


        let hours = (StartTime.toString()).substring(0, 2);
        let minutes = (StartTime.toString()).substring(2, 4);
        let hours_seconds = parseInt(hours) * 60 * 60;
        let minutes_seconds = parseInt(minutes) * 60;
        return (hours_seconds + minutes_seconds);
    }

    async places() {
        this.setState({
            spinner: true
        });

        var DepartureID = this.state.DepartureID;
        var DestinationID = this.state.DestinationID;
        var Waypoints = this.state.Waypoints;
        var StartTime = this.state.StartTime;

        let day = this.state.Day;

        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + DepartureID + `&fields=rating,geometry,name,photos&key=` + GOOGLE_API_KEY + ``)
            .then(res => res.json())

            .then(async  starting => {

                let StartingTime_Seconds = this.TimeConversion(StartTime);

                let startingLatitude = starting.result.geometry.location.lat;
                let startingLongitude = starting.result.geometry.location.lng;

                const startingObj = {};

                startingObj.place_id = starting.result.place_id;

                if (starting.result.photos != undefined)
                    startingObj.image = starting.result.photos[0].photo_reference;

                let timee = StartingTime_Seconds;

                let Starthour = Math.floor(timee / 3600);
                if (Starthour >= 24)
                    Starthour = Starthour - 24;
                timee %= 3600;
                let Startminutes = Math.floor(timee / 60);

                startingObj.ReachTime = "-";

                startingObj.day = day;

                startingObj.EndTime = Starthour + ":" + Startminutes

                startingObj.name = starting.result.name;

                startingObj.StartTime = await AsyncStorage.getItem('TripStartTime');

                startingObj.rating = starting.result.rating;

                startingObj.marker = {
                    latitude: startingLatitude,
                    longitude: startingLongitude
                };

                this.state.places_nearby.push(startingObj);
            })
            .catch(async api5error => {
                this.setState({
                    spinner: false
                });
            });



        var waypointsArray = Waypoints.split("place_id:");
        var waypointsArray1 = waypointsArray.toString().split("|");

        let StartingTime_Seconds = this.TimeConversion(StartTime);
        var lastplace = waypointsArray1[waypointsArray1.length - 2]


        for (var i = 0; i < waypointsArray1.length; i++) {

            if (waypointsArray1[i].replace(",", "") != " ") {
                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + waypointsArray1[i].replace(",", "") + `&fields=rating,geometry,name,photos&key=` + GOOGLE_API_KEY + ``)
                    .then(res => res.json())

                    .then(async intermediate => {

                        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + DepartureID.replace(" ", "") + `&destinations=place_id:` + waypointsArray1[i].replace(",", "") + `&key=` + GOOGLE_API_KEY + ``)
                            .then(res => res.json())

                            .then(api4 => {

                                //Time taken to reach from starting to spot 
                                let TravellingTime = api4.rows[0].elements[0].duration.value;

                                let TimeToReachSpot = StartingTime_Seconds + TravellingTime + 600;

                                let time = TimeToReachSpot

                                let Reachinghour = Math.floor(time / 3600);
                                if (Reachinghour >= 24)
                                    Reachinghour = Reachinghour - 24;
                                time %= 3600;
                                let Reachingminutes = Math.floor(time / 60);

                                // console.warn("REACH TIME: " + Reachinghour + ":" + Reachingminutes)

                                let Endtime = TimeToReachSpot + 3000;


                                let Endhour = Math.floor(Endtime / 3600);
                                if (Endhour >= 24) {
                                    Endhour = Endhour - 24;
                                    if (dateflag == 0) {
                                        dateflag = 1;
                                        day = day + 1;
                                    }
                                    else {

                                    }
                                }
                                Endtime %= 3600;
                                let Endminutes = Math.floor(Endtime / 60);


                                let endingLatitude = intermediate.result.geometry.location.lat;
                                let endingLongitude = intermediate.result.geometry.location.lng;

                                const intermediateObj = {};

                                intermediateObj.place_id = intermediate.result.place_id;

                                intermediateObj.day = day;

                                if (intermediate.result.photos != undefined)
                                    intermediateObj.image = intermediate.result.photos[0].photo_reference;

                                intermediateObj.rating = intermediate.result.rating;

                                intermediateObj.ReachTime = Reachinghour + ":" + Reachingminutes

                                intermediateObj.EndTime = Endhour + ":" + Endminutes

                                intermediateObj.name = intermediate.result.name;

                                intermediateObj.marker = {
                                    latitude: endingLatitude,
                                    longitude: endingLongitude
                                };

                                this.state.places_nearby.push(intermediateObj);

                                StartingTime_Seconds = TimeToReachSpot + 3000;



                            })
                            .catch(async api5error => {
                                console.warn("Api 5 " + api5error)
                                this.setState({
                                    spinner: false
                                });
                            });

                    })
                    .catch(async api5error => {
                        this.setState({
                            spinner: false
                        });
                    });
            }

        }

        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + DestinationID.replace(" ", "") + `&fields=rating,geometry,name,photos&key=` + GOOGLE_API_KEY + ``)
            .then(res => res.json())

            .then(async destination => {

                fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?&origins=place_id:` + lastplace.replace(",", "") + `&destinations=place_id:` + DestinationID.replace(" ", "") + `&key=` + GOOGLE_API_KEY + ``)
                    .then(res => res.json())

                    .then(api4 => {

                        //Time taken to reach from starting to spot 
                        let TravellingTime = api4.rows[0].elements[0].duration.value;
                        //console.warn(TravellingTime)

                        let TimeToReachSpot = StartingTime_Seconds + TravellingTime + 600;

                        let hour = Math.floor(TimeToReachSpot / 3600);
                        if (hour >= 24) {
                            hour = hour - 24;
                            if (dateflag == 0) {
                                dateflag = 1;
                                day = day + 1;
                            }
                            else {

                            }
                        }
                        TimeToReachSpot %= 3600;
                        let minutes = Math.floor(TimeToReachSpot / 60);

                        //Longitute and Latitude of destnation 
                        let endingLatitude = destination.result.geometry.location.lat;
                        let endingLongitude = destination.result.geometry.location.lng;

                        const destinationObj = {};

                        destinationObj.place_id = destination.result.place_id;

                        destinationObj.image = destination.result.photos[0].photo_reference;

                        destinationObj.name = destination.result.name;

                        destinationObj.rating = destination.result.rating;

                        destinationObj.ReachTime = hour + ":" + minutes;

                        destinationObj.EndTime = "-";

                        destinationObj.day = day;

                        destinationObj.marker = {
                            latitude: endingLatitude,
                            longitude: endingLongitude
                        };

                        

                        this.state.places_nearby.push(destinationObj);
                    })
                    .catch(async api5error => {
                        this.setState({
                            spinner: false
                        });
                    });


            })
            .catch(async api5error => {
                this.setState({
                    spinner: false
                });
            });

        this.setState({
            spinner: false
        });

        this.getDirections();


    }

    async getDirections() {

        var DepartureID = this.state.DepartureID;
        var DestinationID = this.state.DestinationID;
        var Waypoints = this.state.Waypoints;

        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + DepartureID + `&destination=place_id:` + DestinationID.replace(" ", "") + `&waypoints=optimize:true|` + Waypoints.replace(" ", "") + `&alternatives=true&key=` + GOOGLE_API_KEY + ``);

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

                    style={styles.scrollView}
                    contentContainerStyle={styles.endPadding}
                >

                    {places_nearby.map((marker, i) => (

                        <View style={styles.card} key={i}>
                            <Text numberOfLines={1} style={styles.cardDescription}>Day: {marker.day}</Text>

                            <Image

                                style={styles.cardImage}
                                source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + marker.image + '&key=' + GOOGLE_API_KEY + '' }}
                                resizeMode="cover"
                            />
                            <View style={styles.textContent}>
                                <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                                <Text numberOfLines={1} style={styles.cardDescription}></Text>
                                <Text numberOfLines={1} style={styles.cardDescription}>Rating: {marker.rating}</Text>
                                <Text numberOfLines={1} style={styles.cardDescription}>ReachTime : {marker.ReachTime}</Text>
                                <Text numberOfLines={1} style={styles.cardDescription}>TimeSpent: {marker.EndTime}</Text>
                            </View>
                        </View>


                    ))}


                </Animated.ScrollView>


            </View >
        );
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: theme.SIZES.BASE * 4,
        marginBottom: theme.SIZES.BASE,
        justifyContent: "center",
        width: width,
        height: theme.SIZES.BASE * 4,
        shadowRadius: 0,
        shadowOpacity: 0
    },
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
        height: CARD_HEIGHT * 1.25,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 1.5,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 13,
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


