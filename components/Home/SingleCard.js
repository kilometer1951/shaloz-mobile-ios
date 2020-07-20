import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const SingleCard = (props) => {
  return (
    <View style={styles.dealProductCard}>
      <View style={{backgroundColor:"#e1e4e8", borderTopLeftRadius: 5,borderTopRightRadius: 5}}>
       
        <TouchableOpacity
          onPress={async () => {
            const userData = await AsyncStorage.getItem('@userData');

            if (!userData) {
              props.setIsNotAuthenticated(true);
              return;
            }
             props.navigation.navigate('Deals',{backTitle:"Back"})
          }}>
          <Image
            source={require('../../assets/image3.jpg')}
            style={{
              width: '100%',
              height: 270,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dealProductsBottomView}>
        <View>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 25}}>
            Everyday Deals
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
            Get the things you need while supporting small businesses
          </Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            const userData = await AsyncStorage.getItem('@userData');

            if (!userData) {
              props.setIsNotAuthenticated(true);
              return;
            }
            props.navigation.navigate('Deals',{backTitle:"Back"});
          }}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text
              style={{
                marginTop: 4,
                fontFamily: Fonts.poppins_medium,
                fontSize: 16,
              }}>
              See more
            </Text>
            <Icon
              name="ios-arrow-round-forward"
              size={30}
              style={{marginLeft: 10}}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dealProductCard: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 40,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    marginHorizontal: 10,
    elevation: 5,
    height: 430,
    marginBottom: 20,
  },
  dealProductsBottomView: {
    padding: 20,
  },
  discountContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    marginTop: 5,
    marginLeft: 5,
    padding: 2,
    borderRadius: 5,
    opacity: 0.7,
  },
});

export default SingleCard;
