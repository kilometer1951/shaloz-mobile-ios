import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  
  TouchableOpacity,
  
  SafeAreaView,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {DotIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import ViewPager from '@react-native-community/viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkError from '../components/NetworkError';
import UpdatingLoader from '../components/UpdatingLoader';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet} from 'native-base';
import {MaterialIndicator} from 'react-native-indicators';

import * as appActions from '../store/actions/appActions';

const DiscountPromScreen = (props) => {
  const dispatch = useDispatch();
  const [networkError, setNetworkError] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [
    offers_discount_on_price_threshold,
    setOffers_discount_on_price_threshold,
  ] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [updateButton, setUpdateButton] = useState(false);

  const [max_items_to_get_discount, setMax_items_to_get_discount] = useState(
    '',
  );
  const [
    discount_amount_for_threshold,
    setDiscount_amount_for_threshold,
  ] = useState('');

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        setIsloading(true);
        const response = await appActions.fetchPromo(user._id);
        setIsloading(false);
        setOffers_discount_on_price_threshold(
          response.shop.offers_discount_on_price_threshold,
        );
        setMax_items_to_get_discount(response.shop.max_items_to_get_discount);
        setDiscount_amount_for_threshold(
          response.shop.discount_amount_for_threshold,
        );
      } catch (e) {
        setIsloading(false);

        setNetworkError(true);
      }
    };
    fetchPromo();
  }, []);

  const update = () => {
    try {
      appActions.updateDiscountPromo(
        user._id,
        offers_discount_on_price_threshold,
        max_items_to_get_discount,
        discount_amount_for_threshold,
      );
      props.navigation.goBack();
    } catch (e) {
      setNetworkError(true);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Shop
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Discount promotion
            </Text>
          </View>
          <View style={{width: '20%'}}>
            {!isLoading && updateButton && (
              <TouchableOpacity onPress={update}>
                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontSize: 17,
                      marginRight: 10,
                      fontFamily: Fonts.poppins_regular,
                      color: 'blue',
                    }}>
                    update
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
      {isLoading ? (
        <View style={{marginTop: '30%'}}>
          <MaterialIndicator color={Colors.purple_darken} />
        </View>
      ) : (
        <View style={{padding: 10}}>
          <TouchableOpacity
            onPress={() => {
              setUpdateButton(true);
              setMax_items_to_get_discount('');
              setDiscount_amount_for_threshold('');
              setOffers_discount_on_price_threshold((prev) => {
                let _prev = !prev;
                return _prev;
              });
            }}>
            <View>
              <View style={{flexDirection: 'row', marginTop: 15, flexWrap:"wrap"}}>
                <View style={{width:"20%"}}>
                {offers_discount_on_price_threshold ? (
                  <Icon
                    name="md-checkbox-outline"
                    size={35}
                    color={Colors.grey_darken}
                  />
                ) : (
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 2,
                      borderColor: Colors.grey_darken,
                      borderRadius: 2,
                    }}
                  />
                )}
                </View>

               <View style={{width:"74%"}}>
               <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 20,
                    marginLeft: 10,
                  }}>
                  Apply discount above item threshold (A customer buys 3
                  items they get a certain applied discount off)
                </Text>
               </View>
              </View>
            </View>
          </TouchableOpacity>
          {offers_discount_on_price_threshold && (
            <View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_semibold,
                    marginTop: 10,
                  }}>
                  Item threshold
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    fontSize: 20,
                    fontFamily: Fonts.poppins_regular,
                    padding: 10,
                    borderColor: Colors.light_grey,
                    borderRadius: 5,
                  }}
                  value={max_items_to_get_discount}
                  keyboardType="number-pad"
                  onChangeText={(value) => {
                    setUpdateButton(true);
                    setMax_items_to_get_discount(value);
                  }}
                  autoFocus={true}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_semibold,
                    marginTop: 10,
                  }}>
                  Discount to apply
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    fontSize: 20,
                    fontFamily: Fonts.poppins_regular,
                    padding: 10,
                    borderColor: Colors.light_grey,
                    borderRadius: 5,
                  }}
                  value={discount_amount_for_threshold}
                  keyboardType="number-pad"
                  onChangeText={(value) => {
                    setUpdateButton(true);
                    setDiscount_amount_for_threshold(value);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      )}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
  },
  headerRow: {
    width: '60%',
  },
  imageContainer: {
    width: 250,
    height: 220,
    borderColor: 'black',
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
export default DiscountPromScreen;
