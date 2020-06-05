
import React from 'react';
import { StyleSheet, ImageBackground, Dimensions, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import { Block, theme } from 'galio-framework';
import { Icon, Input } from '../components';
import { Button } from 'react-native-elements';
import { nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('screen');
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: "",
            phone: "",
            spinner: false,
        };
    }

    async onSignup() {
        const { email, password, name, phone } = this.state;
        let ip = await AsyncStorage.getItem('ip');

        this.setState({
            spinner: true
          });

        if (name != "") {
            if (phone != "")
            {
                if (phone.length>=7) {
                if (email != "") {
                    if(email.includes("@") && email.includes(".")) {
                        if (password != "") {
                        await fetch('http://' + ip + '/useradd?Name=' + name + '&Email=' + email + '&Password=' + password + '&phone=' + phone + '')
                            .then(users => {
                                alert("inserted");
                                this.props.navigation.navigate('Onboarding')
                            })
                        }
                        else {
                            alert("Please enter password");
                        }
                    }
                    else {
                        alert("Please enter valid email address.");
                    }
                }
                else {
                    alert("Please enter email.");
                }
            }
            else {
                alert("Number should be of minimum 7 digits.");
            }
        }
        else {
            alert("Please enter phone number.");
        }
        }
        else {
            alert("Please enter name.");
        }
        this.setState({
            spinner: false
        });
    }

    render() {
        return (
            <DismissKeyboard>
                <Block flex middle>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Verifying Credentials'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <ImageBackground
                        source={require('../assets/background.jpg')}
                        style={styles.imageBackgroundContainer}
                        imageStyle={styles.imageBackground}
                    >
                        <Block flex middle>
                            <Block style={styles.registerContainer}>
                                <Block flex space="evenly">

                                    <Block flex={1} middle space="between">
                                        <Block center flex={1}>
                                            <Block flex space="between">
                                                <Block style={{ marginTop: 20 }}>
                                                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                                                        <Input
                                                            placeholder="Name"
                                                            style={styles.inputs}
                                                            iconContent={
                                                                <Icon
                                                                    size={16}
                                                                    color="#ADB5BD"
                                                                    name="profile-circle"
                                                                    family="NowExtra"
                                                                    style={styles.inputIcons}
                                                                />
                                                            }
                                                            onChangeText={(name) => this.setState({ name })}
                                                        />
                                                    </Block>
                                                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                                                        <Input
                                                            placeholder="Phone #"
                                                            style={styles.inputs}
                                                            keyboardType='number-pad'
                                                            iconContent={
                                                                <Icon
                                                                    size={16}
                                                                    color="#ADB5BD"
                                                                    name="mobile2x"
                                                                    family="NowExtra"
                                                                    style={styles.inputIcons}
                                                                />
                                                            }
                                                            onChangeText={(phone) => this.setState({ phone })}
                                                        />
                                                    </Block>
                                                    <Block width={width * 0.8}>
                                                        <Input
                                                            placeholder="Email"
                                                            keyboardType="email-address"

                                                            style={styles.inputs}
                                                            iconContent={
                                                                <Icon
                                                                    size={16}
                                                                    color="#ADB5BD"
                                                                    name="email-852x"
                                                                    family="NowExtra"
                                                                    style={styles.inputIcons}
                                                                />
                                                            }
                                                            onChangeText={(email) => this.setState({ email })}
                                                        />
                                                    </Block>
                                                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                                                        <Input
                                                            placeholder="Password"
                                                            secureTextEntry={true}

                                                            style={styles.inputs}
                                                            iconContent={
                                                                <Icon
                                                                    size={16}
                                                                    color="#ADB5BD"
                                                                    name="badge2x"
                                                                    family="NowExtra"
                                                                    style={styles.inputIcons}
                                                                />
                                                            }
                                                            onChangeText={(password) => this.setState({ password })}
                                                        />
                                                    </Block>

                                                </Block>
                                                <Block center style={styles.buttonLogin}>
                                                <Button 
                                                    buttonStyle={{borderWidth: 2, height: 60, paddingHorizontal: theme.SIZES.BASE * 4, borderColor: 'orange', }}
                                                    titleStyle={{color: 'white', fontSize: 25}}
                                                    type="outline"
                                                    iconLeft
                                                    title="CREATE"
                                                    onPress={this.onSignup.bind(this)}
                                                />
                                                </Block>
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                        </Block>
                    </ImageBackground>
                </Block>
            </DismissKeyboard>
        );
    }
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        width: width,
        height: height,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: width,
        height: height
    },
    registerContainer: {
        marginTop: 50,
        width: width * 0.9,
        height: height < 812 ? height * 0.6 : height * 0.6,
        borderRadius: 4,
        shadowColor: nowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: 'hidden'
    },
    inputIcons: {
        marginRight: 12,
        color: nowTheme.COLORS.ICON_INPUT
    },
    buttonLogin: {
        justifyContent: "center",
        height: theme.SIZES.BASE * 4,
        shadowRadius: 0,
      },
    inputs: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 21.5
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25,
        marginBottom: 40
    }
});

export default Register;