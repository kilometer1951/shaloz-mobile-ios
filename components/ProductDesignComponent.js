import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  ActionSheetIOS,
  TextInput,
  Modal,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const ProductDesignComponent = (props) => {
  const dispatch = useDispatch();
  const {
    openSingleScreen,
    discount,
    main_image,
    product_name,
    product_price,
    openActionSheet,
  } = props;

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  const displayPrice = (product_price, discount) => {
    if (discount === '') {
      return product_price;
    } else {
      let price = parseInt(product_price);
      let _discount = parseInt(discount);

      let total_d = _discount / 100;
      let total_p = price * total_d;
      let total = price - total_p;

      return total;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        const userData = await AsyncStorage.getItem('@userData');

        if (!userData) {
          props.setIsNotAuthenticated(true);
          return;
        }
        openSingleScreen();
      }}>
      <View style={styles.productCard}>
        {discount !== '' && (
          <View style={styles.discountContainer}>
            <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
              {discount}% OFF
            </Text>
          </View>
        )}

        <View style={{backgroundColor:"#e1e4e8", borderTopLeftRadius: 5,borderTopRightRadius: 5}}>
          <Image
            source={{url: main_image}}
            style={{
              width: '100%',
              height: 150,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
            resizeMode="cover"
          />
        </View>
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                fontFamily: Fonts.poppins_regular,
                height: 49,
                fontSize: 15,
              }}>
              {product_name.trunc(35)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{marginTop: 2, flexDirection: 'row'}}>
              <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 18}}>
                ${displayPrice(product_price, discount)}
              </Text>
              {discount !== '' && (
                <Text style={styles.previousPrice}>${product_price}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={async () => {
                const userData = await AsyncStorage.getItem('@userData');

                if (!userData) {
                  props.setIsNotAuthenticated(true);
                  return;
                }
                openActionSheet();
              }}>
              <Icon name="ios-more" size={30} color={Colors.grey_darken} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  productCard: {
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    height: 245,
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    marginHorizontal: 8,
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
    fontSize: 18,
  },
});

export default ProductDesignComponent;
