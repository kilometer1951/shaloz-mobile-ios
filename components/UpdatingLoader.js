import React, {useState, useEffect} from 'react';
import {View,  ActivityIndicator} from 'react-native';
import Colors from '../contants/Colors';
import Fonts from '../contants/Fonts';

const UpdatingLoader = (props) => {
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
      </View>
    </View>
  );
};

export default UpdatingLoader;
