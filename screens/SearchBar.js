import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'



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
          onPress={(data, details = null) => {
            const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=`+details.place_id+`
            &key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`;
            fetch(baseUrl)
              .then(res => res.json())

              .then(res => {
                alert(details.place_id);
                console.warn(details.place_id);
                
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
