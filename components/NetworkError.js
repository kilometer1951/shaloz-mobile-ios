import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Icons from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const NetworkError = (props) => {
  const {networkError, setNetworkError} = props;
  useEffect(() => {
    setTimeout(() => {
      setNetworkError(false);
    }, 4000);
  }, []);

  return (
    networkError && (
      <View
        style={{
          zIndex: 1,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.pink,
          shadowColor: 'black',
          shadowOpacity: 0.16,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 8,
          backgroundColor: Colors.pink,
          elevation: 5,
          borderRadius: 5,
          marginHorizontal: 20,
          marginBottom: 20,
          marginTop: 50,
          position: 'absolute',
          width: '80%',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          style={{alignSelf: 'center', flexDirection: 'row'}}
          onPress={() => {
            setNetworkError(false);
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              color: '#fff',
              marginRight: 10,
            }}>
            Network error try again
          </Text>
          <Icons name="md-close" color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({});

export default NetworkError;
