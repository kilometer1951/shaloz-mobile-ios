import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
  Linking,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {Card} from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import AsyncStorage from '@react-native-community/async-storage';

import * as appActions from '../store/actions/appActions';
import {URL} from '../socketURL';

import Footer from '../components/Footer';
import HomeProduct from '../components/Home/HomeProduct';
import HomePlaceholder from '../components/HomePlaceholder';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import AuthViewOne from '../components/AuthContainer/AuthViewOne';
import AuthViewTwo from '../components/AuthContainer/AuthViewTwo';
import AuthViewThree from '../components/AuthContainer/AuthViewThree';
import LoginAuth from '../components/AuthContainer/LoginAuth';
import NetworkError from '../components/NetworkError';
import io from 'socket.io-client';
// import NetInfo from '@react-native-community/netinfo';
import {NetworkConsumer} from 'react-native-offline';
import ConnectionError from '../components/ConnectionError';

//const {height} = Dimensions.get('window');

const HomeScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState(false);
  const [authViewToRender, setAuthViewToRender] = useState('getStarted');
  const [networkError, setNetworkError] = useState(false);
  const [height, setHeight] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  const scrollEnabled = viewHeight > height;
  onContentSizeChange = (contentWidth, contentHeight) => {
    setViewHeight(contentHeight);
  };

  const onChangeText = (value) => {
    setSearchInput(value);
  };

  useEffect(() => {
    const updateLastActivity = () => {
      appActions.updateLastActivity(user._id);
    };
    updateLastActivity();
  }, []);

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          //console.log('Initial url is: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);

    return () => {
      Linking.removeEventListener('url', _handleOpenURL);
    };
  }, []);
  // // Subscribe
  // const unsubscribe = NetInfo.addEventListener((state) => {
  //   console.log('Is connected?', state.isConnected);
  // });

  // // Unsubscribe
  // unsubscribe();

  function _handleOpenURL(event) {
    const route = event.url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/);
    const routeName = route.split('/');
    console.log(routeName);
    if (Object.entries(user).length === 0) {
      setIsNotAuthenticated(true);
    } else {
      if (routeName.length !== 0) {
        if (routeName[0] === 'view_orders') {
          props.navigation.navigate('MyShopOrders');
        }
        if (routeName[0] === 'view_earning') {
          props.navigation.navigate('MyShop', {backTitle: 'Back'});
        }
        if (routeName[0] === 'purchased_orders') {
          props.navigation.navigate('PurchaseAndReview');
        }
        if (routeName[0] === 'review_errors') {
          props.navigation.navigate('MyShop', {backTitle: 'Back'});
        }
        if (routeName[0] === 'product') {
          props.navigation.navigate('SingleProduct', {
            product_id: routeName[1],
          });
        }
        if (routeName[0] === 'cart') {
          dispatch(appActions.SelectedFooterTab('cart'));
          props.navigation.navigate('Cart');
        }
        if (routeName[0] === 'shop') {
          props.navigation.push('Shops', {
            headerTile: 'Shop',
            backTitle: 'Back',
            seller_id: routeName[1],
          });
        }
      }
    }
  }

  //console.log(user);

  useEffect(() => {
    //AsyncStorage.clear();
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('@userData');

      if (userData) {
        await dispatch(appActions.fetchShopOrderData(user._id, 1));
        await dispatch(appActions.fetchCartData(user._id, 1));
        setIsNotAuthenticated(false);
      }
    };
    tryLogin();
  }, []);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchHomeProducts(user._id));
        setIsLoading(false);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchHomeProducts();
  }, []);

  let view;
  if (authViewToRender === 'getStarted') {
    view = (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View
          style={{height: '80%'}}
          onLayout={(event) => {
            setHeight(event.nativeEvent.layout.height);
          }}>
          <ScrollView
            onContentSizeChange={onContentSizeChange}
            scrollEnabled={scrollEnabled}>
            <AuthViewOne
              setAuthViewToRender={setAuthViewToRender}
              authViewToRender={authViewToRender}
            />
          </ScrollView>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setAuthViewToRender('auth');
            }}>
            <View style={[{...styles.button}, {marginTop: 20}]}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  color: '#fff',
                  alignSelf: 'center',
                  fontSize: 20,
                }}>
                Sign up
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAuthViewToRender('login');
            }}>
            <View
              style={[
                {...styles.button},
                {backgroundColor: '#fff', marginTop: 20, marginBottom: 10},
              ]}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  alignSelf: 'center',
                  fontSize: 20,
                }}>
                I already have an account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (authViewToRender === 'auth') {
    view = (
      <AuthViewTwo
        setAuthViewToRender={setAuthViewToRender}
        authViewToRender={authViewToRender}
        setIsNotAuthenticated={setIsNotAuthenticated}
        navigation={props.navigation}
      />
    );
  } else if (authViewToRender === 'login') {
    view = (
      <LoginAuth
        setAuthViewToRender={setAuthViewToRender}
        authViewToRender={authViewToRender}
        setIsNotAuthenticated={setIsNotAuthenticated}
        navigation={props.navigation}
      />
    );
  } else {
    view = (
      <AuthViewThree
        setAuthViewToRender={setAuthViewToRender}
        authViewToRender={authViewToRender}
        setIsNotAuthenticated={setIsNotAuthenticated}
        navigation={props.navigation}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (Object.entries(user).length !== 0) {
                props.navigation.navigate('Search');
              } else {
                setIsNotAuthenticated(true);
              }
            }}>
            <View style={styles.search}>
              <Icon name="ios-search" size={20} style={{marginRight: 10}} />
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  color: Colors.grey_darken,
                }}>
                Search for anything
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>

      {!isLoading ? (
        <HomeProduct
          navigation={props.navigation}
          setIsNotAuthenticated={setIsNotAuthenticated}
        />
      ) : (
        <View style={{flex: 1}}>
          <ProductPlaceholderLoader />
          <HomePlaceholder />
        </View>
      )}

      <Footer
        navigation={props.navigation}
        footerColor="#fff"
        setIsNotAuthenticated={setIsNotAuthenticated}
      />

      <Modal animationType="slide" visible={isNotAuthenticated}>
        <View style={{flex: 1}}>{view}</View>
      </Modal>

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}

      <NetworkConsumer>
        {({isConnected}) =>
          !isConnected && <ConnectionError networkValue={false} />
        }
      </NetworkConsumer>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    height: 80,
    padding: 10,
  },
  button: {
    backgroundColor: '#000',
    width: '80%',
    borderRadius: 50,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },

  search: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 0.5},
    elevation: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#f8f9fa',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // panel: {
  //   flex: 1,
  //   backgroundColor: 'white',
  //   position: 'relative',
  // },
  // panelHeader: {
  //   height: 180,
  //   backgroundColor: '#b197fc',
  //   justifyContent: 'flex-end',
  //   padding: 24,
  // },
  // textHeader: {
  //   fontSize: 28,
  //   color: '#FFF',
  // },
  // icon: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   position: 'absolute',
  //   top: -24,
  //   right: 18,
  //   width: 48,
  //   height: 48,
  //   zIndex: 1,
  // },
  // iconBg: {
  //   backgroundColor: '#2b8a3e',
  //   position: 'absolute',
  //   top: -24,
  //   right: 18,
  //   width: 48,
  //   height: 48,
  //   borderRadius: 24,
  //   zIndex: 1,
  // },
});

export default HomeScreen;
