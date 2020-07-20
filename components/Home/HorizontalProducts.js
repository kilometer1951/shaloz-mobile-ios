import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';

const HorizontalProducts = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const {dataN} = props;

  const renderItems = dataN.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');
          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }
           props.navigation.navigate('SingleProduct', {product_id: result._id})
        }}>
        <View style={{marginLeft: 10, backgroundColor:"#e1e4e8", borderRadius:5}}>
          {result.discount !== '' && (
            <View style={styles.discountContainer}>
              <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                {result.discount}% OFF
              </Text>
            </View>
          )}
          <Image
            source={{url: result.main_image}}
            style={{
              width: 170,
              height: 120,
              borderRadius: 5,
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          marginTop: 10,
        }}>
        <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
          {props.heading}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const userData = await AsyncStorage.getItem('@userData');

            if (!userData) {
              props.setIsNotAuthenticated(true);
              return;
            }
            props.navigation.navigate('ProductCategory', {
              backTitle: 'Home',
              headerTile: props.heading,
              main_cat: props.heading,
              sub_cat_one: '',
              sub_cat_two: '',
            });
          }}>
          <Text style={{color: Colors.blue, marginTop: 4}}>See more</Text>
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView
          horizontal={true}
          style={{marginTop: 5}}
          showsHorizontalScrollIndicator={false}>
          {renderItems}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default HorizontalProducts;
