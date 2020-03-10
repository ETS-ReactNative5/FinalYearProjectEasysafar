import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
//galio
import { Block, theme } from 'galio-framework';

import { articles, nowTheme} from '../constants';
import { Card } from '../components';



class Guides extends React.Component {
  renderCards = () => {
    return (
      <Block style={styles.container}>
        <Block flex card center shadow style={styles.category}>
        
        </Block>
        
        <Card item={articles[4]} full />
        
        <Block flex row>
          <Card item={articles[0]} style={{ marginRight: theme.SIZES.BASE }} />
          <Card item={articles[3]} />
        </Block>
        <Block flex row>
          <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
          <Card item={articles[2]} />
        </Block>
        
        <Card item={articles[5]} full />
      </Block>
    );  
  };
  
  render() {
    return (
      <Block flex>
        <ScrollView showsVerticalScrollIndicator={false}>{this.renderCards()}</ScrollView>
      </Block>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE 
  },
  title: {
    fontFamily: 'montserrat-bold',
    paddingBottom: theme.SIZES.BASE,
    marginTop: 44,
    color: nowTheme.COLORS.HEADER
  }
});

export default Guides;
