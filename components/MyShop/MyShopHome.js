import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
 
} from 'react-native';

import Earnings from './Earnings';


const MyShopHome = (props) => {
  // console.log({
  //   from_date: startOfWeek.toString(),
  //   to_date: endOfWeek.toString(),
  // });

  return (
    <View style={styles.screen}>
      <Earnings navigation={props.navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    
  },
});

export default MyShopHome;
