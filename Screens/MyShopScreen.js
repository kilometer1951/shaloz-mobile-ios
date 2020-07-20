import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Share,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TabHeading, Tab, Tabs, ScrollableTab} from 'native-base';
import Moment from 'moment';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ProductComponent from '../components/ProductComponent';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import ShopsComponent from '../components/Shops/ShopsComponent';
import Variants from '../components/MyShop/Variants';
import Products from '../components/MyShop/Products';
import Orders from '../components/MyShop/Orders';
import MyShopHome from '../components/MyShop/MyShopHome';
import HomeOrderSection from '../components/MyShop/HomeOrderSection';
import VideoAdSection from '../components/MyShop/VideoAdSection';
import ShopSettings from '../components/MyShop/ShopSettings';
import CompletedOrderSection from '../components/MyShop/CompletedOrderSection';
import NetworkError from '../components/NetworkError';
import VerificationModal from '../components/VerificationModal';
import OpenCategorySectionModal from "../Modal/OpenCategorySectionModal"

import * as appActions from '../store/actions/appActions';

const MyShopScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const shop_orders = useSelector((state) => state.appReducer.shop_orders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const [open_verification_modal, setOpen_verification_modal] = useState(false);
  const [document_verification, setDocumentVerification] = useState(true);

  const backTitle = props.navigation.getParam('backTitle');
  const headerTile = props.navigation.getParam('headerTile');

  const start_of_week = Moment().startOf('isoWeek');
  const end_of_week = Moment().endOf('isoWeek');

  useEffect(() => {
    const fetchShopOrderData = async () => {
      try {
        await dispatch(appActions.fetchShopOrderData(user._id, 1));
        const response = await appActions.checkStripeDocuments(user._id);
        console.log(response.verification);

        if (!response.verification) {
          setDocumentVerification(false);
        }
      } catch (e) {
        setNetworkError(true);
      }
    };
    fetchShopOrderData();
  }, []);

  useLayoutEffect(() => {
    const openShopCategorySelection = () => {
      if (user.store_categories.length === 0) {
        //ask user to select categories
        setOpenCategoryModal(true);
      }
    };
    openShopCategorySelection()
  },[]);

  const handleRefreshHome = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(
        appActions.getEarnings(
          user._id,
          new Date(start_of_week),
          new Date(end_of_week),
        ),
      );
      await dispatch(appActions.fetchShopOrderData(user._id, 1));
      await dispatch(appActions.fetchCompletedOrderData(user._id, 1));
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Visit my shop ${user.shop_name} we have really cool and discounted products you might be interested in. shaloz://shop/${user._id}`,
        url: 'http://appstore.com/shaloz',
        title: 'Download the Shaloz app and visit this shop ' + user.shop_name,
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

  const reviewDocument = () => {
    setOpen_verification_modal(true);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View
          style={{
            borderBottomWidth: 0.5,
            padding: 10,
            borderBottomColor: Colors.light_grey,
          }}>
          <View style={styles.header}>
            <View style={{width: '20%'}}>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-arrow-back" size={25} />
                  <Text
                    style={{
                      fontSize: 17,
                      marginLeft: 10,
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    {backTitle}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.headerRow}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 17,
                  fontFamily: Fonts.poppins_semibold,
                  textAlign: 'center',
                }}>
                {user.shop_name}
              </Text>
            </View>
            <View style={{width: '20%'}}>
              <TouchableOpacity onPress={onShare}>
                <View style={{alignSelf: 'flex-end', marginRight: 10}}>
                  <Icon
                    name="md-share"
                    size={23}
                    color={Colors.purple_darken}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {!document_verification && (
            <View>
              <TouchableOpacity onPress={reviewDocument}>
                <View
                  style={{alignSelf: 'center', marginRight: 10, marginTop: 10}}>
                  <Text style={{fontSize: 15, color: 'red'}}>
                    Verification failed, click to review
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
      <Tabs
        tabBarUnderlineStyle={{
          backgroundColor: Colors.purple_darken,
          height: 1,
        }}
        renderTabBar={() => <ScrollableTab />}>
        <Tab
          heading={
            <TabHeading style={{backgroundColor: '#fff'}}>
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Home
              </Text>
            </TabHeading>
          }>
          <ScrollView
            style={{backgroundColor: '#f3e5f5'}}
            refreshControl={
              <RefreshControl
                onRefresh={handleRefreshHome}
                refreshing={isRefreshing}
                tintColor="#000"
                titleColor="#000"
                title="Pull to refresh"
              />
            }>
            <MyShopHome navigation={props.navigation} />
            <HomeOrderSection navigation={props.navigation} />
            <CompletedOrderSection navigation={props.navigation} />
          </ScrollView>
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor: '#fff'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 15,
                  }}>
                  Orders
                </Text>

                {shop_orders.length !== 0 && (
                  <View style={styles.notification} />
                )}
              </View>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            <Orders />
          </View>
        </Tab>

        <Tab
          heading={
            <TabHeading style={{backgroundColor: '#fff'}}>
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                My products
              </Text>
            </TabHeading>
          }>
          <Products navigation={props.navigation} />
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor: '#fff'}}>
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Product variants
              </Text>
            </TabHeading>
          }>
          <Variants />
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor: '#fff'}}>
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Settings
              </Text>
            </TabHeading>
          }>
          <ShopSettings navigation={props.navigation} setOpenCategoryModal={setOpenCategoryModal}/>
        </Tab>
      </Tabs>
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      <VerificationModal
        open_verification_modal={open_verification_modal}
        setOpen_verification_modal={setOpen_verification_modal}
        setDocumentVerification={setDocumentVerification}
      />

      {openCategoryModal && (
        <OpenCategorySectionModal
          openCategoryModal={openCategoryModal}
          setOpenCategoryModal={setOpenCategoryModal}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRow: {
    width: '60%',
  },
  notification: {
    backgroundColor: Colors.purple_darken,
    borderRadius: 55,
    width: 10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 10,
  },
});

export default MyShopScreen;

// <Tab
// heading={
//   <TabHeading style={{backgroundColor: '#fff'}}>
//     <Text
//       style={{
//         marginLeft: 5,
//         fontFamily: Fonts.poppins_regular,
//         fontSize: 15,
//       }}>
//       Ad manager
//     </Text>
//   </TabHeading>
// }>
// <VideoAdSection />
// </Tab>
