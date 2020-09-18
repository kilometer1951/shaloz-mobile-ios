import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Icons from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const ConnectionError = (props) => {
  const {networkValue} = props;
  //setNetworkStatus(networkValue);
  //   useEffect(() => {
  //     setTimeout(() => {
  //       setNetworkStatus(false);
  //     }, 4000);
  //   }, []);

  return (
    <View
      style={{
        zIndex: 1,
        padding: 10,
        backgroundColor: '#ec407a',
        marginBottom: 20,
        position: 'absolute',
        width: '100%',
        height: 60,
      }}>
      <View style={{alignSelf: 'center', flexDirection: 'row'}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            color: '#fff',
            marginRight: 10,
            marginTop: 25,
          }}>
          Network error. You are not connected to the internet.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ConnectionError;
