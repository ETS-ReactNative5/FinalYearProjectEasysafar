import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';

import { Button } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';

const { width, height } = Dimensions.get('screen');
import { AsyncStorage } from 'react-native';
import { Card, CardImage, CardTitle, CardAction, CardContent, CardButton } from 'react-native-cards';
import { getLightEstimationEnabled } from 'expo/build/AR';

const thumbMeasure = (width - 48 - 32) / 3;


class Profile extends React.Component {
  constructor(props) {
    super(props);
    //Initial State
    this.state = {
       email:"",
       phone:"",
       name:"",
    };
}

  componentDidMount(){

    this.getData();
    
  }

  async getData()
  {
    let email1 = await AsyncStorage.getItem('email');
    // console.warn(email1);
    // fetch('http://192.168.43.139:3006/userprofile?Email='+email1+'')
    fetch('http://192.168.43.139:3006/userprofile?Email=Rabia@g.com')
    .then(res => res.json())
        .then(user => {

            if(user==0)
            {
              alert("invalid credentials");
              
            }
            else
            {
              this.setState({
                email: user[0].Email,
                phone: user[0].Phone,
                name: user[0].Name,

              })
            }           
            
        })
  }

  render(){
    const {email,name,phone} = this.state
    return (
      <Block style={{flex: 1}}>
        <Block style={{flex: 0.4}}>
          <Card>
            <CardImage 
              source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}} 
            />
          </Card>
        </Block>

        <Block style={{flex: 0.6}}>
          <Card>
            <CardTitle
              subtitle={name}
              style={{alignItems: 'center'}}
            />
          </Card>
          <Card>
            <CardTitle
              subtitle={email}
              style={{alignItems: 'center'}}
            />
          </Card>
          <Card>
            <CardTitle
              subtitle={phone}
              style={{alignItems: 'center'}}
            />
          </Card>
        </Block>
      </Block>
    )
  }
}





const styles = StyleSheet.create({

  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width,
    height: height * 0.6
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80
  },
  avatar: {
    width: thumbMeasure*1.5,
    height: thumbMeasure*1.5,
    borderRadius: 130,
    borderWidth: 5
  },
  nameInfo: {
    marginTop: 35
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: 'center',
    zIndex: 99,
    marginHorizontal: 5
  }
});
export default Profile;

