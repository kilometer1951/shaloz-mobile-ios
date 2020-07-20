import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import stripe, {PaymentCardTextField} from 'tipsi-stripe';
import {Tooltip} from 'react-native-elements';
import NetworkError from '../NetworkError';
import PaymentError from '../PaymentError';
import UpdatingLoader from '../UpdatingLoader';
import * as appActions from '../../store/actions/appActions';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ReviewOrder = (props) => {
  const dispatch = useDispatch();
  const {
    shippingAmountArray,
    setOpenCheckoutModal,
    setModalToDisplay,
    openCheckoutModal,
  } = props;
  const [viewToRender, setViewToRender] = useState('review');
  const selected_cart = useSelector((state) => state.appReducer.selected_cart);
  const card_id = useSelector((state) => state.appReducer.card_id);
  const check_out_info = useSelector(
    (state) => state.appReducer.check_out_info,
  );
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);

  const [networkError, setNetworkError] = useState(false);

  const [paymentError, setPaymentError] = useState(false);

  const [subTotal, setSubTotal] = useState('');
  const [shippingTotal, setShippingTotal] = useState('');
  const [processing_fee, setProcessing_fee] = useState('');
  const [total, setTotal] = useState('');
  const [tax, setTax] = useState('0.00');
  const [discount, setDiscount] = useState('0.00');

  const [itemsTotal, setItemsTotal] = useState('');

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

  const checkOutAndPay = async () => {
    try {
      //checkout
      setIsLoading(true);
      const response = await appActions.checkOutAndPay(
        user._id,
        selected_cart._id,
        card_id,
        subTotal,
        shippingTotal,
        tax,
        processing_fee,
        total,
        discount,
      );
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setPaymentError(true);
        return;
      }
      //go to success modal
      setModalToDisplay('succ');
    } catch (e) {
      setIsLoading(false);
      setPaymentError(true);
    }
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

  useEffect(() => {
    const getSubTotal = () => {
      //calculate  total
      const sub_total = getItemTotal(selected_cart.items);
      const item_discount = getTotalDiscountApplied(selected_cart);
      let shippingCount = 0;
      for (let i = 0; i < shippingAmountArray.length; i++) {
        let amount = parseFloat(shippingAmountArray[i]);
        shippingCount += amount;
      }

      setItemsTotal(sub_total);
      setDiscount(item_discount);
      setShippingTotal(shippingCount.toFixed(2));

      const processing_fee_total =
        parseFloat(sub_total) +
        parseFloat(shippingCount) -
        parseFloat(item_discount);

      const processing_fee = (
        parseFloat(processing_fee_total) * 0.029 +
        0.5
      ).toFixed(2);

      setProcessing_fee(processing_fee);

      const total_cal = (
        parseFloat(sub_total) +
        parseFloat(shippingCount) +
        parseFloat(processing_fee) -
        parseFloat(item_discount)
      ).toFixed(2);

      //standard tax is 3
      const tax_cal = (parseFloat(total_cal) * 0.03);

      const total = (parseFloat(total_cal) + parseFloat(tax_cal)).toFixed(2);

      setTax(tax_cal.toFixed(2));

      setTotal(total);
    };

    getSubTotal();
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
            marginTop: 5,
            paddingLeft: 10,
            paddingRight: 10,
            marginRight: 5,
          }}
          key={index}>
          <Text>{`${result.name}: ${result.content} (+$${result.price})`}</Text>
        </View>
      );
    });
  };

  const renderItems = selected_cart.items.map((result, index, array) => {
    return (
      <View
        style={{
          borderBottomWidth: 0.5,
          paddingBottom: 5,
          borderBottomColor: Colors.light_grey,
        }}
        key={index}>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
            }}>
            {result.product.product_name}
          </Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 17,
              }}>
              Qty
            </Text>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 17,
              }}>
              {result.qty}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 17,
              }}>
              Price
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 17,
                }}>
                $
                {displayPrice(
                  result.product.product_price,
                  result.product.discount,
                ).toFixed(2)}
              </Text>

              {result.product.discount !== '' && (
                <Text style={styles.previousPrice}>
                  ${parseFloat(result.product.product_price).toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 17,
                marginTop: 6,
                marginRight: 10,
              }}>
              Variants:
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {displayVariants(result.selected_variant_value)}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  });

  let view;
  if (viewToRender === 'review') {
    view = (
      <View style={{marginBottom: 100}}>
        <View
          style={{
            borderBottomWidth: 0.5,
            paddingBottom: 5,
            borderBottomColor: Colors.light_grey,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginBottom: 5,
            }}>
            Shipping Details
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
            }}>
            {check_out_info.full_name +
              ' ,' +
              check_out_info.address +
              ' ,' +
              check_out_info._city +
              ' ,' +
              check_out_info._state +
              ' ,' +
              check_out_info._postal_code}
          </Text>
        </View>
        {renderItems}
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            Item(s) total
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            ${itemsTotal}
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Shipping
            </Text>

            <Tooltip
              popover={
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  Shipping costs are calculated based on two cateria which are:
                  The total weight of each product and distance. We compare
                  prices accross shipping carriers to get you the best price.
                </Text>
              }
              backgroundColor={Colors.purple_darken}
              height={270}
              width={250}>
              <Icon
                name="ios-help-circle"
                size={20}
                style={{marginTop: 4, marginLeft: 5}}
                color={Colors.purple_darken}
              />
            </Tooltip>
          </View>

          {shippingTotal == '0.00' ? (
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
                color: 'green',
              }}>
              Free
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
              }}>
              ${shippingTotal}
            </Text>
          )}
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Sales tax
            </Text>

            <Tooltip
              popover={
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  Sales tax for your state is 3%
                </Text>
              }
              backgroundColor={Colors.purple_darken}
              height={150}
              width={250}>
              <Icon
                name="ios-help-circle"
                size={20}
                style={{marginTop: 4, marginLeft: 5}}
                color={Colors.purple_darken}
              />
            </Tooltip>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            ${tax}
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Processing
            </Text>

            <Tooltip
              popover={
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                  }}>
                  This is how much your card company charges to process this
                  transaction.
                </Text>
              }
              backgroundColor={Colors.purple_darken}
              height={150}
              width={250}>
              <Icon
                name="ios-help-circle"
                size={20}
                style={{marginTop: 4, marginLeft: 5}}
                color={Colors.purple_darken}
              />
            </Tooltip>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            ${processing_fee}
          </Text>
        </View>
        {discount != '0.00' && (
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
              -${discount}
            </Text>
          </View>
        )}

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            Total
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            ${total}
          </Text>
        </View>
        <TouchableOpacity onPress={checkOutAndPay}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              padding: 15,
              backgroundColor: Colors.purple_darken,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 25,
                alignSelf: 'center',
                color: '#fff',
              }}>
              Pay
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{paddingHorizontal: 20}}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        {view}
        {paymentError && (
          <PaymentError
            paymentError={paymentError}
            setPaymentError={setPaymentError}
          />
        )}
        {networkError && (
          <NetworkError
            networkError={networkError}
            setNetworkError={setNetworkError}
          />
        )}
        {isLoading && <UpdatingLoader />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: 5,
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
  },
});

export default ReviewOrder;
