import React, { Component } from "react";

import { Block, Text, theme } from 'galio-framework';
import {  nowTheme } from '../constants';
const { width,} = Dimensions.get("screen");
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity, Dimensions} from 'react-native'

import { Input } from "../components";
import { Button } from 'react-native-elements';

class createtrip extends Component {
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
      visible: false,
      navigation: 123
    };
  }

  getItem = (name, text, size, color, type, placeType) => (
    <Block style={styles.group}>
      <TouchableOpacity>
        <Block style={{ flexDirection: 'column', alignContent: 'center', }}>
          <FontAwesome.Button style={{ width: 70, margin: 0, height: theme.SIZES.BASE * 3.5 }} name={name} color="white" backgroundColor={color} round size={size} type={type} onPress={() => { this.setState({ visible: true }) }}></FontAwesome.Button>
          <Text
          >{name}</Text>
        </Block>

      </TouchableOpacity>


    </Block>
  );



  render() {
    return (
      <Block style={{ flex: 1 }}>
        <Block style={{ flex: 0.4, flexDirection: 'column', alignItems: 'center', paddingHorizontal: theme.SIZES.BASE }}>
          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
            <Input
              placeholder="  Source"
              style={styles.inputs}
              iconContent={
                <Icon
                  size={11}
                  color={nowTheme.COLORS.ICON}
                  name="search"
                  family="NowExtra"
                />
              }
            />
          </Block>
          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
            <Input
              placeholder="  Destination"
              style={styles.inputs}
              iconContent={
                <Icon
                  size={11}
                  color={nowTheme.COLORS.ICON}
                  name="search"
                  family="NowExtra"
                />
              }
            />
          </Block>
        </Block>

        <Block style={styles.iconContainer}>
          {this.getItem("beer", "Beers", 40, "#f50", "font-awesome", "bar")}
          {this.getItem("bank", "Bank", 40, "#031068", "font-awesome", "bank")}
          {this.getItem("beer", "Beers", 40, "#f50", "font-awesome", "bar")}
          {this.getItem("bank", "Bank", 40, "#031068", "font-awesome", "bank")}
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
            title="  START TRIP "
            onPress={() => {
              // this.setState({ visible: true });
              // AsyncStorage.setItem('guidetype', 'restaurant');
              // alert(placeType);
              this.props.navigation.navigate("TripMapPage");
            }}
          />
        </Block>

      </Block>



    );
  }
}

const styles = StyleSheet.create({
  group: {
    alignItems: 'center',
    justifyContent: 'flex-end',
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

export default createtrip;


