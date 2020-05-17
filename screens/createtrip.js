import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import React, { Component } from "react";
import { Block, Text, theme } from 'galio-framework';
const { width, } = Dimensions.get("screen");
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import DatePicker from 'react-native-datepicker';
import { Button } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';

class createtrip extends React.Component {

  componentDidMount() {
    AsyncStorage.removeItem('destinationPlaceID');
    AsyncStorage.removeItem('departurePlaceID');
    AsyncStorage.removeItem('TripStartTime');
    AsyncStorage.removeItem('TripEndTime');
    this.setState({
      TypesSelected: "",
      button1status: false,
      button2status: false,
      button3status: false,
      button4status: false,
      button5status: false,
      button6status: false,
      button7status: false,
      button8status: false,

      button1opacity: 1,
      button2opacity: 1,
      button3opacity: 1,
      button4opacity: 1,
      button5opacity: 1,
      button6opacity: 1,
      button7opacity: 1,
      button8opacity: 1,
    })
  }

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
      date: new Date(),
      lunchTime: "03:00",
      dinnerTime: "09:00",
      startTime: "12:00",
      departurePlaceID: "",
      destinationPlaceID: "",
      errors: "",
      destination: "",
      predictions: [],
      showAMPM: false,

      button1status: false,
      button2status: false,
      button3status: false,
      button4status: false,
      button5status: false,
      button6status: false,
      button7status: false,
      button8status: false,

      button1opacity: 1,
      button2opacity: 1,
      button3opacity: 1,
      button4opacity: 1,
      button5opacity: 1,
      button6opacity: 1,
      button7opacity: 1,
      button8opacity: 1,

      opacity: 1,

      TypesSelected: "",

      TypeError: "",
      DeparturePlace: "",
      DestinationPlace: "",

      Error: ""

    };
  }

  state = {
    location: null,
    errorMessage: null,
  };

  render() {
    var Types = "";
    return (

      <Block style={{ flex: 1 }}>

        <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 1 }}>

          <GooglePlacesAutocomplete
            placeholder="Departure Location"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            listViewDisplayed="true"
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {

              AsyncStorage.setItem('departurePlaceID', details.place_id);


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
                flex: 1
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

        {/* Start Time and Date */}
        <Block style={{ flexDirection: 'row', width: width }}>

          <Block style={{ marginLeft: 0, marginRight: 10, flexDirection: 'column', paddingTop: theme.SIZES.BASE * 1 }}>

            <Block style={{ marginLeft: theme.SIZES.BASE * 2 }}>
              <Text>Start Time: </Text>
            </Block>

            <Block width={width * 0.5} style={{ marginLeft: theme.SIZES.BASE * 2, justifyContent: 'center', paddingTop: theme.SIZES.BASE }}>
              <DatePicker
                style={{ width: 120 }}
                date={this.state.startTime} //initial date from state
                mode="time" //The enum of date, datetime and time
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onDateChange={startTime => {
                  alert(startTime)
                  this.setState({ startTime: startTime });
                }}
              />
            </Block>

          </Block>

          <Block style={{ marginLeft: 0, marginRight: 10, flexDirection: 'column', paddingTop: theme.SIZES.BASE * 1 }}>

            <Block>
              <Text>Start Date: </Text>
            </Block>

            <Block width={width * 0.5} style={{ justifyContent: 'center', paddingTop: theme.SIZES.BASE }}>
              <DatePicker
                style={{ width: 120 }}
                date={this.state.date} //initial date from state
                mode="date" //The enum of date, datetime and time
                placeholder="select date"
                format="DD-MM-YYYY"
                minDate="05-07-2020"
                maxDate="01-01-2023"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onDateChange={date => {
                  alert(date)
                  this.setState({ date: date });
                }}
              />
            </Block>
          </Block>

        </Block>

        <Block style={{ flexDirection: 'row', paddingTop: theme.SIZES.BASE * 2 }}>
          <GooglePlacesAutocomplete
            placeholder="Destination Location"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            listViewDisplayed="true"
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {

              AsyncStorage.setItem('destinationPlaceID', details.place_id);


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
                flex: 1
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

        {/* Lunch and Dinner Time */}
        <Block style={{ flexDirection: 'row', width: width }}>

          <Block style={{ marginLeft: 0, marginRight: 10, flexDirection: 'column', paddingTop: theme.SIZES.BASE * 1 }}>

            <Block style={{ marginLeft: theme.SIZES.BASE * 2 }}>
              <Text>Lunch Time:: </Text>
            </Block>

            <Block width={width * 0.5} style={{ marginLeft: theme.SIZES.BASE * 2, justifyContent: 'center', paddingTop: theme.SIZES.BASE }}>
              <DatePicker
                style={{ width: 120 }}
                date={this.state.lunchTime} //initial date from state
                mode="time" //The enum of date, datetime and time
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onDateChange={lunchTime => {
                  alert(lunchTime)
                  this.setState({ lunchTime: lunchTime });
                }}
              />
            </Block>

          </Block>

          <Block style={{ marginLeft: 0, marginRight: 10, flexDirection: 'column', paddingTop: theme.SIZES.BASE * 1 }}>

            <Block>
              <Text>Dinner Time: </Text>
            </Block>

            <Block width={width * 0.5} style={{ justifyContent: 'center', paddingTop: theme.SIZES.BASE }}>
              <DatePicker
                style={{ width: 120 }}
                date={this.state.dinnerTime} //initial date from state
                mode="time" //The enum of date, datetime and time
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onDateChange={dinnerTime => {
                  alert(dinnerTime)
                  this.setState({ dinnerTime: dinnerTime });
                }}
              />
            </Block>
          </Block>

        </Block>

        {/* Types */}
        <Block style={{ paddingTop: theme.SIZES.BASE, flexDirection: 'row', width: width }}>

          <Block style={{ opacity: this.state.button1opacity }}>
            <TouchableOpacity
              disabled={this.state.button1enable}
              style={styles.button1}

              onPress={() => {
                this.setState({
                  button1enable: true,
                  button1opacity: 0.5,
                  TypesSelected: this.state.TypesSelected + "amusement_park,"
                })

              }}
            >
              <Ionicons name="md-star" size={32} color="white" />
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Amusement</Text>
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Park</Text>
            </TouchableOpacity>
          </Block>

          <Block style={{ opacity: this.state.button2opacity }}>
            <TouchableOpacity
              disabled={this.state.button2enable}
              style={styles.button2}

              onPress={() => {
                this.setState({
                  button2enable: true,
                  button2opacity: 0.5,
                  TypesSelected: this.state.TypesSelected + "tourist_attraction,"
                })


              }}
            >
              <Ionicons name="ios-bed" size={32} color="white" />
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Tourist </Text>
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Attraction</Text>
            </TouchableOpacity>
          </Block>

          <Block style={{ opacity: this.state.button5opacity }}>
            <TouchableOpacity
              disabled={this.state.button5enable}
              style={styles.button5}

              onPress={() => {
                this.setState({
                  button5enable: true,
                  button5opacity: 0.5,
                  TypesSelected: this.state.TypesSelected + "movie_theater,"
                })

              }}
            >
              <Ionicons name="md-film" size={32} color="white" />
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Cinemas</Text>
            </TouchableOpacity>
          </Block>



        </Block>

        <Block style={{ flexDirection: 'row', width: width }}>



          <Block style={{ opacity: this.state.button6opacity }}>
            <TouchableOpacity
              disabled={this.state.button6enable}
              style={styles.button6}

              onPress={() => {
                this.setState({
                  button6enable: true,
                  button6opacity: 0.5,
                  TypesSelected: this.state.TypesSelected + "shopping_mall,"
                })

              }}
            >
              <FontAwesome name="shopping-cart" size={32} color="white" />
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Shopping</Text>
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Malls</Text>
            </TouchableOpacity>
          </Block>

          <Block style={{ opacity: this.state.button7opacity }}>
            <TouchableOpacity
              disabled={this.state.button7enable}
              style={styles.button7}

              onPress={() => {
                this.setState({
                  button7enable: true,
                  button7opacity: 0.5,
                  TypesSelected: this.state.TypesSelected + "art_gallery,"
                })

              }}
            >
              <FontAwesome name="shopping-bag" size={32} color="white" />
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Art</Text>
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Gallery</Text>
            </TouchableOpacity>
          </Block>

          <Block style={{ opacity: this.state.button8opacity }}>
            <TouchableOpacity
              disabled={this.state.button8enable}
              style={styles.button8}

              onPress={() => {

                this.setState({
                  button8enable: true,
                  button8opacity: 0.5,
                  TypesSelected: this.state.TypesSelected + "museum,"
                })
                // alert(this.state.TypesSelected);

              }}
            >
              <FontAwesome name="building" size={32} color="white" />
              <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Museums</Text>
            </TouchableOpacity>
          </Block>

        </Block>

        <Block style={styles.buttonContainer}>
          <Button
            icon={
              <Icon
                name="car"
                size={15}
                color="white"
              />
            }
            onPress={async () => {

              let destinationPlaceID1 = await AsyncStorage.getItem('destinationPlaceID');
              let departurePlaceID1 = await AsyncStorage.getItem('departurePlaceID');


              console.warn(destinationPlaceID1)
              console.warn(departurePlaceID1)

              if (this.state.TypesSelected === "" || departurePlaceID1 === null || destinationPlaceID1 === null) {
                // this.setState(() => ({ Error: "Required!" }));
                alert("All are required!");
              }

              else {
                var Stime = this.state.startTime.toString();
                AsyncStorage.setItem('TripStartTime', Stime.replace(':',''));
                AsyncStorage.setItem('OptiosnSelected', this.state.TypesSelected);
                AsyncStorage.setItem('TripStartDate', this.state.Date);
                AsyncStorage.setItem('LunchTime', this.state.lunchTime);
                AsyncStorage.setItem('DinnerTime', this.state.dinnerTime);
                this.props.navigation.navigate("TripMapPage");
              }

            }}
            type="solid"
            iconLeft
            textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
            title="  START TRIP "
          />
        </Block>

        {/* </Block> */}

        {/* </Card> */}


      </Block>
    );
  }

}

const styles = StyleSheet.create({
  error: {
    fontSize: 15,
    fontWeight: '500'
  },
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
    shadowOpacity: 0
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
  },
  button3: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
  },
  button4: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    // width: width - theme.SIZES.BASE * 15,
    width: width / 3,
    height: width / 3
  },
  button5: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
  },
  button6: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
  },
  button7: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
  },
  button8: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: width / 3
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