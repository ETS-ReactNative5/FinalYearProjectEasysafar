
import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme } from 'galio-framework';

import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';

const { width, height } = Dimensions.get('screen');




const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Register extends React.Component {
    constructor(props) {
        super(props);
        //Initial State
        this.state = {
           email:"",
           password:"",
           name:""
            
        };
    }


    async onSignup() {
        const { email, password, name } = this.state;
        await fetch('http://192.168.0.108:3006/useradd?Name='+name+'&Email='+email+'&Password='+password+'')
        .then(users => {
            
            alert("inserted");
            this.props.navigation.navigate('Onboarding') 
        })
      
    }
    render() {
        return (
            <DismissKeyboard>
                <Block flex middle>
                    <ImageBackground
                        source={require('../assets/hello.jpg')}
                        style={styles.imageBackgroundContainer}
                        imageStyle={styles.imageBackground}
                    >
                        <Block flex middle>
                            <Block style={styles.registerContainer}>
                                <Block flex space="evenly">

                                    <Block flex={1} middle space="between">
                                        <Block center flex={0.9}>
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
                                                <Block center>
                                                    <Button color="primary" round style={styles.createButton} onPress={this.onSignup.bind(this)}>
                                                        <Text
                                                            style={{ fontFamily: 'montserrat-bold' }}
                                                            size={14}
                                                            color={nowTheme.COLORS.WHITE}

                                                        >
                                                            CREATE   
                                                            </Text> 
                                                    </Button>
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
        marginTop: 55,
        width: width * 0.9,
        height: height < 812 ? height * 0.5 : height * 0.5,
        backgroundColor: nowTheme.COLORS.WHITE,
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
    socialConnect: {
        backgroundColor: nowTheme.COLORS.WHITE
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: '#fff',
        shadowColor: nowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: nowTheme.COLORS.PRIMARY,
        fontWeight: '800',
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12,
        color: nowTheme.COLORS.ICON_INPUT
    },
    inputs: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 21.5
    },
    passwordCheck: {
        paddingLeft: 2,
        paddingTop: 6,
        paddingBottom: 15
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25,
        marginBottom: 40
    },
    social: {
        width: theme.SIZES.BASE * 3.5,
        height: theme.SIZES.BASE * 3.5,
        borderRadius: theme.SIZES.BASE * 1.75,
        justifyContent: 'center',
        marginHorizontal: 10
    }
});

export default Register;