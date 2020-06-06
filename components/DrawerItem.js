import React from 'react';
import { StyleSheet } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import nowTheme from '../constants/Theme';

class DrawerItem extends React.Component {
 

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <Block flex row style={containerStyles }>
       
        <Block row center flex={0.9}>
          <Text
            style={{ fontFamily: 'montserrat-regular', textTransform: 'uppercase', fontWeight: '300' }}
            size={14}
            bold={focused ? true : false}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          >
            {title}
          </Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14,
    color: 'white',
    opacity:0.8,
  },
  activeStyle: {
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 30,
    color: 'white'
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
