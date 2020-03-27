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
const { height, width } = Dimensions.get('screen');
import { Card } from 'react-native-elements';


class GuidePlaceResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            long: null,
            places: [],
            isLoading: false,
            placeType: "restaurant",
            type: "a",
            placeid: "a",
            placename: "",
            radius: ""
        };
    }
    componentDidMount() {

        this.displayData()

    }

    displayData = async () => {
        try {
            let name = await AsyncStorage.getItem('name');
            let guidetype = await AsyncStorage.getItem('guidetype');
            // alert(name);
            if (name == "Lahore, Punjab") {
                this.setState({
                    placename: name,
                    placeType: guidetype,
                    lat: 31.5204,
                    long: 74.3587,
                    radius: 20000,
                });
                this.getPlaces();
            }
            else if (name == "Hunza, Swat") {
                this.setState({
                    placename: name,
                    placeType: guidetype,
                    lat: 36.3167,
                    long: 74.6500,
                    radius: 5000,
                });
                this.getPlaces();
            }
            else if (name == "Abbottabad, KPK") {
                this.setState({
                    placename: name,
                    placeType: guidetype,
                    lat: 34.1688,
                    long: 73.2215,
                    radius: 5000,
                });
                this.getPlaces();
            }
            else if (name == "Kalam, Swat") {
                this.setState({
                    placename: name,
                    placeType: guidetype,
                    lat: 35.4902,
                    long: 72.5796,
                    radius: 5000,
                });
                this.getPlaces();
            }
            else if (name == "Arang Kel, Kashmir") {
                this.setState({
                    placename: name,
                    placeType: guidetype,
                    lat: 34.8051,
                    long: 74.3456,
                    radius: 5000,
                });
                this.getPlaces();
            }
            else if (name == "Mingora, Swat") {
                this.setState({
                    placename: name,
                    placeType: guidetype,
                    lat: 34.7717,
                    long: 72.3602,
                    radius: 5000,
                });
                this.getPlaces();
            }

        }
        catch (error) {
            alert(error)
        }
    }

    getPlacesUrl(lat, long, radius, type, apiKey) {

        const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
        const location = `location=${lat},${long}&radius=${radius}`;
        const typeData = `&types=${type}`;
        const api = `&key=${apiKey}`;
        return `${baseUrl}${location}${typeData}${api}`;
    }

    getPlaces() {
        const { lat, long, placeType, radius } = this.state;
        const markers = [];
        const url = this.getPlacesUrl(lat, long, radius, placeType, GOOGLE_API_KEY);
        fetch(url)
            .then(res => res.json())

            .then(res => {
                res.results.map((element, index) => {

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

                    markers.push(marketObj);
                });
                this.setState({ places: markers });
            });
    }

    render() {
        const { lat, long, places } = this.state;
        return (

            <View style={styles.container}>

                <View style={styles.mapView}>
                    <MapView
                        style={{
                            flex: 1
                        }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: lat,
                            longitude: long,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }}
                    >
                        {places.map((marker, i) => (
                            <MapView.Marker
                                key={i}
                                coordinate={{
                                    latitude: marker.marker.latitude,
                                    longitude: marker.marker.longitude
                                }}
                                title={marker.id}
                            />
                        ))}
                    </MapView>
                </View>
                <View style={styles.placeList}>
                    <PlaceList places={places} navigation={this.props.navigation} placeid={this.state.placeid} placeType={this.state.placeType} />
                </View>


            </View>
        );
    }
}

export default GuidePlaceResult;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    mapView: {
        flex: 1,
        justifyContent: "center",
        height: height / 3,
        width: width
    },
    placeList: {
        flex: 1,
        justifyContent: "center"
    }
});





import RenderStarReview from "./ReviewStars";

class PlaceList extends Component {

    render() {

        const { places, navigation, placeid, placeType } = this.props;
        const baseImage =
            "https://images.unsplash.com/photo-1552334405-4929565998d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80";
        return (
            <Container style={styles1.container2}>
                <Content>
                    {places.length <= 0 && (
                        <View style={styles1.loaderContainer}>
                            <ActivityIndicator size="large" />
                        </View>
                    )}
                    {places.length > 0 && (
                        <View style={styles.containerr}>
                            <Card title={placeType}>
                                <FlatList
                                    data={places}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ visible: true });
                                            AsyncStorage.setItem('placeid', item.place_id);
                                            this.props.navigation.navigate("Details");

                                        }

                                        }>
                                            <ListItem
                                                key={item.id}
                                                title={
                                                    <View style={styles1.rowDirection}>
                                                        <Text>{item.name}</Text>
                                                    </View>
                                                }
                                                subtitle={
                                                    item.rating && (
                                                        <View>
                                                            <View style={styles1.startReviewsContainer}>
                                                                <RenderStarReview stars={item.rating} />
                                                                <Text>{item.rating.toFixed(1)}</Text>
                                                            </View>
                                                            <View>
                                                                <Text>{item.vicinity}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                                leftAvatar={{
                                                    rounded: false,
                                                    size: "large",
                                                    source: item.photos && {
                                                        uri:
                                                            item.photos.length > 0
                                                                ? `https://maps.googleapis.com/maps/api/place/photo?photoreference=${item.photos[0].photo_reference}&sensor=false&maxheight=${item.photos[0].height}&maxwidth=${item.photos[0].width}&key=${GOOGLE_API_KEY}`
                                                                : baseImage
                                                    }
                                                }}
                                                bottomDivider
                                                chevron={{ color: "#e90000", size: 30 }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </Card>
                        </View>
                    )}
                </Content>
            </Container>
        );
    }
}


const styles1 = StyleSheet.create({
    containerr: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    container2: {
        flex: 1,
        justifyContent: "center"
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        color: "#575757",
        marginLeft: 20,
        marginTop: 10
    },
    mapView: {
        flex: 1,
        justifyContent: "center"
    },
    restaurantList: {
        flex: 1,
        justifyContent: "center"
    },
    chevron: {
        color: "#e90000"
    },
    rowDirection: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    startReviewsContainer: {
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center"
    }
});