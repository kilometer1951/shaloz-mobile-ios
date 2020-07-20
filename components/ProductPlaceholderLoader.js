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

const ProductPlaceholderLoader = (props) => {
  const dataN = [
    {ne: '1'},
    {ne: '2'},
    {ne: '3'},
    {ne: '4'},
    {ne: '5'},
    {ne: '6'},
  ];

  const placeholderData = dataN.map((result, index, array) => {
    return (
      <View style={styles.placeholderContainer} key={index}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia style={styles.topPlaceholder} />
          <PlaceholderLine style={styles.bottomPlaceholder} />
          <PlaceholderLine style={styles.bottomPlaceholder} />
          <PlaceholderLine style={styles.bottomPlaceholder} />
        </Placeholder>
      </View>
    );
  });

  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {placeholderData}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    width: '46%',
    borderRadius: 5,
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 8,
    elevation: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    height: 270,
    marginRight: 1,
    marginBottom: 5,
    marginLeft: 10,
    marginBottom: 10,
  },
  topPlaceholder: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    width: '100%',
    height: 150,
  },
  bottomPlaceholder: {
    marginTop: 5,
    padding: 10,
    marginHorizontal: 10,
    width: '90%',
  },
});

export default ProductPlaceholderLoader;
