import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductPlaceholderLoader from '../ProductPlaceholderLoader';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import {ActionSheet} from 'native-base';
import OtherProducts from '../ProductCategory/OtherProducts';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';
import FastImage from 'react-native-fast-image';

const ShopComponent_ = (props) => {
  const {otherProducts, otherShops} = props;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  const openSingleScreen = (seller_id) => {
    props.navigation.navigate('Shops', {
      headerTile: 'Shop',
      backTitle: 'Search',
      seller_id: seller_id,
    });
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          const response = await appActions.loadMoreDynamicSearchShopData(
            user._id,
            props.searchInput,
            page,
          );
          setIsLoadingMoreData(false);
          if (!response.status) {
            console.log('error parsing server');
            return;
          }
          if (response.endOfFile) {
            setEndOfFile(true);
            return;
          }
          setPage((prev) => (prev = prev + 1));
          await props.setDataShop((prev) => [...prev, ...response.shops]);
        }
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    const response = await appActions.searchRefreshDynamicShop(
      user._id,
      props.searchInput,
    );
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    props.setDataShop(response.shops);
    setIsRefreshing(false);
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={openSingleScreen.bind(this, item._id)}>
      <View style={styles.productCard}>
        <View
          style={{
            backgroundColor: '#e1e4e8',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}>
          <FastImage
            source={{
              uri: item.shop_logo,
              priority: FastImage.priority.high,
            }}
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
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
            {item.shop_name.trunc(20)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  let view;
  if (props.dataShop.length === 0) {
    view = (
      <ScrollView>
        <View style={{marginTop: '10%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              padding: 20,
              textAlign: 'center',
            }}>
            No shops to show for {props.searchInput}
          </Text>
          <OtherProducts
            dataN={otherProducts}
            navigation={props.navigation}
            shops={otherShops}
          />
        </View>
      </ScrollView>
    );
  } else {
    view = (
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
        data={props.dataShop}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom: 20}}
        numColumns={2}
        extraData={props.dataShop}
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
            {endOfFile && props.dataShop.length > 16 && (
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
    );
  }

  return (
    <View style={styles.screen}>
      {!isLoading ? (
        view
      ) : (
        <View style={{marginTop: 10}}>
          <ProductPlaceholderLoader />
        </View>
      )}

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
    height: 235,
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
  },
});

export default ShopComponent_;
