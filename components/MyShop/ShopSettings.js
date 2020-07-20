import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkError from '../NetworkError';

const ShopSettings = (props) => {
  const dispatch = useDispatch();
  const [networkError, setNetworkError] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ChangeShopLogo')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Update logo
                </Text>
              </View>
              <Icon
                name="ios-arrow-forward"
                style={{paddingRight: 20, marginTop: 3}}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ShippingPromo')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Shipping promotions
                </Text>
              </View>
              <Icon
                name="ios-arrow-forward"
                style={{paddingRight: 20, marginTop: 3}}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('DiscountPromo')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Discount promotions
                </Text>
              </View>
              <Icon
                name="ios-arrow-forward"
                style={{paddingRight: 20, marginTop: 3}}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('CompletedOrders')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Completed orders
                </Text>
              </View>
              <Icon
                name="ios-arrow-forward"
                style={{paddingRight: 20, marginTop: 3}}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('SellerShippingLocation')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                 Change shop location/shop name
                </Text>
              </View>
              <Icon
                name="ios-arrow-forward"
                style={{paddingRight: 20, marginTop: 3}}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity onPress={() => props.setOpenCategoryModal(true)}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Update shop categories
                </Text>
              </View>
              <Icon
                name="ios-arrow-forward"
                style={{paddingRight: 20, marginTop: 3}}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>

        {networkError && (
          <NetworkError
            networkError={networkError}
            setNetworkError={setNetworkError}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default ShopSettings;
