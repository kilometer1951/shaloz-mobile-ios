import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import {MaterialIndicator} from 'react-native-indicators';
import * as appActions from '../../store/actions/appActions';
import UpdateMessage from '../UpdateMessage';
import NetworkError from '../NetworkError';
import {ActionSheet} from 'native-base';
import {Toast} from 'native-base';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import FastImage from 'react-native-fast-image';

const ProductCategoryComponent = (props) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [networkError, setNetworkError] = useState(false);

  const {
    data,
    handleRefresh,
    handleLoadMore,
    isRefreshing,
    isLoadingMoreData,
    endOfFile,
  } = props;

  const displayPrice = (product_price, discount) => {
    if (discount === '') {
      return parseFloat(product_price).toFixed(2);
    } else {
      let price = parseInt(product_price);
      let _discount = parseInt(discount);

      let total_d = _discount / 100;
      let total_p = price * total_d;
      let total = price - total_p;

      return total.toFixed(2);
    }
  };

  const visiShop = (seller_id) => {
    props.navigation.navigate('Shops', {
      headerTile: 'Shop',
      backTitle: 'Products',
      seller_id: seller_id,
    });
  };

  const openActionSheet = (seller_id, product_id) =>
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
          visiShop(seller_id);
        } else if (buttonIndex === 2) {
          try {
            dispatch(appActions.addFavProduct(user._id, product_id));
            Toast.show({
              text: 'Added to favorites!',
              buttonText: 'Okay',
            });
          } catch (e) {
            setNetworkError(true);
          }
        }
      },
    );

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() =>
        props.navigation.push('SingleProduct', {product_id: item._id})
      }>
      <View style={styles.productCard}>
        {item.discount !== '' && (
          <View style={styles.discountContainer}>
            <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
              {item.discount}% OFF
            </Text>
          </View>
        )}
        <View>
          <FastImage
            source={{uri: item.main_image, priority: FastImage.priority.high}}
            style={{
              width: '100%',
              height: 150,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                fontFamily: Fonts.poppins_regular,
                height: 49,
                fontSize: 15,
              }}>
              {item.product_name.trunc(35)}
            </Text>
          </View>
          {isVisible && (
            <View
              style={{
                padding: 5,
                backgroundColor: '#eeeeee',
                marginTop: 5,
                borderRadius: 20,
                width: 120,
              }}>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                Free Shipping
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{marginTop: 2, flexDirection: 'row'}}>
              <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 18}}>
                ${displayPrice(item.product_price, item.discount)}
              </Text>
              {item.discount !== '' && (
                <Text style={styles.previousPrice}>
                  ${parseFloat(item.product_price).toFixed(2)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={openActionSheet.bind(this, item.user, item._id)}>
              <Icon name="ios-more" size={30} color={Colors.grey_darken} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
        style={{marginTop: 2, marginBottom: Platform.OS === 'ios' ? 20 : 0}}
        numColumns={2}
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
    width: '47%',
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

export default ProductCategoryComponent;
