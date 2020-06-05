import React from 'react';
import { ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { Button } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableHighlight } from 'react-native';

var FloatingLabel = require('react-native-floating-labels');
const { height, width } = Dimensions.get('screen');

export default class Onboarding extends React.Component {
  state = {
    email: '',
    password: '',
    spinner: false,
  };

  async onLogin() {
    const { email, password } = this.state;

    this.setState({
      spinner: true
    });

    if (email != "") {
      if(email.includes("@") && email.includes(".")) {
        if (password != "") 
        {
          let ip = AsyncStorage.getItem('ip');

          await fetch('http://192.168.43.42:3006/userlogin?Email=' + email + '&Password=' + password + ' ')
            .then(res => res.json())
            .then(users => {
              if (users === 0) {
                alert("invalid credentials");
              }
              else {
                AsyncStorage.setItem('Email', users[0].Email.toString());
                this.props.navigation.navigate('Home');
              }
            })
        }
        else {
          alert("Please enter password.");
        }
      }
      else {
        alert("Please enter valid email address.");
      }
    }
    else {
      alert("Please enter email.");
    }

    this.setState({
      spinner: false
    });
  }

  componentDidMount() {
    AsyncStorage.setItem('ip', '192.168.43.42:3006')
  }

  handleSubmitSignup = () => {
    this.props.navigation.navigate('Register');
  }

  onBlur() {
    console.log('#####: onBlur');
  }

  render() {
    return (
      <Block flex>
        <Spinner
          visible={this.state.spinner}
          textContent={'Verifying Credentials'}
          textStyle={styles.spinnerTextStyle}
        />
        <ImageBackground
          source={require('../assets/background.jpg')}
          style={styles.background}
        >
          <Block style={{flex:0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text color="#191970" style={{fontFamily: 'montserrat-regular'}}size={50} >Easy</Text>
            <Text color="#191970" style={{fontFamily: 'montserrat-regular'}}size={50} >Safar</Text>
          </Block>
    
          <Block style={{flex:0.4, flexDirection: 'column', justifyContent:'center', marginLeft: '12%',marginRight: '12%'}}>
            <Block style={{flex:0.2, marginBottom: '15%',}}>
              <FloatingLabel 
                labelStyle={styles.labelInput}
                inputStyle={styles.input}
                style={styles.formInput}
                keyboardType="email-address" 
                onChangeText={(email) => this.setState({ email })}
                onBlur={this.onBlur}
              >
                Email
              </FloatingLabel>
            </Block>

            <Block style={{flex:0.2}}>
              <FloatingLabel 
                labelStyle={styles.labelInput}
                inputStyle={styles.input}
                style={styles.formInput}
                onChangeText={(password) => this.setState({ password })}
                onBlur={this.onBlur}
              >
                Password
              </FloatingLabel>
            </Block>
          </Block>

          <Block style={styles.registerContainer}>
            <TouchableHighlight style={styles.buttonContainer} onPress={this.handleSubmitSignup}>
              <Text color="white" size={16} style={{ fontFamily: 'montserrat-regular' }, styles.underline}>Create New Account</Text>
            </TouchableHighlight>
          </Block>

          <Block style={styles.buttonLogin}>
            <Button 
              buttonStyle={{borderWidth: 2, borderColor: 'orange', }}
              titleStyle={{color: 'white', fontSize: 25}}
              type="outline"
              iconLeft
              title="LOGIN"
              onPress={this.onLogin.bind(this)}
            />
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle:{
    color: 'white'
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'double'
  },
  background: {
    width: width,
    height: height,
    flex: 1
  },
  buttonLogin: {
    paddingHorizontal: theme.SIZES.BASE * 4,
    marginBottom: theme.SIZES.BASE,
    justifyContent: "center",
    width: width,
    height: theme.SIZES.BASE * 4,
    shadowRadius: 0,
    flex: 0.15
  },
  registerContainer: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: '17%',
    width: 250,
    borderRadius: 30,
  },
  labelInput: {
    color: "#191970",
  },
  formInput: {    
    borderBottomWidth: 2, 
    borderColor: "#191970",       
  },
  input: {
    borderWidth: 0
  }
});