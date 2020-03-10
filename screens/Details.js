import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Block, Button, Text, theme } from 'galio-framework';
import { Images, nowTheme, articles, tabs } from '../constants';
const { width, height } = Dimensions.get("screen");
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Animated, View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import FloatLabelTextInput from 'react-native-floating-label-text-input';
import { AsyncStorage } from 'react-native';
import { Card } from 'react-native-elements';

//Components

const FIXED_BAR_WIDTH = 280
const BAR_SPACE = 10

const images = [
  'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]

// import styles from "./styles";
class Components extends Component {

  numItems = images.length
  itemWidth = (FIXED_BAR_WIDTH / this.numItems) - ((this.numItems - 1) * BAR_SPACE)
  animVal = new Animated.Value(0)

  constructor(props) {
    super(props);
    //Initial State
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
      placeid: "a",
      image1url: "",
      image2url: "",
      image3url: "",
      image4url: "",
      image5url: "",
      icon: "",
      website: ""
    };
  }

  componentWillMount() {

    this.displayData()
  }

  displayData = async () => {
    try {
      let placeid = await AsyncStorage.getItem('placeid');

      this.setState({ placeid: placeid });
      this.getPlaces(placeid);
      // alert(placeid); 

    }
    catch (error) {
      alert(error)
    }
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      this.setState({ lat: lat, long: long });
      this.getPlaces();
    });
  }

  getPlacesUrl(place_id, apiKey) {
    // console.log(type);
    // alert(place_id);
    console.log(place_id);
    const baseUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_phone_number,address_component,adr_address,formatted_address,geometry,icon,name,permanently_closed,photo,place_id,plus_code,website,type,url,utc_offset,vicinity&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`;

    return `${baseUrl}`;
  }

  getPlaces(place) {

    // alert(place)
    // alert(placeidd);
    const { lat, long, placeType, placeid } = this.state;
    const markers = [];
    // alert(placeid);
    const url = this.getPlacesUrl(place, GOOGLE_API_KEY);
    fetch(url)
      .then(res => res.json())

      .then(res => {
        this.setState({ image1url: res.result.photos[0].photo_reference });
        this.setState({ image2url: res.result.photos[1].photo_reference });
        this.setState({ image3url: res.result.photos[2].photo_reference });
        this.setState({ image4url: res.result.photos[3].photo_reference });
        this.setState({ image5url: res.result.photos[4].photo_reference });
        this.setState({ name: res.result.name });
        this.setState({ rating: res.result.rating });
        this.setState({ type: res.result.types + ' ' });
        this.setState({ address: res.result.formatted_address });
        this.setState({ phone: res.result.formatted_phone_number });
        this.setState({ icon: res.result.icon });
        this.setState({ website: res.result.website});
      });
  }

  render() {
    const { name, rating, type, address, phone, placeid, image1url, image2url, image3url, image4url, image5url, icon, website } = this.state;

    let imageArray = []
    let barArray = []
    images.forEach((image, i) => {
      console.log(image, i)
      const thisImage = (
        <Image
          key={`image${i}`}
          source={{ uri: image }}
          style={{ width: width }}
        />


      )
      imageArray.push(thisImage)

      const scrollBarVal = this.animVal.interpolate({
        inputRange: [width * (i - 1), width * (i + 1)],
        outputRange: [-this.itemWidth, this.itemWidth],
        extrapolate: 'clamp',
      })

      const thisBar = (
        <View
          key={`bar${i}`}
          style={[
            styles.track,
            {
              width: this.itemWidth,
              marginLeft: i === 0 ? 0 : BAR_SPACE,
            },
          ]}
        >
          <Animated.View

            style={[
              styles.bar,
              {
                width: this.itemWidth,
                transform: [
                  { translateX: scrollBarVal },
                ],
              },
            ]}
          />
        </View>
      )
      barArray.push(thisBar)
    })

    return (

      <Block style={{ flex: 1 }}>
        <Block style={styles.group}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={10}
            pagingEnabled
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { x: this.animVal } } }]
              )
            }
          >
            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image1url + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image2url + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image3url + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image4url + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image5url + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
              style={{ width: width }}
            />
          </ScrollView>
          <Block
            style={styles.barContainer}
          >
            {barArray}
          </Block>
        </Block>

        <Block style={{ flex: 0.6, marginTop: theme.SIZES.BASE }}>
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}

          >
            <Block>
              <View style={styles.container}>
                <Card>
                  {/*react-native-elements Card*/}
                  <Text
                    h5
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginBottom: theme.SIZES.BASE / 2,
                      fontWeight: 'bold'
                    }}
                    color={nowTheme.COLORS.HEADER}
                  >
                    {name}
                  </Text>
                  <Image
                    
                    source={{ uri: icon }}
                  />
                  <Text
                    p
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginBottom: theme.SIZES.BASE / 2,
                      fontWeight: 'bold'
                    }}
                    color={nowTheme.COLORS.HEADER}
                  >
                    Rating:  {rating}
                  </Text>
                  <Text
                    p
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginBottom: theme.SIZES.BASE / 2,
                      fontWeight: 'bold'
                    }}
                    color={nowTheme.COLORS.HEADER}
                  >
                    Address:  {address} 
                    
                  </Text>
                  <Text
                    p
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginBottom: theme.SIZES.BASE / 2,
                      marginTop: '2.5%',
                      fontWeight: 'bold'
                    }}
                    color={nowTheme.COLORS.HEADER}
                  >
                    Type:  {type}
                  </Text>
                  <Text
                    p
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginBottom: theme.SIZES.BASE / 2,
                      marginTop: '2.5%',
                      fontWeight: 'bold'
                    }}
                    color={nowTheme.COLORS.HEADER}
                  >
                    Phone:  {phone}
                  </Text>
                  {/* <Image style={styles.inputIcon} source={require('../assets/phonee.png')} /> */}
                  <Text
                    p
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginBottom: theme.SIZES.BASE / 2,
                      marginTop: '2.5%',
                      fontWeight: 'bold'
                    }}
                    color={nowTheme.COLORS.HEADER}
                  >
                    Website:  {website}
                  </Text>
                </Card>
              </View>
            </Block>


           

            {/* <Block>
              <View style={styles.container}>
                <Card title="Local Modules">


                  <Block style={{ flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-around' }}>

                    <Block >
                      <TouchableOpacity>
                        <FontAwesome.Button
                          style={{ width: 70, margin: 0, height: theme.SIZES.BASE * 3.5 }}
                          name='phone'
                          color="blue"
                          backgroundColor='white'
                          round
                          size={40}
                        >

                        </FontAwesome.Button>
                      </TouchableOpacity>
                    </Block>
                    <Block>
                      <TouchableOpacity>
                        <FontAwesome.Button
                          style={{ width: 70, margin: 0, height: theme.SIZES.BASE * 3.5 }}
                          name='arrow-right'
                          color="blue"
                          backgroundColor='white'
                          round
                          size={40}
                          type='bar'
                        >

                        </FontAwesome.Button>
                      </TouchableOpacity>
                    </Block>

                  </Block>

                </Card>
              </View>
            </Block> */}


           







          </ScrollView>
        </Block>
      </Block>
    );
  }
}

export default Components;

const styles = StyleSheet.create({
  group: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4
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
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});