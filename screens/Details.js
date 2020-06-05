import React, { Component } from "react";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Block, Text, theme } from 'galio-framework';
const { width, height } = Dimensions.get("screen");
import { Animated, View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome } from '@expo/vector-icons';

const FIXED_BAR_WIDTH = 280
const BAR_SPACE = 10
const images = [
  'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]

class Components extends Component {
  numItems = images.length
  itemWidth = (FIXED_BAR_WIDTH / this.numItems) - ((this.numItems - 1) * BAR_SPACE)
  animVal = new Animated.Value(0)

  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      long: null,
      places: [],
      isLoading: false,
      name: "-",
      rating: "-",
      type: [],
      address: "-",
      phone: "-",
      placeid: "a",
      image1url: "-",
      image2url: "-",
      image3url: "-",
      image4url: "-",
      image5url: "-",
      website: "-",
      spinner: true,
      price_level: "-",
      opening_hours: "-",
      review: "-",
      open_now: false,
      review1author: "",
      review2author: "",
      review3author: "",
      review4author: "",
      review1text: "",
      review2text: "",
      review3text: "",
      review4text: "",
      userreview: "",
      userrating: "",
      review1time: "",
      review2time: "",
      review3time: "",
      review4time: "",
      all_reviews:[],
      reviews:[],
      heartcolor: "white"
    };
  }

  componentDidMount() {
    this.displayData()
    this.getReview()
  }

  async checksave(){
    this.setState({
      spinner: true
    });
    let ip = await AsyncStorage.getItem('ip');
    let placeid = await AsyncStorage.getItem('placeid');
    let email = await AsyncStorage.getItem('Email');

    await fetch('http://'+ip+'/checksaveplace?Email=' + email + '&PlaceID=' + placeid + ' ')
      .then(res => res.json())
      .then(res => {
        if(res==1){
          this.setState({heartcolor:"red"})
          this.setState({
            spinner: false
          });
        }
        else{
          this.setState({
            spinner: false
          });
        }
      })
      .catch(res => {
        this.setState({
          spinner: false
        });
      });
  }

  displayData = async () => {
    try {
      let placeid = await AsyncStorage.getItem('placeid');
      this.setState({ placeid: placeid });
      this.getPlaces(placeid);
      this.checksave()
    }
    catch (error) {
    }
  }

  getPlacesUrl(place_id) {
    console.warn(place_id);
    const baseUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJjRWbziM5sz4R_Ih_kRGS00Y&fields=name,rating,formatted_phone_number,formatted_address,geometry,name,photo,place_id,website,type,opening_hours,price_level,review&key=AIzaSyBAWJq9ZYiVO7EXu7YjryOb0vFJQCEwFKQ`;
    return `${baseUrl}`;
  }

  async getPlaces(place) {
    this.setState({
      spinner: true
    });

    fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id='+place+'&fields=name,rating,formatted_phone_number,formatted_address,geometry,name,photo,place_id,website,type,opening_hours,price_level,review&key=AIzaSyBTvY-Rl6mRLBKHED8JGAJwd56EmypdG7k')
      .then(res => res.json())
      .then(res => {
        console.warn(res)
        this.setState({ image1url: res.result.photos[0].photo_reference });
        this.setState({ image2url: res.result.photos[1].photo_reference });
        this.setState({ image3url: res.result.photos[2].photo_reference });
        this.setState({ image4url: res.result.photos[3].photo_reference });
        this.setState({ image5url: res.result.photos[4].photo_reference });
        this.setState({ name: res.result.name });
        this.setState({ rating: res.result.rating });
        this.setState({ type: res.result.types });
        this.setState({ address: res.result.formatted_address });

        if (res.result.formatted_phone_number == undefined) {
          this.setState({ phone: '-' });
        }
        else {
          this.setState({ phone: res.result.formatted_phone_number });
        }

        if (res.result.price_level == 0) {
          this.setState({ price_level: 'Free' });
        }
        else if (res.result.price_level == 1) {
          this.setState({ price_level: 'Inexpensive' });
        }
        else if (res.result.price_level == 2) {
          this.setState({ price_level: 'Moderate' });
        }
        else if (res.result.price_level == 3) {
          this.setState({ price_level: 'Expensive' });
        }
        else if (res.result.price_level == 4) {
          this.setState({ price_level: 'Very Expensive' });
        }
        else {
          this.setState({ price_level: '-' });
        }

        if (res.result.website == undefined) {
          this.setState({ website: '-' });
        }
        else {
          this.setState({ website: res.result.website });
        }

        if (res.result.opening_hours.weekday_text == undefined) {
          this.setState({ opening_hours: '-' });
        }
        else {
          this.setState({ opening_hours: res.result.opening_hours.weekday_text });
        }

        if (res.result.opening_hours.open_now == undefined) {
          this.setState({ open_now: '-' });
        }
        else if (res.result.opening_hours.open_now == false) {
          this.setState({ open_now: 'Closed' });
        }
        else {
          this.setState({ open_now: 'Open' });
        }

        this.setState({ review1author: res.result.reviews[0].author_name });
        this.setState({ review1text: res.result.reviews[0].text });
        this.setState({ review1time: res.result.reviews[0].relative_time_description });

        this.setState({ review2author: res.result.reviews[1].author_name });
        this.setState({ review2text: res.result.reviews[1].text });
        this.setState({ review2time: res.result.reviews[1].relative_time_description });

        this.setState({ review3author: res.result.reviews[2].author_name });
        this.setState({ review3text: res.result.reviews[2].text });
        this.setState({ review3time: res.result.reviews[2].relative_time_description });

        this.setState({ review4author: res.result.reviews[3].author_name });
        this.setState({ review4text: res.result.reviews[3].text });
        this.setState({ review4time: res.result.reviews[3].relative_time_description });

        this.setState({
          spinner: false
        });
      })
      .catch(error => {
        console.warn("1: " + error)
        this.setState({
          spinner: false
        });
      });
  }

  async getReview() {
    this.setState({
      spinner: true
    });
    let ip = await AsyncStorage.getItem('ip');
    let placeid = await AsyncStorage.getItem('placeid');
    let email = await AsyncStorage.getItem('Email');

    await fetch('http://'+ip+'/getreview?PlaceID=' + placeid + ' ')
    .then(res => res.json())
    .then(res => {
      res.map((element, index) => {
        // console.warn(res[0].Email)
        const reviewobj = {}
        reviewobj.email = res[0].Email;
        reviewobj.rating = res[0].Rating;
        reviewobj.review = res[0].Review;
        this.state.reviews.push(reviewobj);
      });
      this.setState({
        spinner: false
      });
    })
    .catch(res => {
      this.setState({
        spinner: false
      });
    });
  }

  async saveplace(name, image1url) {
    let placeid = await AsyncStorage.getItem('placeid');
    let email = await AsyncStorage.getItem('Email');
    let ip = await AsyncStorage.getItem('ip');

    this.setState({
      spinner: true
    });

    await fetch('http://'+ip+'/saveplace?PlaceName=' + name + '&Email=' + email + '&PlaceID=' + placeid + '&PlacePhoto=' + image1url + ' ')
      .then(users => {
        alert("Place Saved!");
        this.displayData();
        this.setState({
          spinner: false,
          heartcolor: "red"
        });
      })
      .catch(res => {
        this.setState({
          spinner: false
        });
      });
  }

  render() {
    const { name, rating, type, address, placeid, phone, image1url, image2url, image3url, image4url, image5url, website, price_level,
      opening_hours, open_now, review1author, review1text, review1time, review2author, review2text, review2time, review3author, review3text,
      review3time, review4author, review4text, review4time, userreview, userrating, reviews } = this.state;

    let imageArray = []
    let barArray = []

    images.forEach((image, i) => {
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
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image1url + '&key=' + GOOGLE_API_KEY  + '' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image2url + '&key=' + GOOGLE_API_KEY  + '' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image3url + '&key=' + GOOGLE_API_KEY  + '' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image4url + '&key=' + GOOGLE_API_KEY  + '' }}
              style={{ width: width }}
            />

            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + image5url + '&key=' + GOOGLE_API_KEY  + '' }}
              style={{ width: width }}
            />
          </ScrollView>
          <Block
            style={styles.barContainer}
          >
            {barArray}
          </Block>
        </Block>

        <Block style={{ flex: 0.65, marginTop: theme.SIZES.BASE }}>
          <View>
            <Spinner
              visible={this.state.spinner}
              textContent={'Gathering Details'}
              textStyle={styles.spinnerTextStyle}
            />
          </View>

          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}
          >
            <Block>
              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#191970' }]} >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{name}</Text>
                  <Block style={{ flexDirection: 'column' }}>
                    <TouchableOpacity
                      onPress={() => {
                        AsyncStorage.setItem('PlaceName', name);
                        this.props.navigation.navigate("addreview");
                      }}>
                      <Text style={{color: 'white'}}>Add Review</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.saveplace(name, image1url);
                      }}
                    >
                      <FontAwesome name="heart" size={32} color={this.state.heartcolor} />
                    </TouchableOpacity>
                  </Block>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.subTitleTop}> Rating: {rating} </Text>
                  <Text style={styles.subTitle}> Type: {type[0]} </Text>
                  <Text style={styles.subTitle}> Open Now: {open_now} </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#191970' }]} >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>Details</Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.subTitleTop}> Phone: {phone} </Text>
                  <Text style={styles.subTitle}> Website: {website} </Text>
                  <Text style={styles.subTitle}> Address: {address} </Text>
                  <Text style={styles.subTitle}> Price Level: {price_level} </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#191970' }]} >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>Opening Hours</Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.subTitleTop}> {opening_hours[0]} </Text>
                  <Text style={styles.subTitle}> {opening_hours[1]} </Text>
                  <Text style={styles.subTitle}> {opening_hours[2]} </Text>
                  <Text style={styles.subTitle}> {opening_hours[3]} </Text>
                  <Text style={styles.subTitle}> {opening_hours[4]} </Text>
                  <Text style={styles.subTitle}> {opening_hours[5]} </Text>
                  <Text style={styles.subTitle}> {opening_hours[6]} </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#191970' }]} >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>Reviews</Text>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]} >
                    <View style={styles.cardFooter}>
                      <Text style={styles.subTitleReview}> Author Name: {review1author} </Text>
                      <Text style={styles.subTitleReview}> Time: {review1time} </Text>
                      <Text style={styles.subTitleReview}> Review: {review1text} </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]} >
                    <View style={styles.cardFooter}>
                      <Text style={styles.subTitleReview}> Author Name: {review2author} </Text>
                      <Text style={styles.subTitleReview}> Time: {review2time} </Text>
                      <Text style={styles.subTitleReview}> Review: {review2text} </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]} >
                    <View style={styles.cardFooter}>
                      <Text style={styles.subTitleReview}> Author Name: {review3author} </Text>
                      <Text style={styles.subTitleReview}> Time: {review3time} </Text>
                      <Text style={styles.subTitleReview}> Review: {review3text} </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
                    <View style={styles.cardFooter}>
                      <Text style={styles.subTitleReview}> Author Name: {review4author} </Text>
                      <Text style={styles.subTitleReview}> Time: {review4time} </Text>
                      <Text style={styles.subTitleReview}> Review: {review4text} </Text>
                    </View>
                  </TouchableOpacity>

               
                </View>
              </TouchableOpacity>

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#191970' }]} >
              <View style={styles.cardHeader}>
                  <Text style={styles.title}>Application Reviews</Text>
                </View>

                <View style={styles.cardFooter}>
                 
                 

                  {reviews.map((marker, i) => (
                    <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
                      <View style={styles.cardFooter}>
                        {/* <Text style={styles.Title}> Application Reviews </Text> */}
                        <Text style={styles.subTitleReview}> Email: {marker.email} </Text>
                        <Text style={styles.subTitleReview}> Rating: {marker.rating} </Text>
                        <Text style={styles.subTitleReview}> Review: {marker.review} </Text>
                      </View>
                    </TouchableOpacity>
                    ))}
                </View>
              </TouchableOpacity>
            </Block>
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
    flex: 0.35,
  },
  card: {
    marginHorizontal: 2,
    marginVertical: 2,
    flexBasis: '48%',
    borderRadius: 2
  },
  cardFooter: {
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: 'white',
    borderWidth: 2.5,
    borderColor: '#191970',
    
  },
  title: {
    fontFamily: 'montserrat-regular',
    fontSize: 26,
    flex: 1,
    color: "#FFFFFF",
    fontWeight: '500'
  },
  titlereview: {
    fontFamily: 'montserrat-regular',
    fontSize: 26,
    flex: 1,
    color: "black",
    fontWeight: '500'
  },
  subTitleTop: {
    fontFamily: 'montserrat-regular',
    fontSize: 16,
    flex: 1,
    color: "#191970",
  },
  subTitle: {
    fontFamily: 'montserrat-regular',
    fontSize: 16,
    flex: 1,
    color: "#191970",
    marginTop: 10
  },
  subTitleReview: {
    fontFamily: 'montserrat-regular',
    fontSize: 16,
    flex: 1,
    color: "#191970",
    marginTop: 10
  },
  cardHeader: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
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
  spinnerTextStyle: {
    color: '#FFF'
  },
});