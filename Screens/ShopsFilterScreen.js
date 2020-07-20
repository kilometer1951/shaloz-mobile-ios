import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ProductComponent from '../components/ProductComponent';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';

const ProductScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);
  const [catIsLoading, setCatIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [data, setData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [endPoint, setEndPoint] = useState('all_product');
  const [main_cat, setMain_cat] = useState('');
  const seller_id = props.navigation.getParam('seller_id');

  useEffect(() => {
    const fetchShopCategories = async () => {
      setCatIsLoading(true);
      const response = await appActions.fetchShopCategories(seller_id);
      setCatIsLoading(false);
      setCatData(response.categories);
    };
    fetchShopCategories();
  }, []);

  const applyShopFilter = async (main_cat) => {
    setEndPoint('categories');
    setEndOfFile(false);
    setMain_cat(main_cat);
    setPage(2);
    setIsLoading(true);

    const response = await appActions.applyShopFilter(seller_id, main_cat, 1);
    setIsLoading(false);
    setData(response.data);
  };



  const categories = catData.map((result, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={applyShopFilter.bind(this, result._id)}>
        <View
          style={{
            marginRight: 20,
            backgroundColor: '#eeeeee',
            borderRadius: 50,
            padding: 10,
          }}>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
            {result._id} ({result.count})
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  useEffect(() => {
    const fetchShopsProduct = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fetchShopsProduct(seller_id, 1);
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }

        setData(response.data);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchShopsProduct();
  }, []);

  const handleLoadMore = async () => {
    if (endPoint === 'all_product') {
      try {
        if (!endOfFile) {
          if (!isLoadingMoreData) {
            setIsLoadingMoreData(true);
            const response = await appActions.fetchShopsProduct(seller_id, page);
            setIsLoadingMoreData(false);
            if (!response.status) {
              console.log('error parsing server');
              return;
            }
            if (response.endOfFile) {
              setEndOfFile(true);
              return;
            }
            console.log(endOfFile);
            setPage((prev) => (prev = prev + 1));
            await setData((prev) => [...prev, ...response.data]);
          }
        }
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    } else {
      try {
        if (!endOfFile) {
          if (!isLoadingMoreData) {
            setIsLoadingMoreData(true);
            const response = await appActions.applyShopFilter(
                seller_id,
              main_cat,
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
            console.log(endOfFile);
            setPage((prev) => (prev = prev + 1));
            await setData((prev) => [...prev, ...response.data]);
          }
        }
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    }
  };

  const handleRefresh = async () => {
    if (endPoint === 'all_product') {
      setIsRefreshing(true);
      setEndOfFile(false);
      setPage(2);
      const response = await appActions.fetchShopsProduct(seller_id, 1);
      if (!response.status) {
        //console.log('error parsing server');
        return;
      }
      //  console.log(response);
      setData(response.data);
      setIsRefreshing(false);
    } else {
      setIsRefreshing(true);
      setEndOfFile(false);
      setPage(2);
      const response = await appActions.applyShopFilter(seller_id, main_cat, 1);
      if (!response.status) {
        //console.log('error parsing server');
        return;
      }
      //  console.log(response);
      setData(response.data);
      setIsRefreshing(false);
    }
  };

  let view;

  if (data.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 20,
            textAlign: 'center',
            padding: 20,
          }}>
          No products to show
        </Text>
      </View>
    );
  } else {
    view = (
      <ProductComponent
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
                  Back
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
              Filter
            </Text>
          </View>
          <View style={{width: '20%'}}></View>
        </View>
      </SafeAreaView>
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {!catIsLoading ? (
        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{padding: 10}}>
              <View style={styles.categories}>{categories}</View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{marginTop: 20, marginBottom: 20}}>
          <ActivityIndicator />
        </View>
      )}
      {!isLoading ? (
        <View style={{flex: 1}}>{view}</View>
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

  categories: {
    flexDirection: 'row',
  },
});

export default ProductScreen;
