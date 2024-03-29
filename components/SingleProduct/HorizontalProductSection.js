import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const HorizontalProductSection = (props) => {
  const {dataN, pressAction} = props;

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + ' . . .' : this;
    };

  const displayPrice = (product_price, discount) => {
    if (discount === '') {
      return parseFloat(product_price).toFixed(2);
    } else {
      let price = parseInt(product_price);
      let _discount = parseInt(discount);

      let total_d = _discount / 100;
      let total_p = price * total_d;
      let total = price - total_p;

      return total.toFixed(2);
    }
  };

  const renderItem_other_items = dataN.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={pressAction.bind(this, result.product._id)}>
        <View style={styles.otherItemsCard}>
          {result.product.discount !== '' && (
            <View style={styles.discountContainer}>
              <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                {result.product.discount}% OFF
              </Text>
            </View>
          )}
          <View
            style={{
              backgroundColor: '#e1e4e8',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}>
            <Image
              source={{uri: result.product.main_image}}
              style={{
                width: '100%',
                height: 150,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{padding: 7}}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
              {result.product.product_name.trunc(15)}
            </Text>
            <View style={{marginTop: 2, flexDirection: 'row'}}>
              <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 18}}>
                $
                {displayPrice(
                  result.product.product_price,
                  result.product.discount,
                )}
              </Text>
              {result.product.discount !== '' && (
                <Text style={styles.previousPrice}>
                  ${result.product.product_price.toFixed(2)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.otherItems}>
      <View style={{padding: 10, marginTop: 10}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 17,
          }}>
          {props.title}
        </Text>
      </View>
      <ScrollView
        horizontal={true}
        style={{marginTop: 5}}
        showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row'}}>
          {renderItem_other_items}
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('RecentlyViewed')}>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 50,
                alignSelf: 'center',
                marginRight: 40,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 17,
                  color: Colors.purple_darken,
                }}>
                See all
              </Text>
              <Icon
                name="ios-arrow-forward"
                size={20}
                style={{marginRight: 5, marginTop: 1, marginLeft: 15}}
                color={Colors.purple_darken}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  otherItems: {
    borderTopWidth: 0.4,
    borderTopColor: Colors.light_grey,
    paddingBottom: 30,
  },

  otherItemsCard: {
    marginRight: 10,
    width: 180,
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginLeft: 10,
    backgroundColor: '#fff',
    height: 215,
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
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

  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: 5,
    fontFamily: Fonts.poppins_regular,
    fontSize: 12,
    marginTop: 4,
  },
});

export default HorizontalProductSection;
