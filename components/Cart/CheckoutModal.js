import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Animated,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import * as appActions from '../../store/actions/appActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ShippingDetails from './ShippingDetails';
import Payment from './Payment';
import ReviewOrder from './ReviewOrder';
import UpdatingLoader from '../UpdatingLoader';

const {height} = Dimensions.get('window');

const CheckoutModal = (props) => {
  const dispatch = useDispatch();
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > height;
  onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  };
  const {openCheckoutModal, setOpenCheckoutModal} = props;
  const user = useSelector((state) => state.authReducer.user);
  const selected_cart = useSelector((state) => state.appReducer.selected_cart);
  const check_out_info = useSelector(
    (state) => state.appReducer.check_out_info,
  );
  const [viewToRender, setViewToRender] = useState('shipping');
  const [isLoading, setIsLoading] = useState(false);

  const [animate_view1, setAnimated_view1] = useState(true);
  const [animate_view2, setAnimated_view2] = useState(false);
  const [animate_view3, setAnimated_view3] = useState(false);
  const [shippingAmountArray, setShippingAmountArray] = useState([]);
  const [modalToDisplay, setModalToDisplay] = useState('payment');

  //console.log(shippingAmountArray);

  const animateView1_out = () => {
    setViewToRender('payment');
    setAnimated_view1(false);
    setAnimated_view2(true);
  };

  let view;
  if (viewToRender === 'shipping') {
    view = (
      <View style={{marginBottom: 100}}>
        <ShippingDetails
          animateView1_out={animateView1_out}
          setShippingAmountArray={setShippingAmountArray}
        />
      </View>
    );
  } else if (viewToRender === 'payment') {
    view = (
      <View style={{marginBottom: 100}}>
        <Payment
          setAnimated_view1={setAnimated_view1}
          setAnimated_view2={setAnimated_view2}
          setAnimated_view3={setAnimated_view3}
          setViewToRender={setViewToRender}
          setShippingAmountArray={setShippingAmountArray}
        />
      </View>
    );
  } else {
    view = (
      <ReviewOrder
        shippingAmountArray={shippingAmountArray}
        setModalToDisplay={setModalToDisplay}
        openCheckoutModal={openCheckoutModal}
        setOpenCheckoutModal={setOpenCheckoutModal}
      />
    );
  }

  let modal_view;
  if (modalToDisplay === 'payment') {
    modal_view = (
      <View>
        <View
          style={{
            borderBottomWidth: 0.5,
            paddingBottom: 15,
            borderBottomColor: Colors.light_grey,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
            }}>
            <View style={{position: 'absolute', flexDirection: 'row'}}>
              <View
                style={{
                  width: 122,
                  borderWidth: 1,
                  borderColor: Colors.light_grey,
                  borderRadius: 50,
                  backgroundColor: Colors.pink,
                  marginLeft: 20,
                  marginTop: 13,
                }}
              />
              <View
                style={{
                  width: 118,
                  borderWidth: 1,
                  borderColor: Colors.light_grey,
                  borderRadius: 50,
                  backgroundColor: Colors.pink,
                  marginLeft: 17,
                  marginTop: 13,
                }}
              />
            </View>

            <Animated.View
              style={{
                width: animate_view1 ? 30 : 20,
                height: animate_view1 ? 30 : 20,
                borderWidth: 2,
                borderColor: Colors.pink,
                borderRadius: 50,
                backgroundColor: Colors.pink,
                marginTop: 1,
              }}
            />

            <Animated.View
              style={{
                width: animate_view2 ? 30 : 20,
                height: animate_view2 ? 30 : 20,
                borderWidth: 2,
                borderColor: Colors.pink,
                backgroundColor: Colors.pink,
                borderRadius: 50,
              }}
            />
            <Animated.View
              style={{
                width: animate_view3 ? 30 : 20,
                height: animate_view3 ? 30 : 20,
                borderWidth: 2,
                borderColor: Colors.pink,
                backgroundColor: Colors.pink,
                borderRadius: 50,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: Fonts.poppins_regular,
              }}>
              Shipping
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: Fonts.poppins_regular,
              }}>
              Payment
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: Fonts.poppins_regular,
              }}>
              Review
            </Text>
          </View>
        </View>

        <KeyboardAwareScrollView
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={300}
          keyboardShouldPersistTaps="always">
          <ScrollView
            style={{padding: 20}}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            style={{marginBottom: 100, padding: 10}}>
            {view}
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    );
  } else {
    modal_view = (
      <ScrollView
        onContentSizeChange={onContentSizeChange}
        scrollEnabled={scrollEnabled}
        style={{backgroundColor: '#f5f5f5'}}>
        <Image
          source={require('../../assets/paymentsuc.png')}
          resizeMode="cover"
          style={{
            width: '100%',
            height: 300,
            alignSelf: 'center',
            marginTop: '20%',
          }}
        />
        <View style={{padding: 10}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 30,
              alignSelf: 'center',
              textAlign: 'center',
              color: '#5c6bc0',
            }}>
            {user.first_name}, your order has been placed successfully
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: 50,
              color: '#9fa8da',
            }}>
            {selected_cart.seller.shop_name} will be notified of your purchase.
            Once your order has been shipped, a tracking number will be sent to
            you.
          </Text>
          <TouchableOpacity
            onPress={async () => {
              //console.log();
              dispatch(appActions.updateCartAfterPurchase(selected_cart._id));

              //update cart from store
              setModalToDisplay('payment');
              setOpenCheckoutModal(false);
              props.navigation.navigate('PurchaseAndReview');
            }}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 10,
                backgroundColor: Colors.purple_darken,
                marginTop: '20%',
                borderRadius: 5,
                height: 60,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 25,
                  alignSelf: 'center',
                  color: '#fff',
                }}>
                My Orders
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openCheckoutModal}>
      <View style={styles.screen}>
        {modalToDisplay === 'payment' && (
          <SafeAreaView>
            <View style={styles.header}>
              <View style={{width: '25%'}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    Alert.alert(
                      'Are you sure you want to exit checkout?',
                      '',
                      [
                        {
                          text: 'No',
                          onPress: () => console.log('Cancel Pressed!'),
                        },
                        {
                          text: 'Yes',
                          onPress: () => setOpenCheckoutModal(false),
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    Cancel
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </SafeAreaView>
        )}

        {modal_view}
      </View>
      {isLoading && <UpdatingLoader />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light_grey,
    flexDirection: 'row',
    zIndex: 1,
  },
});

export default CheckoutModal;
