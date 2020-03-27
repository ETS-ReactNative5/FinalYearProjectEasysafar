import React, { Component } from 'react';
import { StyleSheet, Dimensions, ScrollView, Picker } from "react-native";
import { Block, theme, Text } from "galio-framework";
import RadioGroup, { Radio } from "react-native-radio-input";
import { nowTheme } from '../constants';
import { Card, Button, Icon, Input } from "../components";
import { AsyncStorage } from 'react-native';
var FloatingLabel = require('react-native-floating-labels');

const { width } = Dimensions.get("screen");

class addreview extends React.Component {
  state = {
    ischecked: false,
  };

  constructor(props) {
    super(props);
    //Initial State
    this.state = {
      
      rating: "",
      review:"",
      placename:"",
      authorname:""

    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {

    const markers = [];
    let ip = await AsyncStorage.getItem('ip');

    await fetch('http://' + ip + ':3006/fypnames ')
      .then(res => res.json())

      .then(res => {
        

      });
  }

  async Submit() {
   
  }

  renderHeading = () => {
    return (
      <Block flex style={styles.group}>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
         
          <Text
            h4
            style={{
              fontFamily: 'montserrat-regular',
              marginBottom: theme.SIZES.BASE / 2
            }}
            color={nowTheme.COLORS.HEADER}
          >
            Place Name
          </Text>
         
        </Block>
      </Block>
    );
  };


  getChecked = (value) => {
    this.setState({ status: value });
  }

  async setData() {
    
    let ip = await AsyncStorage.getItem('ip');

    await fetch('')
    .then(res => res.json())
    .then(users => {

        this.setState({
            

        })

    })
  }

  renderRating = () => {
    return (
      <Block flex style={styles.group}>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>

          <Text
            h5
            style={{
              fontFamily: 'montserrat-regular',
              marginBottom: theme.SIZES.BASE / 2
            }}
            color={nowTheme.COLORS.HEADER}
          >
            Rating
          </Text>
          <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>

            <RadioGroup getChecked={this.getChecked}>
              <Radio iconName={"lens"} label={"1"} value={"1"} />
              <Radio iconName={"lens"} label={"2"} value={"2"} />
              <Radio iconName={"lens"} label={"3"} value={"3"} />
              <Radio iconName={"lens"} label={"4"} value={"4"} />
              <Radio iconName={"lens"} label={"5"} value={"5"} />
            </RadioGroup>

          </Block>
        </Block>
      </Block>
    );


  }; 

  renderComments = () => {
    return (
      <Block flex style={styles.group}>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Text
            h5
            style={{
              fontFamily: 'montserrat-regular',
              marginBottom: theme.SIZES.BASE / 2
            }}
            color={nowTheme.COLORS.HEADER}
          >
            Write review
          </Text>
          <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Block style={{ flexDirection: 'column' }}>

              <Block style={{ flexDirection: 'column' }}>
                <FloatingLabel
                  inputStyle={styles.input1}
                  style={styles.formInput}
                  onChangeText={(review) => this.setState({ review })}
                  placeholder="Review"
                >
                </FloatingLabel>
              </Block>



            </Block>
          </Block>
        </Block>
      </Block>
    );
  };

  render() {
    return (
      <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

          {this.renderHeading()}
          {this.renderRating()}
          {this.renderComments()}


          <Block style={{ flex: 0.33, flexDirection: 'row', marginTop: theme.SIZES.BASE, justifyContent: 'center', alignItems: 'center' }}>
            <Button
              shadowless
              style={styles.button}
              color={nowTheme.COLORS.PRIMARY}
              onPress={this.Submit.bind(this)}

            >
              <Text
                style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                color={theme.COLORS.WHITE}
              >
                Submit
              </Text>
            </Button>
          </Block>
        </ScrollView>
      </Block>
    );
  }

}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: theme.SIZES.BASE * 4,
        marginBottom: theme.SIZES.BASE,
        justifyContent: "center",
        width: width,
        height: theme.SIZES.BASE * 4,
        shadowRadius: 0,
        shadowOpacity: 0
      },
  button: {
    backgroundColor: "#3b5998",
    color: "white"
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  input: {
    paddingTop: 10,
    paddingRight: 15,
    fontSize: 15,
    color: 'black',
    fontWeight: '500',

  },
  container: {
    fontSize: 16,
    backgroundColor: 'white',
  },

  formInput: {
    borderBottomWidth: 1.5,
    fontSize: 16,
    color:'black'
  },
  input1: {
    borderWidth: 0,
    fontSize: 16
  }
})
export default addreview;