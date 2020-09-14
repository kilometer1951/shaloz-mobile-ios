import React, {memo, useState, useEffect} from 'react';
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
import UpdatingLoader from '../../UpdatingLoader';
import CartPlaceHolder from '../../CartPlaceHolder';
import Moment from 'moment';
//import {Tooltip} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../../contants/Fonts';
import Colors from '../../../contants/Colors';
import * as appActions from '../../../store/actions/appActions';
import NetworkError from '../../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import UpdateMessage from '../../UpdateMessage';
import FastImage from 'react-native-fast-image';

import ToolTip from '../../../Modal/ToolTip';

const SellerWeeklyActivityPureComponent = (props) => {
  const {
    item,
    openAlertModal,
    handleLoadMore,
    calculateDiscount,
    calculateTotalDiscount,
    calculateVariant,
    orderTotal,
    clientPaid,
    toolTipVisible,
    setToolTipVisible,
    textToRender,
    setTextToRender,
  } = props;

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

  return (
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
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          onPress={openAlertModal.bind(
            this,
            item,
            item.user.email,
            (
              parseFloat(item.total) -
              parseFloat(item.processing_fee) -
              parseFloat(item.tax)
            ).toFixed(2),
          )}>
          <Icon name="ios-more" size={30} />
        </TouchableOpacity>
      </View>
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
            flexWrap: 'wrap',
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

            <TouchableOpacity
              style={styles.touchable}
              onPress={() => {
                setTextToRender(
                  'Total = (Qty * Price + Variant Price) :- of each product + Shipping total - any discounts + any points redeemed - Shaloz platform fee.',
                );
                setToolTipVisible(true);
              }}>
              <Icon
                name="ios-help-circle"
                size={20}
                style={{marginTop: 4, marginLeft: 5, marginTop: 12}}
                color={Colors.purple_darken}
              />
            </TouchableOpacity>
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
};

const styles = StyleSheet.create({
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

export default memo(SellerWeeklyActivityPureComponent);
