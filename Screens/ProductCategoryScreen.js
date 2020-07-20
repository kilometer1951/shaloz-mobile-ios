import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,

  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ProductCategoryComponent from '../components/ProductCategory/ProductCategoryComponent';
import OtherProducts from '../components/ProductCategory/OtherProducts';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';

const ProductCategoryScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [data, setData] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backTitle = props.navigation.getParam('backTitle');
  const headerTile = props.navigation.getParam('headerTile');

  const main_cat = props.navigation.getParam('main_cat');
  const sub_cat_one = props.navigation.getParam('sub_cat_one');
  const sub_cat_two = props.navigation.getParam('sub_cat_two');

  useEffect(() => {
    const fechProductByCategory = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fechProductByCategory(
          user._id,
          main_cat,
          sub_cat_one,
          sub_cat_two,
          1,
        );
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }
        setData(response.data);
        setOtherProducts(response.otherProducts);
        setShops(response.shops);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fechProductByCategory();
  }, []);

  const handleLoadMore = async () => {
    try {
      if (!endOfFile) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          const response = await appActions.fechProductByCategory(
            user._id,
            main_cat,
            sub_cat_one,
            sub_cat_two,
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
          setOtherProducts(response.otherProducts);
          await setData((prev) => [...prev, ...response.data]);
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
    const response = await appActions.fechProductByCategory(
      user._id,
      main_cat,
      sub_cat_one,
      sub_cat_two,
      1,
    );
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    setData(response.data);
    setIsRefreshing(false);
  };

  let other_view;

  if (data.length <= 10 || data.length === 0) {
    console.log(data.length <= 10);

    other_view = (
      <OtherProducts
        dataN={otherProducts}
        navigation={props.navigation}
        shops={shops}
      />
    );
  }

  let view;

  if (data.length === 0) {
    view = (
      <ScrollView>
        <View style={{alignSelf: 'center', marginTop: '10%', padding: 25}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_light,
              fontSize: 20,
              fontWeight: '300',
              textAlign: 'center',
              padding: 20,
            }}>
            No products to show for {main_cat}, {sub_cat_one}, {sub_cat_two}
          </Text>
        </View>
        {other_view}
      </ScrollView>
    );
  } else {
    view = (
      <ProductCategoryComponent
        navigation={props.navigation}
        data={data}
        handleRefresh={handleRefresh}
        handleLoadMore={handleLoadMore}
        isRefreshing={isRefreshing}
        isLoadingMoreData={isLoadingMoreData}
        endOfFile={endOfFile}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  {backTitle}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_regular,
              }}>
              {headerTile}
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Search')}>
              <View style={{paddingRight: 10}}>
                <Icon
                  name="ios-search"
                  size={25}
                  style={{alignSelf: 'flex-end'}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {!isLoading ? (
        view
      ) : (
        <View style={{marginTop: 10}}>
          <ProductPlaceholderLoader />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
  },
  headerRow: {
    width: '60%',
  },
});

export default ProductCategoryScreen;
