import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import { nowTheme } from '../constants';
import { Icon } from '../components';
import { HeaderHeight } from "../constants/utils";
import { AsyncStorage, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 2;

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT + 10;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    //Initial State
    this.state = {
      email: "",
      phone: "",
      name: "",
      type: "Trips",
      tripArray: [],
      placeArray: [],
      reviewArray: [],
      countTrips: 0,
      countPlaces: 0,
      countReviews: 0,
      array: [],
    };
  }



  forceUpdateHandler() {
    this.forceUpdate();
  };

  async tripsHandler() {
    this.setState({
      spinner: true
    });
    let ip = await AsyncStorage.getItem('ip');
    const markers = [];
    this.setState({
      array: []
    });
    let email1 = await AsyncStorage.getItem('Email');
    await fetch('http://' + ip + ':3006/getsavedtrips?Email=' + email1 + '')
      .then(res => res.json())
      .then(res => {
        res.map((element) => {
          const marketObj = {};

          marketObj.id = element.id;
          marketObj.UserEmail = element.UserEmail;
          marketObj.DepartureID = element.DepartureID;
          marketObj.DestinationID = element.DestinationID;
          marketObj.Waypoints = element.Waypoints;
          marketObj.StartTime = element.StartTime;
          marketObj.StartDate = element.StartDate;
          marketObj.LunchTime = element.LunchTime;
          marketObj.DinnerTime = element.DinnerTime;
          marketObj.DestinationName = element.DestinationName;
          marketObj.DepartureName = element.DepartureName;

          markers.push(marketObj);
        });
        this.setState({ array: markers });
      });

    this.setState({
      type: "Trips"
    })
    this.forceUpdateHandler();
    this.setState({
      spinner: false
    });
  }

  async placesHandler() {
    this.setState({
      spinner: true
    });
    let ip = await AsyncStorage.getItem('ip');
    const markers = [];
    this.setState({
      array: []
    });
    let email1 = await AsyncStorage.getItem('Email');
    await fetch('http://' + ip + ':3006/getsavedplaces?Email=' + email1 + '')
      .then(res => res.json())

      .then(res => {
        res.map((element) => {
          const marketObj = {};

          marketObj.id = element.id;
          marketObj.UserEmail = element.UserEmail;
          marketObj.SpotPlaceID = element.SpotID;
          marketObj.SpotName = element.SpotName;
          marketObj.SpotPhoto = element.SpotPhotoReference;

          markers.push(marketObj);
        });

        this.setState({ array: markers });
      });
    this.setState({
      type: "Places"
    })
    this.forceUpdateHandler();
    this.setState({
      spinner: false
    });
  }

  async reviewsHandler() {
    this.setState({
      spinner: true
    });
    let ip = await AsyncStorage.getItem('ip');
    const markers = [];
    this.setState({
      array: []
    });
    let email1 = await AsyncStorage.getItem('Email');
    await fetch('http://' + ip + ':3006/getreviews?Email=' + email1 + '')
      .then(res => res.json())

      .then(res => {
        res.map((element) => {
          const marketObj = {};

          marketObj.id = element.id;
          marketObj.UserEmail = element.Email;
          marketObj.SpotName = element.PlaceName;
          marketObj.SpotID = element.PlaceID;
          marketObj.SpotReview = element.Review;
          marketObj.SpotRating = element.Rating;

          markers.push(marketObj);
        });

        this.setState({ array: markers });
        this.setState({
          spinner: false
        });
      });

    this.setState({
      type: "Reviews"
    })
    this.forceUpdateHandler();
  }

  componentDidMount() {

    this.getData();
  }

  async getData() {
    this.setState({
      spinner: true
    });

    let ip = await AsyncStorage.getItem('ip');
    let email1 = await AsyncStorage.getItem('Email');

    // alert(ip+email1)
    this.tripsHandler();

    //user details api
    await fetch('http://' + ip + ':3006/userprofile?Email=' + email1 + '')
      .then(res => res.json())

      .then(user => {

        this.setState({
          email: user[0].Email,
          phone: user[0].Phone,
          name: user[0].Name,

        })

      })

    //trip count api
    await fetch('http://' + ip + ':3006/usertripscount?Email=' + email1 + '')
      .then(res => res.json())
      .then(user => {

        this.setState({
          countTrips: user[0].count,
        })
      })

    //place count api
    await fetch('http://' + ip + ':3006/userplacescount?Email=' + email1 + '')
      .then(res => res.json())
      .then(user => {
        // alert(user[0].count);

        this.setState({
          countPlaces: user[0].count,
        })
      })

    //review count api
    await fetch('http://' + ip + ':3006/userreviewscount?Email=' + email1 + '')
      .then(res => res.json())
      .then(user => {
        // alert(user[0].count);

        this.setState({
          countReviews: user[0].count,
        })
      })

    this.setState({
      spinner: false
    });
  }

  //image block
  renderImage = () => {
    const { email, name, phone } = this.state
    return (
      <Block flex>
        <ImageBackground
          source={{ uri: 'https://wallpaperplay.com/walls/full/7/5/3/45596.jpg' }}
          style={styles.profileContainer}
          imageStyle={styles.profileImage}>
          <Block flex style={styles.profileDetails}>
            <Block style={styles.profileTexts}>
              <Text color="white" size={28} style={{ paddingBottom: 8 }}>{name}</Text>
              <Block row space="between">
                <Block column>
                  <Text color="white" size={16}>
                    <Icon name="mobile" family="font-awesome" color="white" size={16} />
                    {` `} {phone}
                  </Text>
                  <Text color="white" size={16}>
                    <Icon name="inbox" family="font-awesome" color="white" size={16} />
                    {` `} {email}
                  </Text>
                </Block>
              </Block>
            </Block>
            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient} />
          </Block>
        </ImageBackground>
      </Block>
    );
  };

  //selected type block
  renderSelectedType = () => {
    const { type } = this.state
    return (
      <Block flex style={styles.options}>
        <ScrollView>
          <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>

            <TouchableOpacity onPress={this.tripsHandler.bind(this)}>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>{this.state.countTrips}</Text>
                <Text size={12} color={theme.COLORS.PRIMARY} >Trips</Text>
              </Block>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.placesHandler.bind(this)}>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>{this.state.countPlaces}</Text>
                <Text size={12} color={theme.COLORS.PRIMARY}>Places</Text>
              </Block>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.reviewsHandler.bind(this)}>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>{this.state.countReviews}</Text>
                <Text size={12} color={theme.COLORS.PRIMARY}>Reviews</Text>
              </Block>
            </TouchableOpacity>
          </Block>
          <Block row space="between" style={{ paddingVertical: 16, alignItems: 'baseline' }}>
            <Text size={16}>{type}</Text>
          </Block>

          {type === "Places" ? [this.renderPlaces()] : null}
          {type === "Trips" ? [this.renderTrips()] : null}
          {type === "Reviews" ? [this.renderReviews()] : null}

        </ScrollView>
      </Block>
    );
  };

  renderPlaces = () => {
    return (
      <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
        <Block column space="between" style={{ flexWrap: 'wrap', flexDirection: 'row' }} >
          {this.state.array.map((element, index) => (
            <TouchableOpacity
              onPress={() => {
                AsyncStorage.setItem('placeid', element.SpotPlaceID);
                this.props.navigation.navigate('Details');
              }}>
              <Block style={styles.cardPlaces}>
                <Image
                  style={styles.cardImage}
                  source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + element.SpotPhoto + '&key=AIzaSyBXgBUjlHGrl3g1SjxpX5LypoXBDnU56vc' }}
                  resizeMode="cover"
                />
                <Block style={styles.textContent}>
                  <Text numberOfLines={3} style={styles.cardtitle}>{element.SpotName}</Text>
                </Block>
              </Block>
            </TouchableOpacity>
          ))}
        </Block>
      </Block>
    );
  };

  renderTrips = () => {
    return (
      <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
        <Block column space="between" style={{ flexWrap: 'wrap' }} >

          {this.state.array.map((element, index) => (
            <TouchableOpacity onPress={() => {
             
              AsyncStorage.setItem('SavedTripID', (element.id).toString());
              this.props.navigation.navigate("SavedTripMapPage");
            }}>
              <Block style={styles.cardTrips}>
                <Block style={styles.textContent}>

                  <Text numberOfLines={1} style={styles.cardtitle}>Trip # {index + 1}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}></Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>Departure : {element.DepartureName}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>Destination : {element.DestinationName}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>Start Time : {element.StartTime}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>Start Date : {element.StartDate}</Text>

                </Block>
              </Block>
            </TouchableOpacity>
          ))}

        </Block>
      </Block>
    );
  };

  renderReviews = () => {
    return (
      <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
        <Block column space="between" style={{ flexWrap: 'wrap' }} >
          {this.state.array.map((element, index) => (
            <Block style={styles.cardReviews}>
              <Block style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{element.SpotName}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>Rating : {element.SpotRating}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>Review : {element.SpotReview}</Text>
              </Block>
            </Block>
          ))}
        </Block>
      </Block>
    );
  };

  render() {
    return (
      <Block flex>
        <Spinner
          visible={this.state.spinner}
          textContent={'Gathering Details'}
          textStyle={styles.spinnerTextStyle}
        />
        {this.renderImage()}
        {this.renderSelectedType()}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
  },
  profileContainer: {
    width: width,
    height: height / 3,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2
  },
  pro: {
    backgroundColor: nowTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: width,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
  cardPlaces: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: thumbMeasure,
    width: width / 3,
    overflow: "hidden",
  },
  cardTrips: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: thumbMeasure,
    width: width / 1.3,
    overflow: "hidden",
  },
  cardReviews: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: thumbMeasure * 0.75,
    width: width / 1.3,
    overflow: "hidden",
  },
  cardImage: {
    flex: 1.5,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 13,
    color: "#444",
  },
});
export default Profile;

