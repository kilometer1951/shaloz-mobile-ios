import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Moment from 'moment';
import Icons from 'react-native-vector-icons/Ionicons';
import NetworkError from '../NetworkError';

const HomeOrderSection = (props) => {
  const dispatch = useDispatch();
  const shop_orders = useSelector((state) => state.appReducer.shop_orders);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const user = useSelector((state) => state.authReducer.user);

  const today = Moment(new Date()).format('MMM DD');

  useEffect(() => {
    const fetchShopOrderData = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchShopOrderData(user._id, 1));
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchShopOrderData();
  }, []);

  const renderOrders = shop_orders.slice(0, 3).map((data, index) => {
    return (
      <TouchableWithoutFeedback key={index}>
        <View
          style={{
            marginTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icons name="ios-cart" size={20} color={Colors.pink} />
              <Text style={styles.textStyle}>{data.user.first_name}</Text>
            </View>
            <Text style={styles.textStyle}>
              $
              {(parseFloat(data.total) -( parseFloat(data.processing_fee) + parseFloat(data.tax))).toFixed(
              2,
            )}
            </Text>
          </View>

          <View style={{paddingHorizontal: 19}}>
            <Text style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
              Order - {data.items.length} item(s)
            </Text>
          </View>

          <View style={{paddingHorizontal: 19}}>
            <Text style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
              {data.shipping_details}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  let viewToRender;

  if (shop_orders.length === 0) {
    viewToRender = (
      <View style={{alignItems: 'center', marginTop: 23, marginBottom: 20, height:130}}>
        {isLoading ? (
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        ) : (
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              color: Colors.grey_darken,
              marginTop:50
            }}>
            You have no orders yet
          </Text>
        )}
      </View>
    );
  } else {
    viewToRender = (
      <View style={{marginTop: 10, marginBottom: 20}}>
        {isLoading ? (
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        ) : (
          renderOrders
        )}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 18,
          }}>
          Orders
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 18,
          }}>
          Today{' '}
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              color: Colors.grey_darken,
            }}>
            {' '}
            {today}
          </Text>
        </Text>
      </View>
      <View style={{flex: 1}}>{viewToRender}</View>
      <View
        style={{
          borderTopWidth: 0.5,
          width: '100%',

          borderTopColor: Colors.light_grey,
        }}>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate('MyShopOrders')}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 14,
                paddingTop: 15,
              }}>
              View more
            </Text>
            <View style={{marginTop: 14, marginLeft: 10}}>
              <Icons name="md-arrow-round-forward" size={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
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
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    marginTop: 1,
  },
  textStyle: {
    fontFamily: Fonts.poppins_regular,
    marginLeft: 10,
  },
});

export default HomeOrderSection;
