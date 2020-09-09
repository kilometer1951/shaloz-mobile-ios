import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Moment from 'moment';
import Icons from 'react-native-vector-icons/Ionicons';
import NetworkError from '../NetworkError';

const CompletedOrderSection = (props) => {
  const dispatch = useDispatch();
  const completed_orders = useSelector(
    (state) => state.appReducer.completed_orders,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const user = useSelector((state) => state.authReducer.user);

  const [activity, setActivity] = useState(false);

  // const today = Moment(new Date()).format('MMM DD');

  useEffect(() => {
    const fetchCompletedOrderData = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchCompletedOrderData(user._id, 1));
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchCompletedOrderData();
  }, []);

  const getPricePerItem = (price, qty) => {
    return (parseInt(qty) * parseFloat(price)).toFixed(2);
  };
  const displayVariants = (selected_variant_value) => {
    return selected_variant_value.map((result, index, array) => {
      return (
        <View
          style={{
            padding: 5,
            backgroundColor: '#eeeeee',
            marginTop: 5,
            borderRadius: 20,
            marginLeft: 10,
            marginTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          key={index}>
          <Text>
            {result.name}: {result.content} (+${result.price})
          </Text>
        </View>
      );
    });
  };
  const renderProducts = (items, expected_arrival_date) => {
    return items.map((result, index) => {
      return (
        <View style={styles.itemsCard} key={index}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {displayVariants(result.selected_variant_value)}
          </ScrollView>
          <View
            style={{
              padding: 10,
              width: '100%',
              flexDirection: 'row',
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <View style={{width: '70%', flexDirection: 'row'}}>
              <View style={{width: '30%'}}>
                <Image
                  source={{uri: result.product.main_image}}
                  style={{
                    width: '100%',
                    height: 100,
                  }}
                  resizeMode="contain"
                />
              </View>
              <View style={{width: '70%', marginLeft: 5}}>
                <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
                  {result.product.product_name}
                </Text>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: '#eeeeee',
                    marginTop: 5,
                    borderRadius: 20,
                    width: 155,
                  }}>
                  <Text style={{fontFamily: Fonts.poppins_regular}}>
                    Qty bought : {result.qty}
                  </Text>
                </View>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: '#fbe9e7',
                    marginTop: 5,
                    borderRadius: 20,
                    width: 180,
                  }}>
                  <Text style={{fontFamily: Fonts.poppins_regular}}>
                    Arrival date{' '}
                    {Moment(new Date(expected_arrival_date)).format('MMM DD')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{width: '30%', alignSelf: 'flex-end'}}>
              {result.discount !== '' && (
                <Text style={styles.previousPrice}>
                  $
                  {(
                    parseFloat(result.price) + parseFloat(result.discount)
                  ).toFixed(2)}
                </Text>
              )}
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                  alignSelf: 'flex-end',
                }}>
                ${parseFloat(result.price).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const renderOrders = completed_orders.slice(0, 3).map((data, index) => {
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
              <Icons name="ios-stats" size={20} color={Colors.pink} />
              <Text style={styles.textStyle}>{data.user.first_name}</Text>
            </View>
          </View>

          <View style={{paddingHorizontal: 19}}>
            <Text style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
              Order - {data.items.length} item(s)
            </Text>
          </View>

          <View style={{paddingHorizontal: 19}}>
            {renderProducts(data.items, data.expected_arrival_date)}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  let viewToRender;

  if (completed_orders.length === 0) {
    viewToRender = (
      <View
        style={{
          alignItems: 'center',
          marginTop: 23,
          marginBottom: 20,
          height: 150,
        }}>
        {isLoading ? (
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        ) : (
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              color: Colors.grey_darken,
              marginTop: 50,
            }}>
            No data to show
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
          Completed Orders
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
          onPress={() => props.navigation.navigate('CompletedOrders')}>
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
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontFamily: Fonts.poppins_regular,
    fontSize: 13,
    alignSelf: 'flex-end',
  },
});

export default CompletedOrderSection;
