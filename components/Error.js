import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const Error = props => {
  return (
    <Text style={[styles.textStyle, {...props.moreStyles}]}>{props.error}</Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
    marginBottom: 5,
    color: Colors.pink,
    marginTop: 5,
    marginLeft: 2,
  },
});

export default Error;
