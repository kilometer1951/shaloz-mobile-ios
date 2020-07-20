import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
 
} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import Colors from '../contants/Colors';

const ProductPlaceholderLoader = (props) => {
  const dataN = [{ne: '1'}, {ne: '2'}];

  const placeholderData = dataN.map((result, index, array) => {
    return (
      <View style={styles.placeholderContainer} key={index}>
        <Placeholder Animation={Fade}>
          <PlaceholderLine style={{width: '20%'}} />
          <PlaceholderLine style={{width: '20%'}} />

          <View style={styles.itemContainer}>
            <PlaceholderMedia style={{height: 100, width: 100}} />
            <View style={{width: '100%'}}>
              <PlaceholderLine style={{width: '40%', marginLeft: 10}} />
              <PlaceholderLine style={{width: '40%', marginLeft: 10}} />
            </View>
          </View>

          <PlaceholderLine style={{width: '60%', marginTop: 10}} />
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
      </View>
    );
  });

  return <View style={{backgroundColor: '#eeeeee'}}>{placeholderData}</View>;
};

const styles = StyleSheet.create({
  placeholderContainer: {
    height: 500,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    height: 205,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    flexDirection: 'row',
  },
});

export default ProductPlaceholderLoader;
