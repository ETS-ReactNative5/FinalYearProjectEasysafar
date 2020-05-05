import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Button, ListView } from 'react-native';
import { Constants } from 'expo';
import { Block, theme } from 'galio-framework';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width, } = Dimensions.get("screen");

export default class makeowntrip extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            inputValue: '',
            dataSource: ds.cloneWithRows([]),
        };
        this._handleTextChange = this._handleTextChange.bind(this);
        this._handleDeleteButtonPress = this._handleDeleteButtonPress.bind(this);
    }


    _handleTextChange = (value) => {
        const inputValue = value;
        this.setState(() => ({
            inputValue,
        }));
    }
    

    _handleSendButtonPress = async () => {
        let inputValue = await AsyncStorage.getItem('PlaceID')
        if (inputValue == null) {
            return;
        }
        const textArray = this.state.dataSource._dataBlob.s1;
        textArray.push(inputValue);
        this.setState(() => ({
            dataSource: this.state.dataSource.cloneWithRows(textArray),
            inputValue: '',
            // AsyncStorage.
        }));
    };


    _handleDeleteButtonPress = (id) => {
        this.setState((a) => {
            const newItem = a.dataSource._dataBlob.s1.filter((item, i) => (parseInt(id) !== i));
            return {
                dataSource: this.state.dataSource.cloneWithRows(newItem),
            }
        });
    };



    render() {
        return (
            <View style={styles.container}>

                <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 1 }}>

                    <GooglePlacesAutocomplete
                        placeholder="Departure Location"
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed="auto"
                        fetchDetails={true}
                        renderDescription={row => row.description}
                        onPress={(data, details = null) => {
                            const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=` + details.place_id + `
&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`;
                            fetch(baseUrl)
                                .then(res => res.json())

                                .then(res => {
                                    // alert(details.place_id);
                                    AsyncStorage.setItem('departurePlaceID', details.place_id);
                                    // this.props.navigation.navigate('Details');
                                });


                        }}
                        getDefaultValue={() => {
                            return ''; // text input default value
                        }}
                        query={{

                            key: 'AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc',
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

                <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 1 }}>

                    <GooglePlacesAutocomplete
                        placeholder="Departure Location"
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed="auto"
                        fetchDetails={true}
                        renderDescription={row => row.description}
                        onPress={(data, details = null) => {
                            const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=` + details.place_id + `
&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`;
                            fetch(baseUrl)
                                .then(res => res.json())

                                .then(res => {
                                    // alert(details.place_id);
                                    AsyncStorage.setItem('destinationPlaceID', details.place_id);
                                    // this.props.navigation.navigate('Details');
                                });


                        }}
                        getDefaultValue={() => {
                            return ''; // text input default value
                        }}
                        query={{

                            key: 'AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc',
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


                <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 1 }}>

                    <GooglePlacesAutocomplete
                        placeholder="Departure Location"
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed="auto"
                        fetchDetails={true}
                        renderDescription={row => row.description}
                        onPress={(data, details = null) => {
                            const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=` + details.place_id + `
                    &key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`;
                            fetch(baseUrl)
                                .then(res => res.json())

                                .then(res => {
                                    // this._handleTextChange(details.place_id);
                                    // alert(details.place_id);
                                     AsyncStorage.setItem('PlaceID', details.place_id);
                                    // this.props.navigation.navigate('Details');
                                });


                        }}
                        getDefaultValue={() => {
                            return ''; // text input default value
                        }}
                        query={{

                            key: 'AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc',
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

                    <Button
                        title="Add"
                        onPress={this._handleSendButtonPress}
                    />
                </Block>

                <ListView
                    style={styles.listView}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData, sectionID, rowID) => {
                        const handleDelete = () => {
                            return this._handleDeleteButtonPress(rowID);
                        }
                        return (
                            <View style={styles.todoItem}>
                                <Text style={styles.todoText}>{rowData}</Text>
                                <Button
                                    title="Delete"
                                    onPress={handleDelete}
                                    style={styles.deleteButton}
                                />
                            </View>
                        );
                    }
                    }
                />

                <Block style={styles.buttonContainer}>
                    <Button
                        icon={
                            <Icon
                                name="car"
                                size={15}
                                color="white"
                            />
                        }
                        onPress={() => {
                            AsyncStorage.setItem('PlacesSelected', (this.state.dataSource._dataBlob.s1).toString() );
                            // alert( (this.state.dataSource._dataBlob.s1).toString() );
                            AsyncStorage.setItem('TripStartTime', '1200');
                            AsyncStorage.setItem('TripEndTime', '2200');
                            this.props.navigation.navigate("OwnTripMapPage");

                        }}
                        type="solid"
                        iconLeft
                        textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
                        title="  START TRIP "
                    />
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
        // border: '1 solid #333',
        flex: 1,
        flexDirection: 'row',
    },
    todoText: {
        flex: 1,
    },
});
