import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';
import UpdatingLoader from '../UpdatingLoader';

import * as appActions from '../../store/actions/appActions';

const ShippingDetails = (props) => {
  const dispatch = useDispatch();
  const {
    openCheckoutModal,
    setOpenCheckoutModal,
    setShippingAmountArray,
    animateView1_out,
  } = props;
  const user = useSelector((state) => state.authReducer.user);
  const selected_cart = useSelector((state) => state.appReducer.selected_cart);

  const [country, setCountry] = useState('United States');
  const [full_name, setFull_name] = useState('');
  const [street_address, setStreet_address] = useState('');
  const [apt_suite_other, setApt_suite_other] = useState('');
  const [zip_code, setZip_code] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [viewToRender, setViewToRender] = useState('payment');
  const [validatedAddress, setValidatedAddress] = useState({});

  useEffect(() => {
    const shippingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.shippingDetails(user._id);
        setIsLoading(false);

        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
        }
        setFull_name(response.data.full_name);
        setStreet_address(response.data.street_address);

        setZip_code(response.data.zipe_code);
        setCity(response.data.city);
        setState(response.data.state);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    };
    shippingDetails();
  }, []);

  // () => {
  //
  // }
  const proceedToAddressVerification = async () => {
    try {
      if (full_name === '') {
        Alert.alert(
          'Full name required',
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

      if (street_address === '') {
        Alert.alert(
          'street address required',
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

      if (city === '') {
        Alert.alert(
          'City required',
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

      if (state === '') {
        Alert.alert(
          'State required',
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
      const data = {
        full_name,
        street_address: street_address + ' ' + apt_suite_other,
        zip_code,
        city,
        state,
      };
      setIsLoading(true);
      const response = await appActions.validateAddress(data);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
      }

      const resData = await JSON.parse(response.data);

      setValidatedAddress(resData[0]);
      setViewToRender('verify');
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const addressErrors = () => {
    return validatedAddress.messages.map((result, index) => {
      return (
        <View
          style={[{...styles.card}, {backgroundColor: '#fbe9e7'}]}
          key={index}>
          <Text
            style={{
              fontSize: 17,
              marginLeft: 10,
              fontFamily: Fonts.poppins_regular,
            }}>
            {result.message}
          </Text>
        </View>
      );
    });
  };
  const getTotal = (item) => {
    let count_sub_total = 0;
    let variantsTotal = 0;
    for (let i = 0; i < item.length; i++) {
      for (let j = 0; j < item[i].selected_variant_value.length; j++) {
        let pricePerVariant = parseFloat(
          item[i].selected_variant_value[j].price,
        );
        variantsTotal += parseFloat(pricePerVariant);
      }

      let pricePerItem = parseFloat(item[i].price) * parseInt(item[i].qty);
      count_sub_total += parseFloat(pricePerItem);
    }

    return (variantsTotal + count_sub_total).toFixed(2);
  };

  const procceedToCheckOut = async (address, _city, _state, _postal_code) => {
    const data = {
      user_id: user._id,
      full_name: full_name,
      address,
      _city,
      _state,
      _postal_code,
      cart_id: selected_cart._id,
    };
    try {
      //update cart item
      setIsLoading(true);
      for(let i = 0; i<selected_cart.items.length; i++){
        await appActions.updateCartItemPrice(selected_cart._id, user._id,selected_cart.items[i]._id);
      }


      //calculate shipping
      if (selected_cart.seller.offers_free_shipping) {
        //check if buyer has reached the max amount for free shipping
        const total =
          parseFloat(selected_cart.seller.price_threshold) -
          parseFloat(getTotal(selected_cart.items));

        if (total <= 0) {
          //apply free shipping free shipping
            setIsLoading(true);
          await dispatch(appActions.updateAddress(data));
          await dispatch(appActions.fetchUsersCards(user._id));
          setIsLoading(false);
          animateView1_out(true);
        } else {
          //calculate shipping
           setIsLoading(true)
          await dispatch(appActions.updateAddress(data));
          //get shipping rate
          let shippingAmount = [];

          for (let i = 0; i < selected_cart.items.length; i++) {
            //calculate shipping qty
            const total_qty =
              parseFloat(selected_cart.items[i].qty) *
              parseFloat(selected_cart.items[i].product.product_weight);
            const unit = selected_cart.items[i].product.product_weight_unit;

            const res = await appActions.getShippingRate(
              user._id,
              selected_cart.seller._id,
              total_qty,
              unit,
            );
            shippingAmount.push(res.amount);
          }
          setShippingAmountArray(shippingAmount);

          await dispatch(appActions.fetchUsersCards(user._id));
          setIsLoading(false);
          animateView1_out(true);
        }
      } else {
        //calculate shipping
         setIsLoading(true)
        await dispatch(appActions.updateAddress(data));
        //get shipping rate
        let shippingAmount = [];

        for (let i = 0; i < selected_cart.items.length; i++) {
          //calculate shipping qty
          const total_qty =
            parseFloat(selected_cart.items[i].qty) *
            parseFloat(selected_cart.items[i].product.product_weight);
          const unit = selected_cart.items[i].product.product_weight_unit;

          const res = await appActions.getShippingRate(
            user._id,
            selected_cart.seller._id,
            total_qty,
            unit,
          );
          shippingAmount.push(res.amount);
        }
        setShippingAmountArray(shippingAmount);
        await dispatch(appActions.fetchUsersCards(user._id));
        setIsLoading(false);
        animateView1_out(true);
      }
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      Alert.alert(
        'Error',
        'We could not calculate shipping on this address. Please check your shipping address.',
        [
          {
            text: 'Ok',
            onPress: async () => {},
          },
        ],
        {cancelable: false},
      );
    }
  };

  let view;
  if (viewToRender === 'payment') {
    view = (
      <View>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_semibold,
          }}>
          Enter your shipping address
        </Text>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 10,
            }}>
            Country
          </Text>
          <TextInput
            editable={false}
            style={{
              borderWidth: 1,
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              padding: 10,
              borderColor: Colors.light_grey,
              borderRadius: 5,
            }}
            value={country}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            Full name*
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
            returnKeyType="done"
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            Street address*
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
            value={street_address}
            onChangeText={(value) => setStreet_address(value)}
            returnKeyType="done"
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            Apt / Suite / Other (optional)
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
            value={apt_suite_other}
            onChangeText={(value) => setApt_suite_other(value)}
            returnKeyType="done"
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            Zip Code
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
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            City
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
            value={city}
            onChangeText={(value) => setCity(value)}
            returnKeyType="done"
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            State
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
            value={state}
            onChangeText={(value) => setState(value)}
            returnKeyType="done"
          />
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: Colors.light_grey,
            marginTop: 30,
            paddingTop: 15,
          }}>
          <TouchableOpacity onPress={proceedToAddressVerification}>
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
                  fontSize: 20,
                  alignSelf: 'center',
                  color: '#fff',
                }}>
                Continue to payment
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: Colors.light_grey,
            marginTop: 30,
            height: 150,
            alignItems: 'center',
            // marginBottom: 200,
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 17,
              marginTop: 20,
              textAlign: 'center',
              color: Colors.grey_darken,
            }}>
            Merchant is Shaloz, Inc. (USA). All payments are securly processed.
            Your payment information is not shared with the seller
          </Text>
        </View>
      </View>
    );
  } else {
    view = (
      <View style={{padding: 10}}>
        <TouchableOpacity onPress={() => setViewToRender('payment')}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="ios-arrow-back" size={25} />
            <Text
              style={{
                fontSize: 17,
                marginLeft: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              Back
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{padding: 5}}>
          {validatedAddress.matched_address && (
            <TouchableOpacity
              onPress={procceedToCheckOut.bind(
                this,
                validatedAddress.matched_address.address_line1,
                validatedAddress.matched_address.city_locality,
                validatedAddress.matched_address.state_province,
                validatedAddress.matched_address.postal_code,
              )}>
              <View style={styles.card}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View style={{width: '9%'}}>
                    <Icon
                      name="ios-radio-button-off"
                      size={25}
                      style={{marginLeft: 5}}
                    />
                  </View>
                  <View style={{width: '90%'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        marginLeft: 10,
                        fontFamily: Fonts.poppins_regular,
                      }}>
                      {`${validatedAddress.matched_address.address_line1}, ${validatedAddress.matched_address.city_locality}, ${validatedAddress.matched_address.state_province}, ${validatedAddress.matched_address.postal_code} `}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {addressErrors()}
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {view}
      {isLoading && <UpdatingLoader />}
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
    marginBottom: 30,
  },
  card: {
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
    borderRadius: 5,
  },
});

export default ShippingDetails;
