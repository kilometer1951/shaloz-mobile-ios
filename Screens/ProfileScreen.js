import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,RefreshControl
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TabHeading, Tab, Tabs} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Footer from '../components/Footer';
import CreateSellerAccount from '../Modal/CreateSellerAccount';
import * as appActions from '../store/actions/appActions';
import * as authActions from '../store/actions/authActions';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState(false);
  const [shopStatus, setShopStatus] = useState('');
  const shop_orders = useSelector((state) => state.appReducer.shop_orders);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const checkShopStatus = async () => {
      const userData = await AsyncStorage.getItem('@userData');
      const parseUserData = userData !== null && (await JSON.parse(userData));

      if (parseUserData.shop_setup !== 'not_complete') {
        setShopStatus('complete');
      }

      // if (user.admin) {
      //   setAdmin(true);
      // }
    };
    checkShopStatus();
  }, []);


  const handleRefreshHome = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchHomeProducts(user._id));
      await dispatch(appActions.fetchCartData(user._id, 1));
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };


  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            You
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView refreshControl={
      <RefreshControl
        onRefresh={handleRefreshHome}
        refreshing={isRefreshing}
        tintColor="#000"
        titleColor="#000"
        title="Pull to refresh"
      />
    }>
        <View style={{paddingLeft: 10, paddingTop: 10}}>
          {shopStatus === 'complete' ? (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('MyShop', {backTitle: 'You'})
              }>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.5,
                  borderBottomColor: Colors.light_grey,
                  justifyContent: 'space-between',
                  paddingBottom: 10,
                  marginTop: 10,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: Fonts.poppins_semibold,
                      color: Colors.purple_darken,
                    }}>
                    My shop
                  </Text>
                </View>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    {shop_orders.length !== 0 && (
                      <View style={styles.notification} />
                    )}
                    <Icon
                      name="ios-arrow-forward"
                      size={20}
                      style={{paddingRight: 10, marginTop: 3}}
                      color={Colors.light_grey}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsNotAuthenticated(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 0.5,
                  borderBottomColor: Colors.light_grey,
                  justifyContent: 'space-between',
                  paddingBottom: 10,
                  marginTop: 10,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: Fonts.poppins_semibold,
                      color: Colors.purple_darken,
                    }}>
                    Create your online shop
                  </Text>
                </View>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="ios-arrow-forward"
                      size={20}
                      style={{paddingRight: 10, marginTop: 3}}
                      color={Colors.light_grey}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => props.navigation.navigate('PurchaseAndReview')}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light_grey,
                justifyContent: 'space-between',
                paddingBottom: 10,
                marginTop: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Purchases & Reviews
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    style={{paddingRight: 10, marginTop: 3}}
                    color={Colors.light_grey}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('TrackPackage')}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light_grey,
                justifyContent: 'space-between',
                paddingBottom: 10,
                marginTop: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Track your packages
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    style={{paddingRight: 10, marginTop: 3}}
                    color={Colors.light_grey}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'mailto:support@shaloz.com?cc=&subject=&body=body',
              );
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light_grey,
                justifyContent: 'space-between',
                paddingBottom: 10,
                marginTop: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Help & Support
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    style={{paddingRight: 10, marginTop: 3}}
                    color={Colors.light_grey}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('WebViewScreen', {
                url: 'https://www.shaloz.com/shipping_policy',
                title: 'shipping_policies',
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light_grey,
                justifyContent: 'space-between',
                paddingBottom: 10,
                marginTop: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Shipping polices / Terms
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    style={{paddingRight: 10, marginTop: 3}}
                    color={Colors.light_grey}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
         
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Logout',
                'We are sorry to see you go',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'text',
                  },
                  {
                    text: 'Logout',
                    style: 'destructive',

                    onPress: async () => {
                      dispatch(appActions.SelectedFooterTab('home'));
                     
                      dispatch(authActions.logout())
                      props.navigation.navigate('StartUpScreen');
                    },
                  },
                ],
                {cancelable: false},
              );
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light_grey,
                justifyContent: 'space-between',
                paddingBottom: 10,
                marginTop: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Logout
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    style={{paddingRight: 10, marginTop: 3}}
                    color={Colors.light_grey}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CreateSellerAccount
        navigation={props.navigation}
        setIsNotAuthenticated={setIsNotAuthenticated}
        isNotAuthenticated={isNotAuthenticated}
        setShopStatus={setShopStatus}
      />
      <Footer navigation={props.navigation} />
    </View>
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
  },
  notification: {
    backgroundColor: Colors.purple_darken,
    borderRadius: 55,
    width: 10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 10,
    marginRight: 10,
    marginTop: 8,
  },
});

export default ProfileScreen;

// <TouchableOpacity>
// <View
//   style={{
//     flexDirection: 'row',
//     borderBottomWidth: 0.5,
//     borderBottomColor: Colors.light_grey,
//     justifyContent: 'space-between',
//     paddingBottom: 10,
//   }}>
//   <View>
//     <Text
//       style={{
//         fontSize: 17,
//         fontFamily: Fonts.poppins_regular,
//       }}>
//       Profile
//     </Text>
//   </View>
//   <View>
//     <View style={{flexDirection: 'row'}}>
//       <Image
//         source={{
//           uri:
//             'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
//         }}
//         style={{
//           width: 30,
//           height: 30,
//           borderRadius: 50,
//           marginRight: 10,
//         }}
//         resizeMode="cover"
//       />
//       <Icon
//         name="ios-arrow-forward"
//         size={20}
//         style={{paddingRight: 10, marginTop: 3}}
//         color={Colors.light_grey}
//       />
//     </View>
//   </View>
// </View>
// </TouchableOpacity>
