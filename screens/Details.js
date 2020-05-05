import React, { Component } from "react";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Block, Button, Text, theme } from 'galio-framework';
const { width, height } = Dimensions.get("screen");
import { Animated, View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

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
    };
  }

  // async componentWillUnmount(){
  //   await this.getReview()  
  // }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        spinner: false
      });
    }, 7000);

    this.displayData()
    this.getReview()  
   
  }

  displayData = async () => {
    try {
      let placeid = await AsyncStorage.getItem('placeid');

      this.setState({ placeid: placeid });
      this.getPlaces(placeid);
      

    }
    catch (error) {
      alert(error)
    }
  }

  getPlacesUrl(place_id, apiKey) {
    // console.log(place_id);
    const baseUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_phone_number,formatted_address,geometry,name,photo,place_id,website,type,opening_hours,price_level,review&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc`;

    return `${baseUrl}`;
  }

  async getPlaces(place) {

    // alert(placeid);
    const url = this.getPlacesUrl(place, GOOGLE_API_KEY);
    fetch(await url)
      .then(res => res.json())

      .then(res => {
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


      })
      .catch(res => {

      });


  }

  async getReview() {

    // alert("placeid");
    let placeid = await AsyncStorage.getItem('placeid');
    let email = await AsyncStorage.getItem('Email');

    // const url = this.getPlacesUrl(place, GOOGLE_API_KEY);
    await fetch('http://192.168.0.107:3006/getreview?Email='+email+'&PlaceID=' + placeid + ' ')
      .then(res => res.json())

      .then(res => {
        // alert(res[0].Review);
        // console.log(res[0].Review)
        this.setState({ userreview: res[0].Review });
        this.setState({ userrating: res[0].Rating });
        

      })
      .catch(res => {

      });


  }

  render() {
    const { name, rating, type, address, placeid, phone, image1url, image2url, image3url, image4url, image5url, website, price_level,
      opening_hours, open_now, review1author, review1text, review1time, review2author, review2text, review2time, review3author, review3text,
      review3time, review4author, review4text, review4time, userreview, userrating } = this.state;
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

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#3b5998' }]} >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{name}</Text>
                  <TouchableOpacity

                    onPress={() => {
                      AsyncStorage.setItem('PlaceName', name);
                      this.props.navigation.navigate("addreview");
                    }}>
                    <Text style={styles.subTitle}>Add Review</Text></TouchableOpacity>

                </View>

                <View style={styles.cardFooter}>


                  <Text style={styles.subTitleTop}> Rating: {rating} </Text>
                  <Text style={styles.subTitle}> Type: {type[0]} </Text>
                  <Text style={styles.subTitle}> Open Now: {open_now} </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#3b5998' }]} >
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

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#3b5998' }]} >
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

              <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#3b5998' }]} >
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

                  <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]} >
                    <View style={styles.cardFooter}>
                      <Text style={styles.subTitleReview}> Author Name: {review4author} </Text>
                      <Text style={styles.subTitleReview}> Time: {review4time} </Text>
                      <Text style={styles.subTitleReview}> Review: {review4text} </Text>
                    </View>
                  </TouchableOpacity>

                    
                  <TouchableOpacity disabled style={[styles.card, { backgroundColor: '#FFFFFF' }]} >
                    <View style={styles.cardFooter}> 
                    <Text style={styles.Title}> Your Review </Text>
                      {/* <Text style={styles.subTitleReview}> Author Name: {review4author} </Text> */}
                      <Text style={styles.subTitleReview}> Review: {userreview} </Text>
                      <Text style={styles.subTitleReview}> Rating: {userrating} </Text>
                    </View>
                  </TouchableOpacity>

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
    // marginTop: 10
  },
  cardFooter: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  icon: {
    height: 20,
    width: 20,
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
    color: "#FFFFFF",
  },
  subTitle: {
    fontFamily: 'montserrat-regular',
    fontSize: 16,
    flex: 1,
    color: "#FFFFFF",
    marginTop: 10
  },
  subTitleReview: {
    fontFamily: 'montserrat-regular',
    fontSize: 16,
    flex: 1,
    color: "black",
    marginTop: 10
  },
  cardHeader: {
    // flexDirection:'row',
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
  spinnerTextStyle: {
    color: '#FFF'
  },
});