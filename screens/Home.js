import React from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Block, theme, Text } from "galio-framework";
import MapView from './MapView';
import { Button } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { GOOGLE_API_KEY } from "react-native-dotenv";

const { width } = Dimensions.get("screen");

class Home extends React.Component {
  constructor(props) {
    super(props);
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

    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&input=${destination}&location=${this.state.latitude},${this.state.latitude}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions
      });
    }
    catch (err) {
      console.error(err);
    }
  }

  getItem = (name, text, color, type, placeType) => (
    <Block style={styles1.group}>
    </Block>
  );

  render() {
    return (
      <Block style={{flex:1}}>
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
              &key=${GOOGLE_API_KEY}`;
              fetch(baseUrl)
                .then(res => res.json())
                .then(res => {
                  AsyncStorage.setItem('placeid', details.place_id);
                  this.props.navigation.navigate('Details');
                });
            }}
            getDefaultValue={() => {
              return ''; 
            }}
            query={{
              key: GOOGLE_API_KEY,
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

        <Block style={{ flexDirection: 'row', width: width }}>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              this.setState({ visible: true });
              AsyncStorage.setItem('type', 'park');
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
              this.props.navigation.navigate("MapPage");
            }}
          >
            <FontAwesome name="building" size={32} color="white" />
            <Text style={{alignItems: 'center',justifyContent: 'center',color:"white"}}>Museums</Text>
          </TouchableOpacity>
        </Block>

        <Block style={styles.buttonContainer}>
          <Button
            buttonStyle={{borderWidth: 2, borderColor: '#191970', }}
            type="outline"
            iconLeft
            titleStyle={{color: '#191970'}}
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
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8,
    marginTop: 11,
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8,
    marginTop: 11
  },
  button3: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8,
    marginTop: 11
  },
  button4: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8,
    marginTop: 11
  },
  button5: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8
  },
  button6: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8
  },
  button7: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8
  },
  button8: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width/4 ,
    height: theme.SIZES.BASE * 4.5,
    borderRadius: 20,
    opacity: 0.8
  },
  buttonContainer: {
    paddingHorizontal: theme.SIZES.BASE * 4,
    justifyContent: "center",
    width: width,
    height: theme.SIZES.BASE * 4,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginTop: 0
  },
})

const styles1 = StyleSheet.create({
  group: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
  },
});

export default Home;
