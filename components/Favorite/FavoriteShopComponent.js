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
import {ActionSheet} from "native-base"
import OtherProducts from '../ProductCategory/OtherProducts';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as appActions from '../../store/actions/appActions';

const FavoriteShopComponent = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const fav_shop_data = useSelector(
    (state) => state.appReducer.fav_shop_data,
  );
  const endOfFile_fav_shop = useSelector(
    (state) => state.appReducer.endOfFile_fav_shop,
  );
  const [networkError, setNetworkError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);


  const [otherProducts, setOtherProducts] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchFavShop = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchFavShop(user._id, 1));
        const response = await appActions.fechProductByCategory(
          user._id,
          "",
          "",
          "",
          1,
        );
        setOtherProducts(response.otherProducts);
        setShops(response.shops);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchFavShop();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchFavShop(user._id, 1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsloading(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_fav_shop) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(appActions.handleLoadMoreFavShop(user._id, page));
          setIsLoadingMoreData(false);
          setPage((prev) => (prev = prev + 1));
        }
      }
    } catch (e) {
      setIsLoadingMoreData(false);
      setNetworkError(true);
    }
  };

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
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

  const openActionSheet = () =>
  ActionSheet.show(
      {
        options: ['Cancel', 'Visit shop'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          console.log('Visit shop');
        }
      },
    );
    const openSingleScreen = (seller_id) => {
      props.navigation.navigate('Shops', {
        headerTile: 'Shop',
        backTitle: 'Favorites',
        seller_id:seller_id
      })
    };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback
      onPress={openSingleScreen.bind(this, item.seller._id)}>
      <View style={styles.productCard}>
        
        <View style={{backgroundColor:"#e1e4e8", borderTopLeftRadius: 5,borderTopRightRadius: 5}}>
          <Image
            source={{uri: item.seller.shop_logo}}
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
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize:20}}>
            {item.seller.shop_name.trunc(20)}
           
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  let view;
  if (fav_shop_data.length === 0) {
    view = (
      <ScrollView>
      <View style={{marginTop: '10%'}}>      
              <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 20,
            padding:20,
            textAlign: 'center',
          }}>
          You have not added any favorite shop(s)
        </Text>
        <OtherProducts
        dataN={otherProducts}
        navigation={props.navigation}
        shops={shops}
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
        data={fav_shop_data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2,marginBottom:20}}
        numColumns={2}
        extraData={fav_shop_data}
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
            {endOfFile_fav_shop && fav_shop_data.length > 16 && (
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

export default FavoriteShopComponent;
