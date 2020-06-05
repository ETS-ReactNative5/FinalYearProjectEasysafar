import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, Dimensions, ScrollView, Picker } from "react-native";
import { Block, theme, Text } from "galio-framework";
import RadioGroup, { Radio } from "react-native-radio-input";
import { nowTheme } from '../constants';
import { Button } from 'react-native-elements';

var FloatingLabel = require('react-native-floating-labels');
const { width } = Dimensions.get("screen");

class addreview extends React.Component {
  state = {
    ischecked: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      rating: "",
      review: "",
      placename: "",
      authorname: "",
      spinner: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const markers = [];
    let placename = await AsyncStorage.getItem('PlaceName');
    
    this.setState({
      placename: placename
    })
  }

  async Submit() {
    let placeid = await AsyncStorage.getItem('placeid');
    let email = await AsyncStorage.getItem('Email');
    let ip = await AsyncStorage.getItem('ip');

    const { review, status } = this.state;
    this.setState({
      spinner: true
    });
    await fetch('http://'+ip+'/addreview?PlaceID=' + placeid + '&Email=' + email + '&Review=' + review + '&Rating=' + status + ' ')
      .then(users => {
        alert("inserted");
        this.props.navigation.navigate("Details");
      })
      .catch(res => {
      });

    setTimeout(() => {
      this.setState({
        spinner: false
      });
    }, 4000);
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
            {this.state.placename}
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
              buttonStyle={{borderWidth: 2,  width: width/1.5, borderColor: '#191970', }}
              type="outline"
              iconLeft
              titleStyle={{color: '#191970'}}
              textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
              title=" SUBMIT "
              onPress={this.Submit.bind(this)}
            />
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  formInput: {
    borderBottomWidth: 1.5,
    fontSize: 16,
    color: 'black'
  },
  input1: {
    borderWidth: 0,
    fontSize: 16
  }
})
export default addreview;