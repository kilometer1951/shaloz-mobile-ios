import React, {useState, useEffect, PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import UpdatingLoader from '../UpdatingLoader';
import CartPlaceHolder from '../CartPlaceHolder';
import Moment from 'moment';
//import {Tooltip} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import UpdateMessage from '../UpdateMessage';
import FastImage from 'react-native-fast-image';

import ToolTip from '../../Modal/ToolTip';
import SellerWeeklyActivityPureComponent from './PureComponents/SellerWeeklyActivityPureComponent';

const SellerWeeklyActivityComponent = (props) => {
  const dispatch = useDispatch();
  const seller_weekly_activity = useSelector(
    (state) => state.appReducer.seller_weekly_activity,
  );
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const endOfFile_seller_weekly_activity = useSelector(
    (state) => state.appReducer.endOfFile_seller_weekly_activity,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);
  const [networkError, setNetworkError] = useState(false);

  const [toolTipVisible, setToolTipVisible] = useState(false);

  const [textToRender, setTextToRender] = useState('');

  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const start_of_week = Moment().startOf('isoWeek');
  const end_of_week = Moment().endOf('isoWeek');

  useEffect(() => {
    const fetchSellerWeeklyActivity = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          appActions.fetchSellerWeeklyActivity(
            user._id,
            1,
            new Date(start_of_week),
            new Date(end_of_week),
          ),
        );
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchSellerWeeklyActivity();
  }, []);

  const openAlertModal = (cart_id) => {
    Alert.alert(
      'Help',
      '',
      [
        {
          text: 'Help',
          onPress: () => {
            Linking.openURL(
              'mailto:support@theshop.com?cc=&subject=Issue with OrderID' +
                cart_id +
                '&body=My orderID is ' +
                cart_id +
                ' ......',
            );
          },
        },

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(
        appActions.fetchSellerWeeklyActivity(
          user._id,
          1,
          new Date(start_of_week),
          new Date(end_of_week),
        ),
      );
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_seller_weekly_activity) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(
            appActions.handleLoadMoreSellerWeeklyActivity(
              user._id,
              page,
              new Date(start_of_week),
              new Date(end_of_week),
            ),
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

  const calculateDiscount = (items) => {
    let total_discount = 0.0;
    for (let i = 0; i < items.length; i++) {
      let discount =
        items[i].discount !== '' ? parseFloat(items[i].discount) : 0.0;
      total_discount += discount;
    }

    return total_discount.toFixed(2);
  };

  const calculateTotalDiscount = (cart) => {
    let discount_from_items = parseFloat(calculateDiscount(cart.items));
    let store_discount = cart.store_promotion_discount_is_applied
      ? parseFloat(cart.store_promotion_discount)
      : 0.0;

    return (discount_from_items + store_discount).toFixed(2);
  };

  const calculateVariant = (selected_variant_value) => {
    let total = 0.0;
    for (let i = 0; i < selected_variant_value.length; i++) {
      let price = parseFloat(selected_variant_value[i].price);
      total += price;
    }
    return total;
  };

  const orderTotal = (cart) => {
    let total = 0.0;
    for (let i = 0; i < cart.items.length; i++) {
      let price =
        (parseFloat(cart.items[i].price) +
          parseFloat(calculateVariant(cart.items[i].selected_variant_value))) *
          parseInt(cart.items[i].qty) +
        parseFloat(
          cart.items[i].discount !== '' ? cart.items[i].discount : 0.0,
        );

      total += price;
    }
    return (parseFloat(total) + parseFloat(cart.shippment_price)).toFixed(2);
  };

  const clientPaid = (cart) => {
    let total =
      parseFloat(orderTotal(cart)) + parseFloat(cart.amount_in_cash_redeemed);
    return (
      parseFloat(total) - parseFloat(calculateTotalDiscount(cart))
    ).toFixed(2);
  };

  const renderItem = ({item}) => (
    <SellerWeeklyActivityPureComponent
      item={item}
      openAlertModal={openAlertModal}
      calculateDiscount={calculateDiscount}
      calculateTotalDiscount={calculateTotalDiscount}
      calculateVariant={calculateVariant}
      orderTotal={orderTotal}
      clientPaid={clientPaid}
      toolTipVisible={toolTipVisible}
      setToolTipVisible={setToolTipVisible}
      textToRender={textToRender}
      setTextToRender={setTextToRender}
    />
  );

  let view;
  if (seller_weekly_activity.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 20,
            textAlign: 'center',
            padding: 20,
          }}>
          No data to show yet
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
          extraData={seller_weekly_activity}
          maxToRenderPerBatch={1}
          removeClippedSubviews={true}
          style={{marginBottom: Platform.OS === 'ios' ? 10 : 0}}
          showsVerticalScrollIndicator={false}
          data={seller_weekly_activity}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          onEndReachedThreshold={0.5}
          initialNumToRender={1}
          onMomentumScrollBegin={() => {
            handleLoadMore();
          }}
          ListFooterComponent={
            <View>
              {isLoadingMoreData && (
                <MaterialIndicator color={Colors.purple_darken} size={30} />
              )}
              {endOfFile_seller_weekly_activity &&
                seller_weekly_activity.length > 16 && (
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
      {isLoading ? <CartPlaceHolder /> : view}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {isUpdating && <UpdatingLoader />}
      {openUpdateMessage && (
        <UpdateMessage
          openUpdateMessage={openUpdateMessage}
          setOpenUpdateMessage={setOpenUpdateMessage}
          updateMessage={updateMessage}
        />
      )}

      <ToolTip
        toolTipVisible={toolTipVisible}
        setToolTipVisible={setToolTipVisible}
        textToRender={textToRender}
        setTextToRender={setTextToRender}
      />
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

export default SellerWeeklyActivityComponent;

{
  /* <FlatList
    ref={(ref) => { this.flatListRef = ref; }}
    data={allPosts}
    initialNumToRender={7}
    renderItem={({ item }) =>
      <Post postJson={item} isGroupAdmin={isGroupAdmin} user={user} />
    }
  /> */
}
