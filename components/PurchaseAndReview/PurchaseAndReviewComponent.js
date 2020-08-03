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
  Share,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import UpdatingLoader from '../UpdatingLoader';
import {ActionSheet} from 'native-base';
import {Tooltip} from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import FastImage from 'react-native-fast-image';

let BUTTONS = ['Cancel', 'Visit shop', 'Help'];
let CANCEL_INDEX = 0;

const PurchaseAndReviewComponent = (props) => {
  const dispatch = useDispatch();
  const {
    product_id,
    setproduct_id,
    setOpenReviewModal,
    product_name,
    setProduct_name,
    setShop_name,
    setShop_id,
    setViewToRender,
  } = props;
  const purchased_orders = useSelector(
    (state) => state.appReducer.purchased_orders,
  );
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const endOfFile_purchase_package = useSelector(
    (state) => state.appReducer.endOfFile_purchase_package,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);
  const [networkError, setNetworkError] = useState(false);

  const openReviewProductModal = async (product_id, product_name) => {
    //dispatch selected cart
    setViewToRender('product');
    setProduct_name(product_name);
    setproduct_id(product_id);
    setOpenReviewModal(true);
  };

  const openReviewShop = (shop_id, shop_name) => {
    setViewToRender('shop');
    setShop_name(shop_name);
    setShop_id(shop_id);
    setOpenReviewModal(true);
  };

  const openAlertModal = (cart_id, seller_id, seller_email, shop_name) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          props.navigation.navigate('Shops', {
            headerTile: 'Shop',
            backTitle: 'Purchase',
            seller_id: seller_id,
          });
        } else if (buttonIndex === 2) {
          Linking.openURL(
            'mailto:support@shaloz.com?cc=&subject=Issue with OrderID' +
              cart_id +
              '&body=My orderID is ' +
              cart_id +
              ' ......',
          );
        }
      },
    );
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchPurchasedPackage(user._id, 1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_purchase_package) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(
            appActions.handleLoadMorePurchaseOrders(user._id, page),
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
            {result.name}: {result.content}(+${result.price})
          </Text>
        </View>
      );
    });
  };

  const onShareProduct = async (product_name, shop_name, product_id) => {
    try {
      const result = await Share.share({
        message: `Check this product out - ${product_name} from ${shop_name} on Shaloz. shaloz://product/${product_id}`,
        url: 'http://appstore.com/shaloz',
        title: 'Download the Shaloz app and visit this shop ' + shop_name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);

          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onShareShop = async (shop_name, shop_id) => {
    try {
      const result = await Share.share({
        message: `Visit ${shop_name} on Shaloz, they have really cool and discounted products you might be interested in. shaloz://shop/${shop_id}`,
        url: 'http://appstore.com/shaloz',
        title: 'Download the Shaloz app and visit this shop ' + shop_name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);

          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const renderProducts = (items, cart_id, order_shipped, shop_name) => {
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
              <View style={{width: '80%', flexDirection: 'row'}}>
                <View style={{width: '30%'}}>
                  <FastImage
                    source={{uri: result.product.main_image, priority: FastImage.priority.high}}
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
                      Qty in your cart: {result.qty}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{width: '20%', alignSelf: 'flex-end'}}>
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
              <View style={{paddingLeft: 10}}>
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

          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {order_shipped && (
              <TouchableOpacity
                onPress={openReviewProductModal.bind(
                  this,
                  result.product._id,
                  result.product.product_name,
                )}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 16,
                    color: Colors.purple_darken,
                  }}>
                  Review product
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onShareProduct.bind(
                this,
                result.product.product_name,
                shop_name,
                result.product._id,
              )}>
              <View style={{alignSelf: 'flex-end', marginRight: 10}}>
                <Icon name="md-share" size={23} color={Colors.purple_darken} />
              </View>
            </TouchableOpacity>
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            Sold by
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 16}}>
            {item.seller.first_name + ' ' + item.seller.last_name}
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            OrderID: {item._id}
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            Tracking Number:{' '}
            {item.tracking_number === ''
              ? 'Tracking number pending'
              : item.tracking_number}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={onShareShop.bind(
              this,
              item.seller.shop_name,
              item.seller._id,
            )}>
            <View style={{marginRight: 25, marginTop: 4}}>
              <Icon name="md-share" size={23} color={Colors.purple_darken} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openAlertModal.bind(
              this,
              item._id,
              item.seller._id,
              item.seller.email,
              item.seller.shop_name,
            )}>
            <Icon name="ios-more" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      {renderProducts(
        item.items,
        item._id,
        item.order_shipped,
        item.seller.shop_name,
      )}

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
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 15,
              marginTop: 10,
            }}>
            Processing fee
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              marginTop: 10,
            }}>
            ${item.processing_fee}
          </Text>
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
           Sales Tax
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              marginTop: 10,
            }}>
            ${item.tax}
          </Text>
        </View>
        {item.discount_applied != '0.00' && (
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
              Discount
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
              }}>
              -${item.discount_applied}
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

        <View style={{borderTopWidth: 0.5, borderTopColor: Colors.light_grey}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 17,
              marginTop: 10,
            }}>
            Shipping details
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              marginTop: 10,
            }}>
            {item.shipping_details}, United States
          </Text>
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
              Order total ({item.items.length} item(s)):
            </Text>
            <Tooltip
              popover={
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  Total = (Qty * Price) + Variant Price  :- of each
                  product + Processing fee + Shipping total + Sales tax
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
            ${item.total}
          </Text>
        </View>
        {item.order_shipped && (
          <TouchableOpacity
            onPress={openReviewShop.bind(
              this,
              item.seller._id,
              item.seller.shop_name,
            )}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 10,
                backgroundColor: Colors.purple_darken,
                marginTop: 10,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 18,
                  alignSelf: 'center',
                  color: '#fff',
                }}>
                Review shop
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
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
        data={purchased_orders}
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
            {endOfFile_purchase_package && purchased_orders.length > 16 && (
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
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {isLoading && <UpdatingLoader />}
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
});

export default PurchaseAndReviewComponent;
