import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
//galio
import { Block, Text, theme } from 'galio-framework';

import { articles, nowTheme, Images } from '../constants';
import { Card } from '../components';
const { width, height } = Dimensions.get('screen');
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';

class GuidePlaceType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placename: "",
      lat: "",
      long: "",
      temp: "",
      image: require('../assets/mingora.jpg')
    };
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {

    try {
      let name = await AsyncStorage.getItem('name');
      if (name == "Lahore, Punjab") {
        this.setState({
          placename: name,
          lat: 31.5204,
          long: 74.3587,
          image: require('../assets/badshahi.jpg')
        });

      }
      else if (name == "Hunza, Swat") {
        this.setState({
          placename: name,
          lat: 36.3167,
          long: 74.6500,
          image: require('../assets/hunza.jpg')
        });

      }
      else if (name == "Abbottabad, KPK") {
        this.setState({
          placename: name,
          lat: 34.1688,
          long: 73.2215,
          image: require('../assets/abottabad.jpg')
        });

      }
      else if (name == "Kalam, Swat") {
        this.setState({
          placename: name,
          lat: 35.4902,
          long: 72.5796,
          image: require('../assets/kalam.jpg')
        });

      }
      else if (name == "Arang Kel, Kashmir") {
        this.setState({
          placename: name,
          lat: 34.8051,
          long: 74.3456,
          image: require('../assets/arangkel.jpg')
        });

      }
      else if (name == "Mingora, Swat") {
        this.setState({
          placename: name,
          lat: 34.7717,
          long: 72.3602,
          image: require('../assets/mingora.jpg')
        });

      }

      const { lat, long, temp } = this.state;
      this.setState({ placename: name });
      fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&units=metric&appid=ffc2402c9e6eb729217a5ed3227741ec')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ temp: responseJson.list[0].main.temp });
        })
    }
    catch (error) {
      alert(error)
    }
  }

  render() {
    const { image, temp } = this.state;
    return (
      <Block style={{ flex: 1, }}>
        <Block style={styles.group}>
          <Image
            source={image}
            style={{ width: width, height: theme.SIZES.BASE * 15 }}
          />
          <Block style={{ flex: 0.3, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', color: 'white' }}>
          </Block>
        </Block>
        <Block style={{flexDirection:'column'}}>
          <Text  style={{ fontSize: 25, marginLeft: 10, lineHeight: 22, fontWeight: 'bold', color: 'white' }}>{this.state.placename}</Text>
        <Text style={{ fontSize: 25, marginLeft: 10, lineHeight: 22, fontWeight: 'bold', color: 'white' }}>
          {temp}
          <Text style={{ fontSize: 10, lineHeight: 25 * 1.1, fontWeight: 'bold', textAlignVertical: 'bottom', color: 'white' }}>
            o
          </Text>
          C
          </Text>
          </Block>
        <Block style={{ width: width, flex: 0.6, marginTop: theme.SIZES.BASE }}>
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}

          >
            <Block style={{ flex: 0.2, flexDirection: 'row', width: width }}>
              <TouchableOpacity
                style={styles.button1}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'park');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <Ionicons name="md-star" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Park</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button2}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'tourist_attraction');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <Ionicons name="ios-bed" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Tourist </Text>
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Attraction</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button3}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'restaurant');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <Ionicons name="md-restaurant" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Eateries</Text>
              </TouchableOpacity>
            </Block>

            <Block style={{ flex: 0.2, flexDirection: 'row', width: width }}>
              <TouchableOpacity
                style={styles.button4}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'bank');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <FontAwesome name="bank" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Banks</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button5}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'movie_theater');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <Ionicons name="md-film" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Cinemas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button6}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'shopping_mall');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <FontAwesome name="shopping-cart" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Shopping</Text>
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Malls</Text>
              </TouchableOpacity>
            </Block>

            <Block style={{ flex: 0.2, flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.button7}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'clothing_store');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <FontAwesome name="shopping-bag" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Clothing</Text>
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Store</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button8}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'museum');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <FontAwesome name="building" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Museums</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button9}
                onPress={() => {
                  this.setState({ visible: true });
                  AsyncStorage.setItem('guidetype', 'gas_station');
                  this.props.navigation.navigate("GuidePlaceResult");
                }}
              >
                <MaterialIcons name="local-gas-station" size={32} color="white" />
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Gas</Text>
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: "white" }}>Station</Text>
              </TouchableOpacity>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    );
  }
}


const styles = StyleSheet.create({
  group: {
    flex: 0.4,
    width: width
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button3: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gold',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button4: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'mediumvioletred',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button5: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orchid',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button6: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkviolet',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button7: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkslateblue',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button8: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'teal',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },
  button9: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
    width: width / 3,
    height: theme.SIZES.BASE * 8,
    borderRadius: 20,
    opacity: 0.6
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.35
  },
  buttonContainer: {
    paddingHorizontal: theme.SIZES.BASE * 4,
    marginBottom: theme.SIZES.BASE,
    justifyContent: "center",
    width: width,
    height: theme.SIZES.BASE * 4,
    shadowRadius: 0,
    shadowOpacity: 0,
    flex: 0.25, justifyContent: 'center'
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

const styles1 = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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


export default GuidePlaceType;