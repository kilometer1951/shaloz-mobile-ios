import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import UpdatingLoader from '../UpdatingLoader';
import CartPlaceHolder from '../CartPlaceHolder';
import Moment from 'moment';
import {Tooltip} from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import UpdateMessage from '../UpdateMessage';
import FastImage from 'react-native-fast-image';

const CompletedOrdersComponent = (props) => {
  const dispatch = useDispatch();
  const completed_orders = useSelector(
    (state) => state.appReducer.completed_orders,
  );
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const endOfFile_completed_orders = useSelector(
    (state) => state.appReducer.endOfFile_completed_orders,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);
  const [networkError, setNetworkError] = useState(false);

  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

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

  const openAlertModal = (cart_id) => {
    Alert.alert(
      'Help',
      '',

      [
        {
          text: 'Help',
          onPress: () => {
            Linking.openURL(
              'mailto:support@shaloz.com?cc=&subject=Issue with OrderID' +
                cart_id +
                '&body=My orderID is ' +
                cart_id +
                ' ......',
            );
          },
        },

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchCompletedOrderData(user._id, 1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    console.log(endOfFile_completed_orders);

    try {
      if (!endOfFile_completed_orders) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(
            appActions.handleLoadMoreCompletedOrderData(user._id, page),
          );
          setIsLoadingMoreData(false);
          setPage((prev) => (prev = prev + 1));
        }
      }
    } catch (e) {
      setIsLoadingMoreData(false);
      setNetworkError(true);
    }
  };

  const getPricePerItem = (price, qty) => {
    return (parseInt(qty) * parseFloat(price)).toFixed(2);
  };

  const calculateDiscount = (items) => {
    let total_discount = 0.0;
    for (let i = 0; i < items.length; i++) {
      let discount =
        items[i].discount !== '' ? parseFloat(items[i].discount) : 0.0;
      total_discount += discount;
    }

    return total_discount.toFixed(2);
  };

  const calculateTotalDiscount = (cart) => {
    let discount_from_items = parseFloat(calculateDiscount(cart.items));
    let store_discount = cart.store_promotion_discount_is_applied
      ? parseFloat(cart.store_promotion_discount)
      : 0.0;

    return (discount_from_items + store_discount).toFixed(2);
  };

  const calculateVariant = (selected_variant_value) => {
    let total = 0.0;
    for (let i = 0; i < selected_variant_value.length; i++) {
      let price = parseFloat(selected_variant_value[i].price);
      total += price;
    }
    return total;
  };

  const orderTotal = (cart) => {
    let total = 0.0;
    for (let i = 0; i < cart.items.length; i++) {
      let price =
        parseFloat(cart.items[i].price) +
        parseFloat(
          cart.items[i].discount !== '' ? cart.items[i].discount : 0.0,
        ) +
        parseFloat(calculateVariant(cart.items[i].selected_variant_value));

      total += price;
    }
    return (parseFloat(total) + parseFloat(cart.shippment_price)).toFixed(2);
  };

  const clientPaid = (cart) => {
    let total =
      parseFloat(orderTotal(cart)) + parseFloat(cart.amount_in_cash_redeemed);
    return (
      parseFloat(total) - parseFloat(calculateTotalDiscount(cart))
    ).toFixed(2);
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

  const renderProducts = (items, cart_id) => {
    return items.map((result, index) => {
      return (
        <View style={styles.itemsCard} key={index}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {displayVariants(result.selected_variant_value)}
          </ScrollView>
          <View
            style={{
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <View
              style={{
                padding: 10,
                width: '100%',
                flexDirection: 'row',
              }}>
              <View style={{width: '70%', flexDirection: 'row'}}>
                <View style={{width: '35%'}}>
                  <FastImage
                    source={{
                      uri: result.product.main_image,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: '100%',
                      height: 100,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={{width: '70%', marginLeft: 5}}>
                  <Text
                    style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
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
                      Qty in your shop : {result.product.product_qty}
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
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 18,
                    alignSelf: 'flex-end',
                  }}>
                  ${parseFloat(result.price).toFixed(2)}
                </Text>
              </View>
            </View>

            {result.product_personalization_note !== '' && (
              <View style={{padding: 10}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  {result.product_personalization_note}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    });
  };

  const renderItem = ({item}) => (
    <View
      style={{
        marginBottom: 15,
        padding: 10,
        shadowOpacity: 0.8,
        shadowOffset: {width: 0, height: 0.5},
        shadowRadius: 1,
        elevation: 5,
        backgroundColor: '#fff',
        marginRight: 1,
        shadowColor: Colors.grey_darken,
        marginTop: 5,
        paddingBottom: 20,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
          Date shipped
        </Text>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
          {Moment(item.date_entered_tracking).format('MMM DD, YYYY')}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            Bought by
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 16}}>
            {item.user.first_name + ' ' + item.user.last_name}
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            OrderID - {item._id}
          </Text>
        </View>
        <TouchableOpacity onPress={openAlertModal.bind(this, item._id)}>
          <Icon name="ios-more" size={30} />
        </TouchableOpacity>
      </View>

      {renderProducts(item.items, item._id)}
      <Text
        style={{
          fontFamily: Fonts.poppins_light,
          fontSize: 15,
          fontWeight: '400',
          marginTop: 10,
        }}>
        {item.expected_arrival_date === ''
          ? 'Arrival date pending'
          : ' Estimated Arrival date ' +
            Moment(new Date(item.expected_arrival_date)).format('MMM DD, YYYY')}
      </Text>
      <View
        style={{
          borderTopWidth: 0.4,
          marginTop: 15,
          borderTopColor: Colors.light_grey,
        }}>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 18,
            marginTop: 10,
          }}>
          Order Details
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            flexWrap: '',
            borderBottomWidth: 0.4,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 15,
              marginTop: 10,
            }}>
            Shipping total (estimated from usps)
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              marginTop: 10,
            }}>
            {item.shippment_price === '0.00'
              ? 'Promotion'
              : '$' + item.shippment_price}
          </Text>
        </View>
        {item.buyer_hasRedeemedPoints && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 15,
                marginTop: 10,
              }}>
              Points (Paid By Shaloz)
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
              }}>
              ${item.amount_in_cash_redeemed}
            </Text>
          </View>
        )}

        {item.discount_applied === 'true' && (
          <View>
            {item.store_promotion_discount_is_applied && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 15,
                    marginTop: 10,
                  }}>
                  Store discount(%{item.store_promotion_discount_percentage} of
                  initial price)
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 15,
                    marginTop: 10,
                  }}>
                  -${item.store_promotion_discount}
                </Text>
              </View>
            )}

            {calculateDiscount(item.items) != '0.00' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 15,
                    marginTop: 10,
                  }}>
                  Discount from items
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 15,
                    marginTop: 10,
                  }}>
                  -${calculateDiscount(item.items)}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 15,
                  marginTop: 10,
                }}>
                Total Discount
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                  marginTop: 10,
                }}>
                -$
                {calculateTotalDiscount(item)}
              </Text>
            </View>
          </View>
        )}

        <View style={{borderTopWidth: 0.5, borderTopColor: Colors.light_grey}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 15,
                marginTop: 10,
              }}>
              Order Total
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
              }}>
              ${orderTotal(item)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            borderTopWidth: 0.4,
            borderTopColor: Colors.light_grey,
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 15,
              marginTop: 10,
            }}>
            Platform fee (includes bank deposit fee)
          </Text>
          {item.theshop_takes === '' ? (
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
                color: 'green',
              }}>
              Pending
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
              }}>
              -${item.theshop_takes}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 15,
              marginTop: 10,
            }}>
            You received
          </Text>
          {item.seller_takes === '0.00' ? (
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
                color: 'green',
              }}>
              Pending
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
              }}>
              ${item.seller_takes}
            </Text>
          )}
        </View>

        <View
          style={{
            borderTopWidth: 0.4,
            marginTop: 15,
            borderTopColor: Colors.light_grey,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 20,
                marginTop: 10,
              }}>
              Client Paid ({item.items.length} item(s)):
            </Text>
            <Tooltip
              popover={
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  Total = (Qty * Price) + Variant Price :- of each product +
                  Shipping total
                </Text>
              }
              backgroundColor={Colors.purple_darken}
              height={150}
              width={400}>
              <Icon
                name="ios-help-circle"
                size={20}
                style={{marginTop: 4, marginLeft: 5, marginTop: 12}}
                color={Colors.purple_darken}
              />
            </Tooltip>
          </View>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              marginTop: 10,
            }}>
            ${clientPaid(item)}
          </Text>
        </View>
      </View>
    </View>
  );
  let view;
  if (completed_orders.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 20,
            textAlign: 'center',
            padding: 20,
          }}>
          No data to show yet
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
              title="Pull to refresh"
              tintColor="#000"
              titleColor="#000"
            />
          }
          style={{marginBottom: 10}}
          showsVerticalScrollIndicator={false}
          data={completed_orders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          onMomentumScrollBegin={() => {
            handleLoadMore();
          }}
          ListFooterComponent={
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                alignSelf: 'center',
              }}>
              {isLoadingMoreData && (
                <MaterialIndicator color={Colors.purple_darken} size={30} />
              )}
              {endOfFile_completed_orders && completed_orders.length > 16 && (
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    color: Colors.grey_darken,
                  }}>
                  No more data to load
                </Text>
              )}
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {isLoading ? <CartPlaceHolder /> : view}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {isUpdating && <UpdatingLoader />}
      {openUpdateMessage && (
        <UpdateMessage
          openUpdateMessage={openUpdateMessage}
          setOpenUpdateMessage={setOpenUpdateMessage}
          updateMessage={updateMessage}
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

  itemsCard: {
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    marginTop: 5,
  },
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
    alignSelf: 'flex-end',
  },
});

export default CompletedOrdersComponent;
