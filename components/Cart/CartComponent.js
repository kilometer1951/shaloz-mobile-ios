import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import UpdatingLoader from '../UpdatingLoader';
import {ActionSheet} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import CheckoutModal from './CheckoutModal';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import {Tooltip} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

var BUTTONS = ['Cancel', 'Visit shop', 'Delete Cart'];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 0;
const CartComponent = (props) => {
  const dispatch = useDispatch();
  const {setEditItemData, setOpenInfoModal} = props;
  const [hasNote, setHasNote] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const cart_data = useSelector((state) => state.appReducer.cart_data);
  const user = useSelector((state) => state.authReducer.user);
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const endOfFile_cart_data = useSelector(
    (state) => state.appReducer.endOfFile_cart_data,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);
  const [networkError, setNetworkError] = useState(false);

  const proceedToCheckOut = async (cart) => {
    //dispatch selected cart
    dispatch(appActions.selectedCart(cart));
    setOpenCheckoutModal(true);
  };

  const displayPrice = (product_price, discount) => {
    if (discount === '') {
      return parseFloat(product_price);
    } else {
      let price = parseInt(product_price);
      let _discount = parseInt(discount);

      let total_d = _discount / 100;
      let total_p = price * total_d;
      let total = price - total_p;

      return total;
    }
  };

  const removeCart = async (cart_id) => {
    Alert.alert(
      'Are you sure?',
      '',

      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await appActions.removeCart(user._id, cart_id);
              await dispatch(appActions.fetchCartData(user._id, 1));
              setIsLoading(false);
            } catch (e) {
              console.log(e);
              setIsLoading(false);
              setNetworkError(true);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const openActionSheet = (cart_id, seller_email, shop_name, seller_id) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          props.navigation.push('Shops', {
            headerTile: 'Shop',
            backTitle: 'Cart',
            seller_id: seller_id,
          });
        } else if (buttonIndex === 2) {
          removeCart(cart_id);
        }
      },
    );
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchCartData(user._id, 1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_cart_data) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(appActions.handleLoadMoreCartData(user._id, page));
          setIsLoadingMoreData(false);
          setPage((prev) => (prev = prev + 1));
        }
      }
    } catch (e) {
      setIsLoadingMoreData(false);
      setNetworkError(true);
    }
  };

  const openInfoModalAction = (
    selected_variant_value,
    product_id,
    item_id,
    product_qty,
    productHasVariant,
    cart_id,
    product_can_be_customized,
    product_personalization_note,
    product_name,
  ) => {
    const data = {
      selected_variant_value,
      product_id,
      item_id,
      product_qty,
      productHasVariant: productHasVariant.length !== 0 ? true : false,
      cart_id,
      product_can_be_customized,
      product_personalization_note,
      product_name,
    };
    setEditItemData(data);
    setOpenInfoModal(true);
  };

  const getPricePerItem = (price, qty) => {
    return (parseInt(qty) * parseFloat(price)).toFixed(2);
  };

  const removeCartItem = (cart_id, item_id) => {
    Alert.alert(
      'Are you sure?',
      '',

      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await appActions.removeCartItem(user._id, cart_id, item_id);
              await dispatch(appActions.fetchCartData(user._id, 1));
              setIsLoading(false);
            } catch (e) {
              console.log(e);
              setIsLoading(false);
              setNetworkError(true);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getTotalProgress = (item) => {
    let count_sub_total = 0;
    let variantsTotal = 0;
    for (let i = 0; i < item.length; i++) {
      for (let j = 0; j < item[i].selected_variant_value.length; j++) {
        let pricePerVariant = parseFloat(
          item[i].selected_variant_value[j].price,
        );
        variantsTotal += parseFloat(pricePerVariant);
      }
      let pricePerItem;
      const product_price_total =
        parseFloat(item[i].product.product_price) + variantsTotal;

      // if (item[i].product.discount !== "") {

      const discount =
        (product_price_total *
          parseFloat(
            item[i].product.discount === '' ? 0 : item[i].product.discount,
          )) /
        100;

      const newTotal = product_price_total - parseFloat(discount);

      pricePerItem = parseFloat(newTotal) * parseInt(item[i].qty);

      count_sub_total += parseFloat(pricePerItem);
    }

    return count_sub_total.toFixed(2);
  };

  const getItemTotal = (item) => {
    let count_sub_total = 0;
    let variantsTotal = 0;
    for (let i = 0; i < item.length; i++) {
      for (let j = 0; j < item[i].selected_variant_value.length; j++) {
        let pricePerVariant = parseFloat(
          item[i].selected_variant_value[j].price,
        );
        variantsTotal += parseFloat(pricePerVariant);
      }
      let pricePerItem;
      const product_price_total = parseFloat(item[i].product.product_price);

      pricePerItem = product_price_total * parseInt(item[i].qty);

      count_sub_total += parseFloat(pricePerItem);
    }

    return (variantsTotal + count_sub_total).toFixed(2);
  };

  const calculate_discount_total = (item) => {
    let count = 0;
    for (let i = 0; i < item.length; i++) {
      let discount = 0;
      if (item[i].product.discount !== '') {
        discount =
          parseFloat(item[i].product.product_price) *
          (parseFloat(item[i].product.discount) / 100);
      }
      count += discount;
    }
    return count.toFixed(2);
  };

  const getTotalDiscountApplied = (result) => {
    let total = 0;

    if (result.seller.offers_discount_on_price_threshold) {
      const totalItems =
        parseInt(result.seller.max_items_to_get_discount) - result.items.length;

      if (totalItems <= 0) {
        const discount =
          parseFloat(result.seller.discount_amount_for_threshold) / 100;
        const new_discount = parseFloat(getItemTotal(result.items)) * discount;

        return (total = (
          parseFloat(calculate_discount_total(result.items)) +
          parseFloat(new_discount)
        ).toFixed(2));
      }
    }

    // console.log(getItemTotal(result.items));

    return calculate_discount_total(result.items);
  };

  const getSubTotal = (result) => {
    return (
      parseFloat(getItemTotal(result.items)) -
      parseFloat(getTotalDiscountApplied(result))
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

  const getChangeShippingText = (price_threshold, item) => {
    const total =
      parseFloat(price_threshold) - parseFloat(getTotalProgress(item));
    if (total <= 0) {
      return (
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            marginTop: 10,
            color: 'green',
          }}>
          Free
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            marginTop: 10,
          }}>
          Calculated on checkout
        </Text>
      );
    }
  };

  const renderDiscountView = (
    items,
    seller_id,
    max_items_to_get_discount,
    discount_amount_for_threshold,
  ) => {
    const totalItems = parseInt(max_items_to_get_discount) - items.length;

    if (totalItems <= 0) {
      return (
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.push('Shops', {
              headerTile: 'Shop',
              backTitle: 'Back',
              seller_id: seller_id,
            })
          }>
          <View style={{marginBottom: 5}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '10%'}}>
                <View style={styles.priceTag}>
                  <Icon
                    name="md-pricetags"
                    size={20}
                    style={{alignSelf: 'center'}}
                    color="#fff"
                  />
                </View>
              </View>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 15,
                    marginTop: 3,
                  }}>
                  A {discount_amount_for_threshold}% discount has been added to
                  your total
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.push('Shops', {
              headerTile: 'Shop',
              backTitle: 'Back',
              seller_id: seller_id,
            })
          }>
          <View style={{marginBottom: 5}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '90%', flexDirection: 'row'}}>
                <View style={{width: '10%'}}>
                  <View style={styles.priceTag}>
                    <Icon
                      name="md-pricetags"
                      size={20}
                      style={{alignSelf: 'center'}}
                      color="#fff"
                    />
                  </View>
                </View>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 14,
                    }}>
                    You are {totalItems} item(s) away from getting a{' '}
                    {discount_amount_for_threshold}% discount on your total.
                    Visit shop
                  </Text>
                </View>
              </View>
              <View style={{width: '10%'}}>
                <Icon
                  name="md-arrow-forward"
                  size={25}
                  style={{marginLeft: 5}}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };

  const getFreeShippingView = (price_threshold, item, seller_id) => {
    const total = (
      parseFloat(price_threshold) - parseFloat(getTotalProgress(item))
    ).toFixed(2);

    if (parseFloat(total) <= 0) {
      return (
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.push('Shops', {
              headerTile: 'Shop',
              backTitle: 'Cart',
              seller_id: seller_id,
            })
          }>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_light,
                fontSize: 15,
                fontWeight: '400',
                marginTop: 3,
                color: 'green',
              }}>
              You unlocked free shipping from this shop
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.push('Shops', {
              headerTile: 'Shop',
              backTitle: 'Cart',
              seller_id: seller_id,
            })
          }>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_light,
                  fontSize: 15,
                  fontWeight: '400',
                  marginTop: 3,
                }}>
                You are ${total} away from getting free shipping on item(s) from
                this shop. Visit shop
              </Text>
            </View>
            <View style={{width: '10%'}}>
              <Icon name="md-arrow-forward" size={25} style={{marginLeft: 5}} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
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
              <View style={{width: '80%', flexDirection: 'row'}}>
                <View style={{width: '30%'}}>
                  <FastImage
                    source={{uri: result.product.main_image, priority: FastImage.priority.normal                    }}
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
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: '#fbe9e7',
                      marginTop: 5,
                      borderRadius: 20,
                      width: 180,
                    }}>
                    <Text style={{fontFamily: Fonts.poppins_regular}}>
                      {result.product.product_qty == '1'
                        ? ' Only 1 available in shop'
                        : `  Qty in shop : ${result.product.product_qty} `}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{width: '20%', alignSelf: 'flex-end'}}>
                {result.product.discount !== '' && (
                  <Text style={styles.previousPrice}>
                    ${parseFloat(result.product.product_price).toFixed(2)}
                  </Text>
                )}

                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 18,
                    alignSelf: 'flex-end',
                  }}>
                  $
                  {displayPrice(
                    result.product.product_price,
                    result.product.discount,
                  ).toFixed(2)}
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
            <TouchableOpacity
              onPress={removeCartItem.bind(this, cart_id, result._id)}>
              <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
                Remove
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openInfoModalAction.bind(
                this,
                result.selected_variant_value,
                result.product._id,
                result._id,
                result.product.product_qty,
                result.product.variants,
                cart_id,
                result.product.product_can_be_customized,
                result.product_personalization_note,
                result.product.product_name,
              )}>
              <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
                Edit
              </Text>
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
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
          Date added
        </Text>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
          {Moment(item.date_added).format('MMM Do, YYYY')}
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
            Sold by
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 16}}>
            {item.seller.first_name + ' ' + item.seller.last_name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={openActionSheet.bind(
            this,
            item._id,
            item.seller.email,
            item.seller.shop_name,
            item.seller._id,
          )}>
          <Icon name="ios-more" size={30} />
        </TouchableOpacity>
      </View>
      {item.seller.offers_discount_on_price_threshold &&
        renderDiscountView(
          item.items,
          item.seller._id,
          item.seller.max_items_to_get_discount,
          item.seller.discount_amount_for_threshold,
        )}

      {renderProducts(item.items, item._id)}

      {item.seller.offers_free_shipping &&
        getFreeShippingView(
          item.seller.price_threshold,
          item.items,
          item.seller._id,
        )}

      <Text
        style={{
          fontFamily: Fonts.poppins_light,
          fontSize: 15,
          fontWeight: '400',
          marginTop: 10,
        }}>
        Ready to ship in 1 to 4 business day from USA. Shipping cost is
        calculated on checkout.
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
        <View style={{flexDirection: 'row'}}>
          <FontAwesome
            name="cc-visa"
            size={30}
            style={{marginLeft: 5}}
            color={Colors.pink}
          />
          <FontAwesome
            name="cc-discover"
            size={30}
            style={{marginLeft: 5}}
            color={Colors.pink}
          />
          <FontAwesome
            name="cc-mastercard"
            size={30}
            style={{marginLeft: 5}}
            color={Colors.pink}
          />
          <FontAwesome
            name="cc-amex"
            size={30}
            style={{marginLeft: 5}}
            color={Colors.pink}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 20,
                marginTop: 10,
              }}>
              Item(s) total
            </Text>
            <Tooltip
              popover={
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  Total = (Qty * Original Price) + Variant Price - of each product
                </Text>
              }
              backgroundColor={Colors.purple_darken}
              height={100}
              width={300}>
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
              fontSize: 20,
              marginTop: 10,
            }}>
            ${getItemTotal(item.items)}
          </Text>
        </View>

        {getTotalDiscountApplied(item) !== '0.00' && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 20,
                marginTop: 10,
              }}>
              Discount
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 20,
                marginTop: 10,
              }}>
              -${getTotalDiscountApplied(item)}
            </Text>
          </View>
        )}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
              marginTop: 10,
            }}>
            Shipping total
          </Text>
          {item.seller.offers_free_shipping ? (
            getChangeShippingText(item.seller.price_threshold, item.items)
          ) : (
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginTop: 10,
              }}>
              calculated on checkout
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
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
              marginTop: 10,
            }}>
            Order total ({item.items.length} item(s)):
          </Text>

          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              marginTop: 10,
            }}>
            ${getSubTotal(item)}
          </Text>
        </View>
        <TouchableOpacity onPress={proceedToCheckOut.bind(this, item)}>
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
              Proceed to checkout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {openCheckoutModal && (
        <CheckoutModal
          openCheckoutModal={openCheckoutModal}
          setOpenCheckoutModal={setOpenCheckoutModal}
          navigation = {props.navigation}
        />
      )}
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
        showsVerticalScrollIndicator={false}
        data={cart_data}
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
            {endOfFile_cart_data && cart_data.length > 16 && (
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

// <View>
//         {!hasNote ? (
//           <TouchableOpacity onPress={() => setHasNote(true)}>
//             <View style={{flexDirection: 'row', marginTop: 15}}>
//               <View
//                 style={{
//                   width: 20,
//                   height: 20,
//                   borderWidth: 2,
//                   borderColor: Colors.grey_darken,
//                   borderRadius: 2,
//                 }}
//               />
//               <Text
//                 style={{
//                   fontFamily: Fonts.poppins_light,
//                   fontSize: 15,
//                   marginLeft: 10,
//                   fontWeight: '300',
//                 }}>
//                 Add a note to shop name
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ) : (
//           <View>
//             <TouchableOpacity onPress={() => setHasNote(false)}>
//               <View style={{flexDirection: 'row', marginTop: 15}}>
//                 <Icon
//                   name="md-checkbox-outline"
//                   size={25}
//                   color={Colors.grey_darken}
//                 />
//                 <Text
//                   style={{
//                     fontFamily: Fonts.poppins_light,
//                     fontSize: 15,
//                     marginLeft: 10,
//                     fontWeight: '300',
//                     marginTop: 3,
//                   }}>
//                   Add a note to shop name
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TextInput
//               style={{
//                 borderWidth: 1,
//                 marginHorizontal: 30,
//                 marginTop: 10,
//                 fontSize: 20,
//                 fontFamily: Fonts.poppins_regular,
//                 padding: 5,
//                 borderColor: Colors.grey_darken,
//                 borderRadius: 5,
//               }}
//               multiline={true}
//             />
//           </View>
//         )}
//       </View>

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
  priceTag: {
    backgroundColor: Colors.green,
    width: 30,
    height: 30,
    borderRadius: 50,
    padding: 5,
  },

  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
    alignSelf: 'flex-end',
  },
});

export default CartComponent;
