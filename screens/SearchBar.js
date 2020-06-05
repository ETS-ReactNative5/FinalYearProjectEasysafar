import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_API_KEY } from "react-native-dotenv";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  async onLogin() {
    const { email, password } = this.state;
    this.props.navigation.navigate('Details');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} 
          autoFocus={false}
          returnKeyType={'search'} 
          listViewDisplayed="auto" 
          fetchDetails={true}
          renderDescription={row => row.description} 
          
          onPress={this.onLogin.bind(this)}
          getDefaultValue={() => {
            return ''; // text input default value
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
    backgroundColor:"white"
  },
  input: {
    color: 'black',
    fontWeight: '500',
    backgroundColor:"white",

  },
  home: {
    flex: 1
  },
})

export default SearchBar;
