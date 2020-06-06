import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ListView } from 'react-native';
import { Block, theme , Text} from 'galio-framework';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width, } = Dimensions.get("screen");
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Button } from 'react-native-elements';

export default class makeowntrip extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            inputValue: '',
            dataSource: ds.cloneWithRows([]),
            dataSource1: ds.cloneWithRows([]),
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
        let inputValue = await AsyncStorage.getItem('Placename')
        let inputvalue1 = await AsyncStorage.getItem('PlaceID')
        if (inputvalue1 == null) {
            return;
        }
        const textArray = this.state.dataSource._dataBlob.s1;
        textArray.push(inputValue);

        const textArray1 = this.state.dataSource1._dataBlob.s1;
        textArray1.push(inputvalue1);
        this.setState(() => ({
            dataSource: this.state.dataSource.cloneWithRows(textArray),
            dataSource1: this.state.dataSource1.cloneWithRows(textArray1),
            inputValue: '',
            inputvalue1:''
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
                    placeholder="Intermediate"
                    minLength={2}
                    autoFocus={false}
                    returnKeyType={'search'}
                    listViewDisplayed="auto"
                    fetchDetails={true}
                    renderDescription={row => row.description}
                    onPress={(data, details = null) => {
                       
                        AsyncStorage.setItem('PlaceID', details.place_id);
                        AsyncStorage.setItem('Placename', details.name);


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

                <Button
                    type="outline"
                    title="ADD"
                    titleStyle={{color: 'green'}}
                    buttonStyle={{borderWidth: 2, borderColor: 'green', }}
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
                                type="outline"
                                title="DELETE"
                                titleStyle={{color: 'red'}}
                                buttonStyle={{borderWidth: 2, borderColor: 'red', }}
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
                                color='#191970'
                            />
                        }
                        onPress={() => {
                            // console.warn((this.state.dataSource1._dataBlob.s1).toString())
                            AsyncStorage.setItem('PlacesSelected', (this.state.dataSource1._dataBlob.s1).toString() );
                            AsyncStorage.setItem('TripStartTime', '1200');
                            AsyncStorage.setItem('TripEndTime', '2200');
                            this.props.navigation.navigate("OwnTripMapPage");

                        }}
                        type="outline"
                        titleStyle={{color: '#191970'}}
                        buttonStyle={{borderWidth: 2, borderColor: '#191970', }}
                        iconLeft
                        textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
                        title="  MAKE TRIP "
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
        flex: 1,
        flexDirection: 'row',
    },
    todoText: {
        flex: 1,
    },
});
