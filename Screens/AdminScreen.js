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
  SafeAreaView,
  Alert,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import UpdatingLoader from '../components/UpdatingLoader';
import CartPlaceHolder from '../components/CartPlaceHolder';
import {ActionSheet} from 'native-base';
import Moment from 'moment';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import * as appActions from '../store/actions/appActions';
import NetworkError from '../components/NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import FastImage from 'react-native-fast-image';

const AdminScreen = (props) => {
  const dispatch = useDispatch();
  const admin_purchase_packages = useSelector(
    (state) => state.appReducer.admin_purchase_packages,
  );
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const endOfFile_admin_purchased_packages = useSelector(
    (state) => state.appReducer.endOfFile_admin_purchased_packages,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);
  const [networkError, setNetworkError] = useState(false);

  //const [order_id, setOrderID] = useState('');

  const adminFetchPurchasedPackages = async () => {
    try {
      setIsLoading(true);
      await dispatch(appActions.adminFetchPurchasedPackages(1));
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  useEffect(() => {
    adminFetchPurchasedPackages();
  }, []);

  const adminPaySeller = (seller_name, cart_id) => {
    Alert.alert(
      'Will you like to pay',
      seller_name,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Pay',
          style: 'text',
          onPress: async () => {
            try {
              setIsUpdating(true);
              const response = await appActions.adminPaySeller(cart_id);
              //dispatch order
              adminFetchPurchasedPackages();

              setIsUpdating(false);
              if (!response.status) {
                setIsUpdating(false);
                Alert.alert(
                  'Error paying this seller. Seller has failed verification. A message has been sent to the seller with regard to this issue. After they verify their account, you can proceed to payment',
                  ''[
                    {text: 'Ok', onPress: () => console.log('Cancel Pressed!')}
                  ],
                  {cancelable: false},
                );
                return;
              }
            } catch (e) {
              console.log(e);
              setIsUpdating(false);
              setNetworkError(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.adminFetchPurchasedPackages(1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_admin_purchased_packages) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(
            appActions.handleLoadMoreAdminFetchPurchasedPackages(page),
          );
          setIsLoadingMoreData(false);
          setPage((prev) => (prev = prev + 1));
        }
      }
    } catch (e) {
      console.log(e);

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
            {result.name}: {result.content} (+${result.price})
          </Text>
        </View>
      );
    });
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
              padding: 10,
              width: '100%',
              flexDirection: 'row',
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <View style={{width: '80%', flexDirection: 'row'}}>
              <View style={{width: '30%'}}>
                <FastImage
                  source={{uri: result.product.main_image, priority:FastImage.priority.high}}
                  style={{
                    width: '100%',
                    height: 100,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              <View style={{width: '70%', marginLeft: 5}}>
                <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
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
                    Qty bought : {result.qty}
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
            Bought by
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 16}}>
            {item.user.first_name + ' ' + item.user.last_name}
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            OrderID - {item._id}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontFamily: Fonts.poppins_regular,
          fontSize: 15,
          marginBottom: 10,
        }}>
        Date Expected to arrive:{' '}
        {Moment(new Date(item.expected_arrival_date)).format('MMM DD, YYYY')}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.poppins_regular,
          fontSize: 15,
          marginBottom: 10,
        }}>
        Date Shipped:{' '}
        {Moment(new Date(item.date_entered_tracking)).format('MMM DD, YYYY')}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.poppins_regular,
          fontSize: 15,
          marginBottom: 10,
        }}>
        Tracking number: {item.tracking_number}
      </Text>
      <Text style={{fontFamily: Fonts.poppins_regular, color: 'red'}}>
        Pay seller three days after delivery date
      </Text>
      {renderProducts(item.items, item._id)}

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
            Shipping total (estimated from usps)
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              marginTop: 10,
            }}>
            ${item.shippment_price}
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
            Shaloz takes
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              marginTop: 10,
            }}>
            ${item.theshop_takes}
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
            Tax
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
            ${parseFloat(item.total).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={adminPaySeller.bind(
            this,
            item.seller.first_name + ' ' + item.seller.last_name,
            item._id,
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
              Pay {item.seller.first_name + ' ' + item.seller.last_name}{' '}
              {(
                parseFloat(item.total) - parseFloat(item.processing_fee) - parseFloat(item.tax)
             ).toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );


  let view;
  if (admin_purchase_packages.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 20,
            textAlign: 'center',
            padding: 20,
          }}>
          No data to show
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
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
          data={admin_purchase_packages}
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
              {endOfFile_admin_purchased_packages &&
                admin_purchase_packages.length > 16 && (
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
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.goBack();
            }}>
            <View
              style={{
                marginHorizontal: 20,
                height: 30,
                width: 30,
                paddingTop: 4,
                alignItems: 'center',
              }}>
              <Icon name="md-arrow-back" size={20} />
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: '60%',
              marginLeft: 17,
              alignItems: 'center',
            }}>
            <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
              Pay Seller
            </Text>
          </View>
        </View>
      </SafeAreaView>
      {isLoading ? <CartPlaceHolder /> : view}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {isUpdating && <UpdatingLoader />}
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
  header: {
    width: '100%',
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
});

export default AdminScreen;
