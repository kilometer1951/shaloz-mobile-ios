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

} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import {MaterialIndicator} from 'react-native-indicators';
import {ActionSheet} from "native-base"
import * as appActions from '../../store/actions/appActions';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Toast from 'react-native-root-toast';

import UpdateMessage from '../UpdateMessage';

const RecentlyViewedComponent = (props) => {
  const dispatch = useDispatch();
  const [openUpdateMessage, setOpenUpdateMessage] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const user = useSelector((state) => state.authReducer.user);
  const [networkError, setNetworkError] = useState(false);

  const {
    data,
    handleRefresh,
    handleLoadMore,
    isRefreshing,
    isLoadingMoreData,
    endOfFile,
  } = props;


  String.prototype.trunc =
  String.prototype.trunc ||
  function (n) {
    return this.length > n ? this.substr(0, n - 1) + '...' : this;
  };

  const visitShop = (seller_id) => {
    props.navigation.navigate('Shops', {
      headerTile: 'Shop',
      backTitle: 'Back',
      seller_id:seller_id
    })
  };

  const addToFav_product = (product_id) => {
    console.log(product_id);
  };

  const openActionSheet = (product_id, seller_id) =>
  ActionSheet.show(
      {
        options: ['Cancel', 'Visit shop', 'Add to favorite'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          visitShop(seller_id);
        } else if (buttonIndex === 2) {
          try{
            dispatch(appActions.addFavProduct(user._id,product_id));
            Toast.show('Added to favorites', {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
          })

          } catch(e) {
            console.log(e);
            setNetworkError(true)
          }
        }
      },
    );

  const openSingleScreen = (product_id) => {
   // console.log(product_id);
    props.navigation.push('SingleProduct', {product_id:product_id});
  };

  const displayPrice = (product_price, discount) => {
    if (discount === '') {
      return product_price;
    } else {
      let price = parseInt(product_price);
      let _discount = parseInt(discount);

      let total_d = _discount / 100;
      let total_p = price * total_d;
      let total = price - total_p;

      return total;
    }
  };

  const renderItem = ({item}) => (
    <View style={{ marginHorizontal: 7,width: '45%'}}>
      <TouchableWithoutFeedback
        onPress={openSingleScreen.bind(this, item.product._id)}>
        <View style={styles.productCard}>
          {item.product.discount !== '' && (
            <View style={styles.discountContainer}>
              <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                {item.product.discount}% OFF
              </Text>
            </View>
          )}

          <View>
            <Image
              source={{url: item.product.main_image}}
              style={{
                width: '100%',
                height: 150,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{padding: 10}}>
          
            <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                fontFamily: Fonts.poppins_regular,
                height: 45,
                fontSize:15
              }}>
            {item.product.product_name.trunc(35)}
            </Text>
          </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                justifyContent: 'space-between',
              }}>
              <View style={{marginTop: 5, flexDirection: 'row'}}>
              <Text style={{fontFamily: Fonts.poppins_semibold, fontSize:18}}>
                  $
                  {displayPrice(
                    item.product.product_price,
                    item.product.discount,
                  )}
                </Text>
                {item.product.discount !== '' && (
                  <Text style={styles.previousPrice}>
                    ${item.product.product_price}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={openActionSheet.bind(this, item.product._id, item.product.user)}>
              <Icon name="ios-more" size={30} color={Colors.grey_darken}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom:20}}
        numColumns={2}
        extraData={data}
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
            {endOfFile && data.length > 16 && (
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

    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    flexWrap: 'wrap',
  },
  productCard: {
      width:"100%",
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    height: 245,
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    marginHorizontal: 8,
  },
  discountContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    marginTop: 5,
    marginLeft: 5,
    padding: 2,
    borderRadius: 5,
    opacity: 0.7,
  },
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: 5,
    fontFamily: Fonts.poppins_regular,
    fontSize: 18,

  },
});

export default RecentlyViewedComponent;
