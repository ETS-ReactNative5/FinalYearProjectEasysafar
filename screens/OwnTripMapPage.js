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
import { GOOGLE_API_KEY } from "react-native-dotenv";
var distance = require('euclidean-distance')
import { Block, theme } from 'galio-framework';
import Spinner from 'react-native-loading-spinner-overlay';
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3;
import { Button } from 'react-native-elements';
const CARD_WIDTH = CARD_HEIGHT - 100;

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
            departurename: "",
            destinationname: ""



        };
    }

    componentDidMount() {
        this.function();

    }

    async saveTrip() {
        let ip = await AsyncStorage.getItem('ip');
        let email = await AsyncStorage.getItem('Email');

        let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
        let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');

        let waypoints = this.state.query;

        this.setState({
            spinner: true
        });

        await fetch('http://' + ip + '/savetrip?Email=' + email + '&DepartureID=' + departurePlaceID1 + '&DestinationID=' + destinationPlaceID1 + ' &Waypoints=' + waypoints + ' &DepartureName=' + this.state.departurename + ' &DestinationName=' + this.state.destinationname + ' &TripStartDate=""&StartTime=""&LunchTime=""&DinnerTime=""&TripType=Self ')
            .then(users => {

                alert("Trip Saved!");

                this.setState({
                    spinner: false
                });
            })
            .catch(res => {
                this.setState({
                    spinner: false
                });
            });


    }


    async function() {


        var PlacesSelected = await AsyncStorage.getItem('PlacesSelected');
        

        var PlacesArray = PlacesSelected.split(',');
        let finalstring = "";
        for (var i = 0; i < PlacesArray.length; i++) {
            let string = "place_id:" + PlacesArray[i] + "|";
            finalstring = finalstring + string;
        }
        this.setState({ query: finalstring })


        //Destination ID
        let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');

        let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');

        console.warn(destinationPlaceID1);
        console.warn(departurePlaceID1);

        await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + departurePlaceID1 + `&fields=geometry,name,photos,rating&key=` + GOOGLE_API_KEY + ``)
            .then(res => res.json())

            .then(async  starting => {

                placesvisited = departurePlaceID1;

                let startingLatitude = starting.result.geometry.location.lat;
                let startingLongitude = starting.result.geometry.location.lng;

                

                const startingObj = {};

                startingObj.place_id = starting.result.place_id;

                if (starting.result.photos != undefined)
                    startingObj.image = starting.result.photos[0].photo_reference;


                startingObj.name = starting.result.name;
                this.setState({ departurename: starting.result.name })

                startingObj.rating = starting.result.rating;

                startingObj.marker = {
                    latitude: startingLatitude,
                    longitude: startingLongitude
                };

                this.state.places_nearby.push(startingObj);


                await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + destinationPlaceID1 + `&fields=geometry,name,photos,rating&key=` + GOOGLE_API_KEY + ``)
                    .then(res => res.json())

                    .then(async destination => {

                        //Longitute and Latitude of destnation 
                        let endingLatitude = destination.result.geometry.location.lat;
                        let endingLongitude = destination.result.geometry.location.lng;

                        const destinationObj = {};

                        destinationObj.place_id = destination.result.place_id;

                        if (destination.result.photos != undefined)
                            destinationObj.image = destination.result.photos[0].photo_reference;

                        destinationObj.name = destination.result.name;
                        this.setState({ destinationname: destination.result.name })

                        destinationObj.rating = destination.result.rating;

                        destinationObj.marker = {
                            latitude: endingLatitude,
                            longitude: endingLongitude
                        };

                        

                        for (var k = 0; k < PlacesArray.length; k++) {

                            await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=` + PlacesArray[k] + `&fields=geometry,name,photos,rating&key=` + GOOGLE_API_KEY + ``)
                                    .then(res => res.json())

                                    .then(async intermediate => {
                                        
                                        let intermediateLatitude = intermediate.result.geometry.location.lat;
                                        let intermediateLongitude = intermediate.result.geometry.location.lng;


                                        const intermediateObj = {};

                                        intermediateObj.place_id = intermediate.result.place_id;

                                        if (intermediate.result.photos != undefined)
                                            intermediateObj.image = intermediate.result.photos[0].photo_reference;
                                        else
                                            intermediateObj.image = "Image Not Available";

                                        intermediateObj.name = intermediate.result.name;

                                        intermediateObj.rating = intermediate.result.rating;

                                        intermediateObj.marker = {

                                            latitude: intermediateLatitude,
                                            longitude: intermediateLongitude

                                        };

                                        this.state.places_nearby.push(intermediateObj);

                                    });
                            
                        }

                        this.state.places_nearby.push(destinationObj);

                        this.setState({
                            spinner: false
                        });
                        
                        this.getDirections();
                    })
                    .catch(async api5error => {
                        console.warn("API ERROR " + api5error)
                        this.setState({
                            spinner: false
                        });
                    });
            })
            .catch(async api5error => {
                console.warn("API ERROR " + api5error)
                this.setState({
                    spinner: false
                });
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
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:` + departurePlaceID1 + `&destination=place_id:` + destinationPlaceID1 + `&waypoints=optimize:true|` + query + `&alternatives=true&key=` + GOOGLE_API_KEY + ``);

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
            <View style={{ flex: 1 }}>
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
                                <Image

                                    style={styles.cardImage}
                                    source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + marker.image + '&key=' + GOOGLE_API_KEY + '' }}
                                    resizeMode="cover"
                                />
                                <View style={styles.textContent}>
                                    {/* <Text numberOfLines={1} style={styles.cardDescription}>{marker.image}</Text> */}
                                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                                    <Text numberOfLines={1} style={styles.cardDescription}></Text>
                                    <Text numberOfLines={1} style={styles.cardDescription}>Rating: {marker.rating}</Text>
                                  </View>
                            </View>




                        ))}


                    </Animated.ScrollView>



                </View >

                <View style={{ flex: 0.1 }}>
                    <Block style={styles.buttonContainer}>
                        <Button

                            onPress={async () => {

                                this.saveTrip();

                            }}
                            type="solid"
                            iconLeft
                            textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
                            title=" SAVE TRIP "
                        />
                    </Block>

                </View>

            </View>
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
        height: CARD_HEIGHT*0.75,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 2,
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

export default createtrip;