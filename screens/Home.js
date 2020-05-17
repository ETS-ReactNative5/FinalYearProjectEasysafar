import React from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Block, theme, Text } from "galio-framework";
import MapView from './MapView';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("screen");

class Home extends React.Component {
  constructor(props) {
    super(props);
    //Initial State
    this.state = {
      placeType: "a",
      errors: "",
      destination: "",
      predictions: []
    };
  }

  state = {
    location: null,
    errorMessage: null,
  };

  async onChangeDestination(destination) {
    this.setState({ destination });

    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc&input=${destination}&location=${this.state.latitude},${this.state.latitude}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      // console.log(result);
      // console.log(json);
      this.setState({
        predictions: json.predictions
      });
    }
    catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {

  }



  getItem = (name, text, color, type, placeType) => (


    <Block style={styles1.group}>

      {/* <TouchableOpacity  >
        <Block style={{ alignContent: 'center', }}>
          <FontAwesome.Button style={{ width: 70, margin: 0, height: theme.SIZES.BASE * 3.5 }} name={name} color="white" backgroundColor={color} round size={size} type={type}
            onPress={() => {
              this.setState({ visible: true });
              AsyncStorage.setItem('type', placeType);
              this.props.navigation.navigate("MapPage");

            }}></FontAwesome.Button>
          <Text style={{ width: 70 }}>{text}</Text>

        </Block>

      </TouchableOpacity> */}



    </Block>

  );

  render() {

    return (

      <Block style={styles.home}>

        <Block style={{ flexDirection: 'row', paddingTop: 0 }}>

          <GooglePlacesAutocomplete
            placeholder="Search"
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
                  AsyncStorage.setItem('placeid', details.place_id);
                  this.props.navigation.navigate('Details');
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


        <MapView />

        {/* <Block>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} scrollEventThrottle={10} >
            <Block style={styles1.iconContainer}>
              {this.getItem("image", "Amusement Park", 40, "#f50", "font-awesome", "amusement_park")}
              {this.getItem("camera-retro", "Cinema", 40, "#031068", "font-awesome", "movie_theater")}
              {this.getItem("fire", "Park", 40, "#f50", "font-awesome", "gas_station")}
              {this.getItem("shopping-bag", "Clothing Store", 40, "#031068", "font-awesome", "clothing_store")}
              {this.getItem("cutlery", "Restaurant", 40, "#f50", "font-awesome", "restaurant")}
              {this.getItem("shopping-cart", "Mall", 40, "#031068", "font-awesome", "shopping_mall")}
              {this.getItem("star", "Tourist Attraction", 40, "#f50", "font-awesome", "tourist_attraction")}
              {this.getItem("bank", "Bank", 40, "#031068", "font-awesome", "bank")}
            </Block>
          </ScrollView>
        </Block> */}

        <Block style={{ flexDirection: 'column', width: width }}>

          <Block style={{ flexDirection: 'row', width: width }}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'park');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");

              }}
            >
              <Ionicons name="md-star" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Park</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'tourist_attraction');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <Ionicons name="ios-bed" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Tourist </Text>
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Attraction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button3}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'restaurant');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <Ionicons name="md-restaurant" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Eateries</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button4}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'bank');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <FontAwesome name="bank" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Banks</Text>
            </TouchableOpacity>

          </Block>

          <Block style={{ flexDirection: 'row', width: width }}>
            <TouchableOpacity
              style={styles.button5}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'movie_theater');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <Ionicons name="md-film" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Cinemas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button6}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'shopping_mall');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <FontAwesome name="shopping-cart" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Shopping</Text>
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Malls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button7}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'clothing_store');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <FontAwesome name="shopping-bag" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Clothing</Text>
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Store</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button8}
              onPress={() => {
                this.setState({ visible: true });
                AsyncStorage.setItem('type', 'museum');
                // alert(placeType);
                this.props.navigation.navigate("MapPage");
              }}
            >
              <FontAwesome name="building" size={32} color="white" />
              <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Museums</Text>
            </TouchableOpacity>
          </Block>

        </Block>

        <Block style={styles.buttonContainer}>
          <Button
            
            type="solid"
            iconLeft
            textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
            title=" CREATE TRIP "
            onPress={() =>
              this.props.navigation.navigate("createtrip")
            }
          />

        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    // padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 8
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8,
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8,
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8,
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
    width: width/4 ,
    height: theme.SIZES.BASE * 8,
  },
  input: {
    paddingTop: 10,
    paddingRight: 15,
    fontSize: 15,
    color: 'black',
    fontWeight: '500'
  },
  home: {
    flex: 1,
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

  FilterContainer: {
    flex: 0.25,
    justifyContent: 'flex-start',

  }
})

const styles1 = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center'
  },
  group: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  home: {
    width: width,
    height: theme.SIZES.BASE,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    width: width,
    height: theme.SIZES.BASE * 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer1: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 30,
    alignContent: "center",
  },
  loginButton: {
    backgroundColor: "#d5995d",
    color: "white"
  },
  suggestions: {
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 10,

  }
});

export default Home;
