import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  
  TouchableOpacity,
 
  ScrollView,
  TextInput,
 
  Keyboard,
  Linking,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import stripe, {PaymentCardTextField} from 'tipsi-stripe';
import NetworkErrorAddingCard from '../NetworkErrorAddingCard';
import NetworkError from '../NetworkError';
import UpdatingLoader from '../UpdatingLoader';
import * as appActions from '../../store/actions/appActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ShippingDetails = (props) => {
  const dispatch = useDispatch();
  const {
    setAnimated_view1,
    setAnimated_view2,
    setAnimated_view3,
    setViewToRender,
    setShippingAmountArray,
  } = props;
  const [networkError, setNetworkError] = useState(false);
  const user = useSelector((state) => state.authReducer.user);

  const [valid, setValid] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  //const [cardInputs, setCardInputs] = useState({});
  const [changeBilling, setChangeBilling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const check_out_info = useSelector(
    (state) => state.appReducer.check_out_info,
  );

  const selected_cart = useSelector((state) => state.appReducer.selected_cart);
  const card_id = useSelector((state) => state.appReducer.card_id);

  const cards = useSelector((state) => state.appReducer.cards);

  const [country, setCountry] = useState('United States');

  const [full_name, setFull_name] = useState(check_out_info.full_name);
  //const [street_address, setStreet_address] = useState('');
  //const [apt_suite_other, setApt_suite_other] = useState('');
  const [zip_code, setZip_code] = useState(check_out_info._postal_code);
  //const [city, setCity] = useState('');
  const [number, setNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');

  const [state, setState] = useState('');

  //const [cards, setCards] = useState([]);

  stripe.setOptions({
    publishableKey: 'pk_test_KPNAjmM69ddMhdF9y7weHNAs00KPXJrkLQ',
    merchantId: 'merchant.com.iBeautyConnectApplePay', // Optional
    androidPayMode: 'test', // Android only
  });

  const saveAndReview = async () => {
    try {
      if (country === '') {
        Alert.alert(
          'Country required',
          '',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
        return;
      }

      if (zip_code === '') {
        Alert.alert(
          'Zip code required',
          '',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
        return;
      }

      if (full_name === '') {
        Alert.alert(
          'Name on card required',
          '',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
        return;
      }

      if (number === '') {
        Alert.alert(
          'Card number required',
          '',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
        return;
      }

      if (expMonth === '') {
        Alert.alert(
          'Expiration month required',
          '',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
        return;
      }

      if (expYear === '') {
        Alert.alert(
          'Expiration year required',
          '',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
        return;
      }

      const inputs = {
        // mandatory
        name: full_name,
        addressCountry: country,
        addressZip: zip_code,
        number: number,
        expMonth: expMonth,
        expYear: expYear,
        cvc: cvc,
        currency: 'usd',
      };

      //seller_id,items
      //selected_cart.items

      setIsLoading(true);
      const token = await stripe.createTokenWithCard(inputs);

      //add
      await dispatch(appActions.addCard(user._id, token.tokenId));
     
      //fetch cards
      await dispatch(appActions.fetchUsersCards(user._id));

      setIsLoading(false);
      setViewToRender('review');
      setAnimated_view1(false);
      setAnimated_view2(false);
      setAnimated_view3(true);
      //console.log(token.tokenId);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const goToReviewOrder = async (card_id) => {
    try {
      setIsLoading(true);
      await dispatch(appActions.selectCard(card_id));

      // let shippingAmount = [];

      // for (let i = 0; i < selected_cart.items.length; i++) {
      //   //calculate shipping qty
      //   const total_qty =
      //     parseFloat(selected_cart.items[i].qty) *
      //     parseFloat(selected_cart.items[i].product.product_weight);
      //   const unit = selected_cart.items[i].product.product_weight_unit;

      //   const res = await appActions.getShippingRate(
      //     user._id,
      //     selected_cart.seller._id,
      //     total_qty,
      //     unit,
      //   );
      //   shippingAmount.push(res.amount);
      // }
      // setShippingAmountArray(shippingAmount);

      setIsLoading(false);
      setViewToRender('review');
      setAnimated_view1(false);
      setAnimated_view2(false);
      setAnimated_view3(true);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const handleFieldParamsChange = (valid, params) => {
    setValid(valid);
    if (valid) {
      //create token
      setNumber(params.number);
      setExpMonth(params.expMonth);
      setExpYear(params.expYear);
      setCvc(params.cvc);

      // setCardInputs(inputs);
      Keyboard.dismiss();
    }
  };

  const renderCards = () => {
    return cards.map((result, index) => {
      return (
        <View
          key={index}
          style={{
            marginTop: 10,
            borderBottomWidth: 0.5,
            paddingBottom: 10,
            borderBottomColor: Colors.grey_darken,
          }}>
          <TouchableOpacity onPress={goToReviewOrder.bind(this, result.id)}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="ios-radio-button-off" size={30} />
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: Fonts.poppins_regular,
                  marginLeft: 10,
                  marginTop: 4,
                }}>
                Pay with {result.brand} ending in {result.last4}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  let cardView;

  if (cards.length === 0) {
    cardView = (
      <View style={{alignSelf: 'center', marginTop: 20}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            color: Colors.grey_darken,
          }}>
          You have no card(s) on file
        </Text>
      </View>
    );
  } else {
    cardView = <View>{renderCards()}</View>;
  }

  return (
      <KeyboardAwareScrollView
      scrollEnabled={true}
      enableAutomaticScroll={true}
      extraHeight={300} keyboardShouldPersistTaps="always">
      <ScrollView
        style={{paddingHorizontal: 20}}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_semibold,
          }}>
          Add a card
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: Fonts.poppins_regular,
            color: Colors.grey_darken,
          }}>
          You will not be charged until you review this order on the next page
        </Text>
        <View>
          <View style={{marginBottom: 10}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.poppins_regular,
                marginTop: 10,
              }}>
              Country
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
              value={country}
              onChangeText={(value) => setCountry(value)}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.poppins_regular,
              }}>
              Zip code
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
              value={zip_code}
              onChangeText={(value) => setZip_code(value)}
            />
          </View>
          <View style={{marginBottom: 22}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.poppins_regular,
              }}>
              Name on card
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
              value={full_name}
              onChangeText={(value) => setFull_name(value)}
            />
          </View>
          <PaymentCardTextField
            style={styles.field}
            disabled={false}
            onParamsChange={handleFieldParamsChange}
          />

          <TouchableOpacity
            onPress={() => {
              saveAndReview();
            }}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 15,
                backgroundColor: Colors.purple_darken,
                marginTop: 20,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 20,
                  alignSelf: 'center',
                  color: '#fff',
                }}>
                Save and Review order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopColor: Colors.light_grey,
            borderTopWidth: 1,
            marginTop: 20,
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
              marginTop: 10,
            }}>
            Select a card
          </Text>
          {cardView}
        </View>
        <View
          style={{
            marginTop: 30,
            height: 150,
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 17,
              textAlign: 'center',
              color: Colors.grey_darken,
            }}>
            Merchant is Shaloz, Inc. (USA). All payments are securly processed.
            Your payment information is not shared with the seller. For issues
            with your order, send us an email at
          </Text>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              Linking.openURL(
                'mailto:support@shaloz.com?cc=&subject=OrderID' +
                  selected_cart._id +
                  '&body=body',
              );
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 17,
                textAlign: 'center',
                color: Colors.grey_darken,
                textDecorationLine: 'underline',
              }}>
             support@shaloz.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {networkError && (
        <NetworkErrorAddingCard
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {isLoading && <UpdatingLoader />}
      </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  field: {
    width: '100%',
    color: '#000',
    borderColor: '#bdbdbd',
    borderWidth: 1,
    borderRadius: 5,
    height: 55,
  },
});

export default ShippingDetails;
