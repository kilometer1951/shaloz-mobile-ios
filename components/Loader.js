import React, {useState, useEffect} from 'react';
import {View,  Text, ActivityIndicator} from 'react-native';
import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';

const Loader = (props) => {
  return (
    <View
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        opacity: 1,
        zIndex: 1,
        backgroundColor: '#fff',
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <ActivityIndicator size="large" color={Colors.purple_darken} />
        <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 20}}>
          Saving please wait
        </Text>
      </View>
    </View>
  );
};

export default Loader;
