import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Error from '../Error';
import stripe from 'tipsi-stripe';
import NetworkError from '../NetworkError';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import VisitMyShopView from '../VisitMyShopView';
import * as authActions from '../../store/actions/authActions';

//const {height} = Dimensions.get('window');

const StepSix = (props) => {
  const dispatch = useDispatch();
  const {
    confirmAccountNumber,
    setConfirmAccountNumber,
    accountNumber,
    setAccountNumber,
    routingNumber,
    setRoutingNumber,
    setViewToRender,
    setViewNumber,
    setIsNotAuthenticated,
    setShopStatus,
    location,closeModal
  } = props;

  const [renderDone, setRenderDone] = useState('bank');
  const [dob, setDob] = useState('');
  const [dobPlaceHolder, setDobPlaceHolder] = useState('Date of birth');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState('');
  const [textColorDate, setTextColorDate] = useState('#bdbdbd');
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [networkError, setNetworkError] = useState(false);

  stripe.setOptions({
    publishableKey: 'pk_test_KPNAjmM69ddMhdF9y7weHNAs00KPXJrkLQ',
    merchantId: 'MERCHANT_ID', // Optional
    androidPayMode: 'test', // Android only
  });

  const done = () => {
    if (location === 'profilescreen') {
      setShopStatus('complete');
      props.navigation.navigate('MyShop', {backTitle: 'You'});
      setIsNotAuthenticated(false);
    } else {
      props.navigation.navigate('MyShop', {backTitle: 'Home'});
      setIsNotAuthenticated(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const newDate = Moment(date).format('MM / DD / YYYY');
    setTextColorDate('#000');
    setDob(newDate);
    hideDatePicker();
  };

  const goToSection = async () => {
    try {
      if (dob === '') {
        setError('Date of birth required');
        return;
      }
      if (routingNumber.length !== 9) {
        setError('Error handling routing number');
        return;
      }
      if (accountNumber.length < 6) {
        setError('Error handling account number');
        return;
      }
      if (accountNumber !== confirmAccountNumber) {
        setError('Account number does not match');
        return;
      }
      setError('');
      const params = {
        accountNumber: accountNumber, //14 digits
        countryCode: 'us',
        currency: 'usd',
        routingNumber: routingNumber, // 9 digits
        accountHolderName: user.first_name + ' ' + user.last_name,
        accountHolderType: 'individual', // "company" or "individual"
      };
      const token = await stripe.createTokenWithBankAccount(params);
      setIsLoading(true);
      const response = await authActions.addStripeAccountBankingInfo(
        user._id,
        dob,
        token.tokenId,
      );
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setError(response.message);
        return;
      }
      AsyncStorage.getItem('@userData')
        .then((data) => {
          // the string value read from AsyncStorage has been assigned to data
          console.log(data);

          // transform it back to an object
          data = JSON.parse(data);

          // Decrement
          data.shop_setup = 'complete';
          //save the value to AsyncStorage again
          AsyncStorage.setItem('@userData', JSON.stringify(data));
        })
        .done();
      dispatch(authActions.dispatchUpdatedAccount(response.user));
      setRenderDone('doneView');
    } catch (e) {
      setIsLoading(false);
      setError(e.toString());
      return;
    }
  };

  let view;
  if (renderDone === 'bank') {
    view = (
      <KeyboardAwareScrollView
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={300}
        keyboardShouldPersistTaps="always">
        <ScrollView
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag">
          <View style={{width: '100%', padding: 10}}>
            <SafeAreaView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={() => closeModal()}>
                  <View>
                    <Icon name="ios-close" size={35} />
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginTop: 5,
                  }}>
                  {props.viewNumber}/6
                </Text>
              </View>
            </SafeAreaView>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Fonts.poppins_semibold,
                }}>
                Bank account information (Where would you like us to deposit all
                your earnings)
              </Text>
              {error !== '' && <Error error={error} />}
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                  marginTop: 10,
                }}>
                Date of birth*
              </Text>
              <TouchableOpacity
                style={styles.dropDownList}
                onPress={showDatePicker}>
                <Text
                  style={{
                    fontSize: 20,
                    paddingLeft: 13,
                    paddingBottom: 10,
                    color: dob === '' ? textColorDate : '#000',
                    marginTop: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  {dob !== '' ? dob : dobPlaceHolder}
                </Text>
                <Icon
                  name="md-arrow-dropdown"
                  size={30}
                  style={{marginRight: 10, marginTop: 10}}
                  color={Colors.grey_darken}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                  marginTop: 10,
                }}>
                Routing Number*
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                  padding: 10,
                  borderColor: Colors.light_grey,
                  borderRadius: 5,
                  width: '100%',
                }}
                value={routingNumber}
                onChangeText={(value) => setRoutingNumber(value)}
                autoFocus={true}
              />
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                  marginTop: 10,
                }}>
                Account Number*
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                  padding: 10,
                  borderColor: Colors.light_grey,
                  borderRadius: 5,
                  width: '100%',
                }}
                value={accountNumber}
                onChangeText={(value) => setAccountNumber(value)}
              />
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                  marginTop: 10,
                }}>
                Confirm Account Number*
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                  padding: 10,
                  borderColor: Colors.light_grey,
                  borderRadius: 5,
                  width: '100%',
                }}
                value={confirmAccountNumber}
                onChangeText={(value) => setConfirmAccountNumber(value)}
                returnKeyType="done"
              />
            </View>

            {routingNumber !== '' &&
              accountNumber !== '' &&
              confirmAccountNumber !== '' &&
              dob !== '' && (
                <TouchableWithoutFeedback onPress={goToSection}>
                  <View style={styles.button}>
                    <Icon
                      name="md-arrow-round-forward"
                      size={40}
                      color="white"
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            <View
              style={{
                marginTop: 10,
                alignSelf: 'center',
                justifyContent: 'flex-end',
                paddingHorizontal: 10,
                flexDirection: 'row',
                width: '90%',
              }}>
              <Icon name="ios-lock" size={30} />
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  textAlign: 'center',
                  marginTop: 5,
                  marginLeft: 10,
                }}>
                Your payout information is saved securly. We will never charge
                your account.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  } else {
    view = <VisitMyShopView done={done} />;
  }

  return (
    <View>
      {isLoading ? (
        <View style={{alignItems: 'center', marginTop: '40%'}}>
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{
              paddingHorizontal: 10,
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginTop: 15,
              marginTop: 40,
            }}>
            Saving and uploading please wait
          </Text>
        </View>
      ) : (
        view
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="en_GB" // Use "en_GB" here
        date={new Date('1999-10-05T14:48:00.000Z')}
      />
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
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: '#eeeeee',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: '5%',
  },
  dropDownList: {
    borderColor: '#bdbdbd',
    borderRadius: 5,
    width: '100%',
    marginTop: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
  },
});

export default StepSix;
