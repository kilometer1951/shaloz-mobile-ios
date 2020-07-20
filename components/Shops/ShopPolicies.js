import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ShopPolicies = (props) => {
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <View
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.light_grey,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            marginTop: 20,
            marginLeft: 10,
            fontFamily: Fonts.poppins_light,
            fontSize: 25,
          }}>
          Shop policies
        </Text>
       
      </View>

      <View style={{paddingHorizontal: 5, marginTop: 15}}>
        <Text
          style={{
            marginLeft: 11,
            fontFamily: Fonts.poppins_semibold,
          }}>
          Shipping
        </Text>

        <Text
          style={{
            marginLeft: 11,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 17,
          }}>
          Processing time
        </Text>
        <Text
          style={{
            marginLeft: 10,
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
          }}>
          The time I need to prepare an order for shipping varies.
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 5,
          marginTop: 15,
          borderTopWidth: 0.5,
          borderTopColor: Colors.light_grey,
          paddingTop: 10,
        }}>
        <Text
          style={{
            marginLeft: 11,
            fontFamily: Fonts.poppins_semibold,
          }}>
          Payment
        </Text>

        <Text
          style={{
            marginLeft: 11,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 17,
          }}>
          Secure Payment
        </Text>
        <Text
          style={{
            marginLeft: 10,
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
          }}>
          All payments are processed through Shaloz app using your debit or
          credit card. Merchants on Shaloz never receive your credit card
          information. For your security, all payments should be processed
          through the app to avoid fraudulent activity.
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 5,
          marginTop: 15,
          borderTopWidth: 0.5,
          borderTopColor: Colors.light_grey,
          paddingTop: 10,
        }}>
        <Text
          style={{
            marginLeft: 11,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 10,
          }}>
          Returns and exchanges
        </Text>

        <Text
          style={{
            marginLeft: 10,
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
          }}>
          All merchants on Shaloz gladly accept returns, exchanges, and
          cancellations. Just contact Shaloz within 7 days of delivery.
        </Text>

        <Text
          style={{
            marginLeft: 11,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 17,
          }}>
          Conditions of return
        </Text>

        <Text
          style={{
            marginLeft: 10,
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
          }}>
          Buyers are responsible for return shipping costs. If the item is not
          returned in its original condition, the buyer is responsible for any
          loss in value
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customButton: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    width: '60%',
    padding: 8,
    borderWidth: 1.6,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 40,
    marginTop: 20,
  },
});

export default ShopPolicies;
