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
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductPlaceholderLoader from '../ProductPlaceholderLoader';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import * as appActions from '../../store/actions/appActions';
import UpdateMessage from '../UpdateMessage';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import UpdatingLoader from '../UpdatingLoader';
import {ActionSheet} from 'native-base';
import OtherProducts from '../ProductCategory/OtherProducts';
import { Toast } from 'native-base';
import FastImage from 'react-native-fast-image';

const FavoriteProductComponent = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const fav_products_data = useSelector(
    (state) => state.appReducer.fav_products_data,
  );
  const endOfFile_fav_product = useSelector(
    (state) => state.appReducer.endOfFile_fav_product,
  );
  const [networkError, setNetworkError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [page, setPage] = useState(2);

  const [otherProducts, setOtherProducts] = useState([]);
  const [shops, setShops] = useState([]);

  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchFavProducts = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchFavProducts(user._id, 1));
        const response = await appActions.fechProductByCategory(
          user._id,
          '',
          '',
          '',
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
    fetchFavProducts();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchFavProducts(user._id, 1));
      setPage(2);
      setIsRefreshing(false);
    } catch (e) {
      setIsloading(false);
      setNetworkError(true);
    }
  };

  const handleLoadMore = async () => {
    try {
      if (!endOfFile_fav_product) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(appActions.handleLoadMoreFavProducts(user._id, page));
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

      return total.toFixed(2);
    }
  };

  const visiShop = (seller_id) => {
    props.navigation.navigate('Shops', {
      headerTile: 'Shop',
      backTitle: 'Favorites',
      seller_id: seller_id,
    });
  };

  const openActionSheet = (seller_id, product_id) =>
    ActionSheet.show(
      {
        options: ['Cancel', 'Visit shop', 'Remove from favorite'],
        cancelButtonIndex: 0,
        tintColor: '#000',
        destructiveButtonIndex: 2,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          visiShop(seller_id);
        } else if (buttonIndex === 2) {
          try {
            setIsUpdating(true);
            await dispatch(appActions.removeFavProduct(user._id, product_id));
            setIsUpdating(false);
            Toast.show({
              text: 'Removed from favorites!',
              buttonText: 'Okay',
              type: "danger"
            })
          } catch (e) {
            setIsUpdating(false);
            setNetworkError(true);
          }
        }
      },
    );
  const openSingleScreen = (product_id) => {
    props.navigation.push('SingleProduct', {product_id: product_id});
  };

  const renderItem = ({item}) => (
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

        <View
          style={{
            backgroundColor: '#e1e4e8',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}>
          <FastImage
            source={{
              uri: item.product.main_image,
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
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                flexWrap: 'wrap',
                fontFamily: Fonts.poppins_regular,
                height: 49,
                fontSize: 15,
              }}>
              {item.product.product_name.trunc(35)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{marginTop: 2, flexDirection: 'row'}}>
              <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 18}}>
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
            <TouchableOpacity
              onPress={openActionSheet.bind(
                this,
                item.product.user,
                item.product._id,
              )}>
              <Icon name="ios-more" size={30} color={Colors.grey_darken} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  let view;
  if (fav_products_data.length === 0) {
    view = (
      <ScrollView>
        <View style={{marginTop: '10%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              textAlign: 'center',
            }}>
            You have not added any favorite product(s)
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
        data={fav_products_data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom: 20}}
        numColumns={2}
        extraData={fav_products_data}
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
            {endOfFile_fav_product && fav_products_data.length > 16 && (
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

      {isUpdating && <UpdatingLoader />}
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
    fontSize: 12,
    marginTop:4
  },
});

export default FavoriteProductComponent;
