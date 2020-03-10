import React from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Block, theme, Text } from "galio-framework";
import { FontAwesome } from '@expo/vector-icons';
import MapView from './MapView';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage } from 'react-native';

const { width } = Dimensions.get("screen");

class Home extends React.Component {
  constructor(props) {
    super(props);
    //Initial State
    this.state = {
      placeType: "a",
    };
  }

  componentDidMount(){
    
  }

  

  getItem = (name, text, size, color, type, placeType) => (
    
    
    <Block style={styles1.group}>
      
      <TouchableOpacity  >
        <Block style={{  alignContent: 'center', }}>
          <FontAwesome.Button style={{ width: 70, margin: 0, height: theme.SIZES.BASE * 3.5 }} name={name} color="white" backgroundColor={color} round size={size} type={type}
            onPress={() => {
              this.setState({ visible: true });  
              AsyncStorage.setItem('type', placeType);
              this.props.navigation.navigate("MapPage");
              
            }}></FontAwesome.Button>
          <Text style={{width:70}}>{text}</Text>
          
        </Block>

      </TouchableOpacity>


    </Block>

  );

  render() {

    return (
      
      <Block style={styles.home}>

        <MapView />

        <Block>
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
            type="solid"
            iconLeft
            textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
            title="  START NEW TRIP "
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

export default Home;
