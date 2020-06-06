import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ListView } from 'react-native';
import { Block, theme } from 'galio-framework';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get("screen");
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Button } from 'react-native-elements';


export default class makeowntrip extends Component {

    componentDidMount(){
        AsyncStorage.removeItem('destinationPlaceID');
        AsyncStorage.removeItem('departurePlaceID');
    }

    render() {
        return (

            <View style={styles.container}>

                <Block style={{ flex: 0.8, paddingTop: height * 0.3, }}>

                    <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 1, width: width * 0.8 }}>

                        <GooglePlacesAutocomplete
                            placeholder="Departure"
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'search'}
                            listViewDisplayed="auto"
                            fetchDetails={true}
                            renderDescription={row => row.description}
                            onPress={(data, details = null) => {

                                AsyncStorage.setItem('departurePlaceID', details.place_id);



                            }}
                            getDefaultValue={() => {
                                return ''; // text input default value
                            }}
                            query={{

                                // key: 'AIzaSyBAWJq9ZYiVO7EXu7YjryOb0vFJQCEwFKQ',
                                language: 'en',

                            }}
                            styles={{
                                description: {
                                    fontWeight: 'bold',
                                    backgroundColor: "white",
                                    fontSize: 15,
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }}


                            nearbyPlacesAPI="GooglePlacesSearch"
                            GoogleReverseGeocodingQuery={
                                {

                                }
                            }
                            GooglePlacesSearchQuery={{

                                rankby: 'distance',
                                radius: 1000
                            }}
                            filterReverseGeocodingByTypes={[
                                'locality',
                                'administrative_area_level_3',
                            ]}

                            debounce={200}
                        />
                    </Block>

                    <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 2, width: width * 0.8 }}>

                        <GooglePlacesAutocomplete
                            placeholder="Destination"
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'search'}
                            listViewDisplayed="auto"
                            fetchDetails={true}
                            renderDescription={row => row.description}
                            onPress={(data, details = null) => {

                                AsyncStorage.setItem('destinationPlaceID', details.place_id);



                            }}
                            getDefaultValue={() => {
                                return ''; // text input default value
                            }}
                            query={{

                                // key: 'AIzaSyBAWJq9ZYiVO7EXu7YjryOb0vFJQCEwFKQ',
                                language: 'en',

                            }}
                            styles={{
                                description: {
                                    fontWeight: 'bold',
                                    backgroundColor: "white",
                                    fontSize: 15,
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }}


                            nearbyPlacesAPI="GooglePlacesSearch"
                            GoogleReverseGeocodingQuery={
                                {

                                }
                            }
                            GooglePlacesSearchQuery={{

                                rankby: 'distance',
                                radius: 1000
                            }}
                            filterReverseGeocodingByTypes={[
                                'locality',
                                'administrative_area_level_3',
                            ]}

                            debounce={200}
                        />
                    </Block>

                </Block>

                <Block style={{ flex: 0.2 }}>

                    <Block style={styles.buttonContainer}>
                        <Button
                            onPress={async () => {
                                let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
                                let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');
                                if (departurePlaceID1 === null || destinationPlaceID1 === null) {
                                    alert("All are required!");
                                }
                                else {
                                    this.props.navigation.navigate("makeowntripplaces");
                                }


                            }}
                            type="outline"
                            titleStyle={{ color: '#191970' }}
                            buttonStyle={{ borderWidth: 2, borderColor: '#191970', }}
                            iconLeft
                            textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
                            title=" PROCEED "
                        />

                    </Block>
                </Block>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    group: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 0.25
    },
    buttonContainer: {
        paddingHorizontal: theme.SIZES.BASE * 4,
        marginBottom: theme.SIZES.BASE,
        justifyContent: "center",
        width: width,
        height: theme.SIZES.BASE * 4,
        shadowRadius: 0,
        shadowOpacity: 0,
        flex: 0.15,
        justifyContent: 'center',
    },
    barContainer: {
        position: 'absolute',
        zIndex: 2,
        top: 40,
        flexDirection: 'row',
    },
    track: {
        backgroundColor: '#ccc',
        overflow: 'hidden',
        height: 2,
    },
    bar: {
        backgroundColor: '#5294d6',
        height: 2,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        backgroundColor: '#eee',
    },
    formView: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 8,
    },
    inputForm: {
        backgroundColor: '#fff',
        width: 320,
        height: 40,
        padding: 8,
        marginBottom: 8,
    },
    todoItem: {
        alignItems: 'center',
        padding: 8,
        width: 320,
        borderBottomWidth: 1.5,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
    },
    todoText: {
        flex: 1,
    },
});
