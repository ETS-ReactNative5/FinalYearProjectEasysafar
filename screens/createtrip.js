import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import React, { Component } from "react";
import { Block, Text, theme } from 'galio-framework';
const { width, } = Dimensions.get("screen");
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import DatePicker from 'react-native-datepicker';
import { Button } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { Card, CardImage, CardTitle, CardAction, CardContent, CardButton } from 'react-native-cards';

class createtrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      long: null,
      places: [],
      isLoading: false,
      name: "",
      rating: "",
      type: "",
      address: "",
      phone: "",
      visible: false,
      navigation: 123,
      date: "15-05-2018",
      departurePlaceID: "",
      destinationPlaceID: "",
      errors: "",
      destination: "",
      predictions: [],
      showAMPM: false
    };
  }

  state = {
    location: null,
    errorMessage: null,
  };

  getItem = (name, text, size, color, type, placeType) => (
    <Block style={styles.group}>
      <TouchableOpacity>
        <Block style={{ flexDirection: 'column', alignContent: 'center', }}>
          <FontAwesome.Button style={{ width: 70, margin: 0, height: theme.SIZES.BASE * 3.5 }} name={name} color="white" backgroundColor={color} round size={size} type={type} onPress={() => { this.setState({ visible: true }) }}></FontAwesome.Button>
          <Text
          >{name}</Text>
        </Block>

      </TouchableOpacity>


    </Block>
  );

  render() {
    return (
      <Block style={{ flex: 1 }}>
        <Block style={{ flex: 0.6, flexDirection: 'column', paddingHorizontal: theme.SIZES.BASE }}>
          {/* <Card> */}
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
            <Block width={width * 0.8} style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: theme.SIZES.BASE * 0.5 }}>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date} //initial date from state
                mode="datetime" //The enum of date, datetime and time
                placeholder="select date"
                format="DD-MM-YYYY"
                minDate="01-01-2016"
                maxDate="01-01-2019"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                is24Hour={this.state.showAMPM}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={(date) => { this.setState({ date: date }) }}
              />
            </Block>
          {/* </Card> */}

          {/* <Card> */}
            <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 2 }}>
              <GooglePlacesAutocomplete
                placeholder="Destination Location"
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
                      AsyncStorage.setItem('destinationPlaceID', details.place_id);
                    });


                }}
                getDefaultValue={() => {
                  return '';
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
            <Block width={width * 0.8} style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: theme.SIZES.BASE * 0.5 }}>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date} //initial date from state
                mode="datetime" //The enum of date, datetime and time
                placeholder="select date"
                format="DD-MM-YYYY"
                minDate="01-01-2020"
                maxDate="01-01-2021"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                is24Hour={this.state.showAMPM}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={(date) => { this.setState({ date: date }) }}

              />
            </Block>
          {/* </Card> */}

          {/* <Card> */}
            <Block style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: theme.SIZES.BASE * 2 }}>
              <Text>Lunch Time: </Text>
              <DatePicker
                mode="time"
                is24Hour={this.state.showAMPM}
                style={{ width: 200 }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
              />
            </Block>

            <Block style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: theme.SIZES.BASE *1 }}>
              <Text>Dinner Time: </Text>
              <DatePicker
                mode="time"
                is24Hour={this.state.showAMPM}
                style={{ width: 200 }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
              />
            </Block>
          {/* </Card> */}
        </Block>

        {/* <Card> */}
          <Block style={styles.iconContainer}>
            {this.getItem("beer", "Beers", 40, "#f50", "font-awesome", "bar")}
            {this.getItem("bank", "Bank", 40, "#031068", "font-awesome", "bank")}
            {this.getItem("beer", "Beers", 40, "#f50", "font-awesome", "bar")}
            {this.getItem("bank", "Bank", 40, "#031068", "font-awesome", "bank")}
          </Block>
        {/* </Card> */}

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

              AsyncStorage.setItem('TripStartTime', '1700');
              AsyncStorage.setItem('TripEndTime', '2200');
              this.props.navigation.navigate("TripMapPage");

            }}
            type="solid"
            iconLeft
            textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
            title="  START TRIP "
          />
        </Block>
      </Block>
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
});

export default createtrip;