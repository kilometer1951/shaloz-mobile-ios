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
import UpdatingLoader from '../UpdatingLoader';
import {ActionSheet} from 'native-base';
import {Tooltip} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';

let BUTTONS = ['Cancel', 'Visit shop', 'Help'];
let CANCEL_INDEX = 0;

const TrackPackageComponent = (props) => {
  const dispatch = useDispatch();
  const {
    tracking_number,
    setTracking_number,
    openTrackingModal,
    setOpenTrackingModal,
  } = props;
  const purchased_orders = useSelector(
    (state) => state.appReducer.purchased_orders,
  );
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const endOfFile_purchase_package = useSelector(
    (state) => state.appReducer.endOfFile_purchase_package,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);
  const [networkError, setNetworkError] = useState(false);

  const openTrackPackageModal = async (tracking_number) => {
    //dispatch selected cart
    setTracking_number(tracking_number);
    setOpenTrackingModal(true);
    console.log(tracking_number);
  };

  const renderTrackingButton = (tracking_number, expected_arrival_date) => {
    const track = Moment(new Date()).isAfter(
      new Date(expected_arrival_date),
      'day',
    );
    if (tracking_number === '') {
      return (
        <TouchableWithoutFeedback>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              padding: 10,
              backgroundColor: Colors.blue,
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
              Pending tracking number
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      if (!track) {
        return (
          <TouchableOpacity
            onPress={openTrackPackageModal.bind(this, tracking_number)}>
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
                Track package
              </Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableWithoutFeedback>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 10,
                backgroundColor: Colors.blue,
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
                Package arrived
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      }
    }
  };

  const openAlertModal = (cart_id, seller_id, seller_email, shop_name) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          props.navigation.navigate('Shops', {
            headerTile: 'Shop',
            backTitle: 'Track',
            seller_id: seller_id,
          });
        } else if (buttonIndex === 2) {
          Linking.openURL(
            'mailto:support@shaloz.com?cc=&subject=Issue with OrderID' +
              cart_id.toString() +
              '&body=My orderID is ' +
              cart_id.toString() +
              ' ......',
          );
        }
      },
    );
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchPurchasedPackage(user._id, 1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_purchase_package) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(
            appActions.handleLoadMorePurchaseOrders(user._id, page),
          );
          setIsLoadingMoreData(false);
          setPage((prev) => (prev = prev + 1));
        }
      }
    } catch (e) {
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
            {result.name}: {result.content}(+${result.price})
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
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <View
              style={{
                padding: 10,
                width: '100%',
                flexDirection: 'row',
              }}>
              <View style={{width: '70%', flexDirection: 'row'}}>
                <View style={{width: '35%'}}>
                  <Image
                    source={{uri: result.product.main_image}}
                    style={{
                      width: '100%',
                      height: 100,
                    }}
                    resizeMode="contain"
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
                </View>
              </View>

              <View style={{width: '30%', alignSelf: 'flex-end'}}>
                {result.discount !== '' && (
                  <Text style={styles.previousPrice}>
                    $
                    {(
                      parseFloat(result.price) + parseFloat(result.discount)
                    ).toFixed(2)}
                  </Text>
                )}
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
            Sold by
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 16}}>
            {item.seller.first_name + ' ' + item.seller.last_name}
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            OrderID: {item._id}
          </Text>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            Tracking Number:{' '}
            {item.tracking_number === ''
              ? 'Tracking number pending'
              : item.tracking_number}
          </Text>
        </View>
        <TouchableOpacity
          onPress={openAlertModal.bind(
            this,
            item._id,
            item.seller._id,
            item.seller.email,
            item.seller.shop_name,
          )}>
          <Icon name="ios-more" size={30} />
        </TouchableOpacity>
      </View>
      {renderProducts(item.items, item._id)}

      <Text
        style={{
          fontFamily: Fonts.poppins_light,
          fontSize: 15,
          fontWeight: '400',
          marginTop: 10,
        }}>
        {item.expected_arrival_date === ''
          ? 'Arrival date pending'
          : ' Estimated Arrival date ' +
            Moment(new Date(item.expected_arrival_date)).format('MMM DD, YYYY')}
      </Text>
      <View
        style={{
          borderTopWidth: 0.4,
          marginTop: 15,
          borderTopColor: Colors.light_grey,
        }}>
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

        {renderTrackingButton(item.tracking_number, item.expected_arrival_date)}
      </View>
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
        style={{marginBottom: 10}}
        showsVerticalScrollIndicator={false}
        data={purchased_orders}
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
          <View>
            {isLoadingMoreData && (
              <MaterialIndicator color={Colors.purple_darken} size={30} />
            )}
            {endOfFile_purchase_package && purchased_orders.length > 16 && (
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
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,
    alignSelf: 'flex-end',
  },
});

export default TrackPackageComponent;
