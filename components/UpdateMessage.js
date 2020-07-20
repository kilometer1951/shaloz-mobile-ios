import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,

} from 'react-native';


import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const UpdateMessage = (props) => {
  const {openUpdateMessage, setOpenUpdateMessage,updateMessage} = props;
  useEffect(() => {
    setTimeout(() => {
        setOpenUpdateMessage(false);
    }, 1000);
  }, []);

  return (
    openUpdateMessage && (
      <View
        style={{
          zIndex: 1,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.blue,
          shadowColor: 'black',
          shadowOpacity: 0.16,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 8,
          backgroundColor: Colors.blue,
          elevation: 5,
          borderRadius: 5,
          marginHorizontal: 20,
          marginBottom: 20,
          position: 'absolute',
          alignSelf:"center"
        }}>
         <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              color: '#fff',
              marginRight: 10,
              alignSelf:"center"
            }}>
            {updateMessage}
          </Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({});

export default UpdateMessage;
