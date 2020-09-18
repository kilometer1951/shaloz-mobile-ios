import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import SearchShop from '../components/Shops/SearchShop';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';
import {NetworkConsumer} from 'react-native-offline';
import ConnectionError from '../components/ConnectionError';
const SearchShopScreen = (props) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [browseByCategory, setBrowseByCategory] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [isSearching, setIsSearching] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [products, setProducts] = useState([]);

  const seller_id = props.navigation.getParam('seller_id');

  const onChangeText = (value) => {
    setSearchInput(value);
  };

  const fetchRandomSellerShopProducts = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.fetchRandomSellerShopProducts(
        seller_id,
      );
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setProducts(response.products);
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      setNetworkError(true);
    }
  };

  useEffect(() => {
    fetchRandomSellerShopProducts();
  }, []);

  const dynamicSearchSellerProducts = async (value) => {
    setSearchInput(value);
    if (value === '') {
      fetchRandomSellerShopProducts();
    } else {
      try {
        setIsSearching(true);
        const response = await appActions.dynamicSearchSellerProducts(
          seller_id,
          value,
        );
        setIsSearching(false);
        if (!response.status) {
          setIsSearching(false);
          setNetworkError(true);
          return;
        }
        setProducts(response.products);
      } catch (e) {
        console.log(e);
        setIsSearching(false);
        setNetworkError(true);
      }
    }
  };

  let searchBar;

  if (Platform.OS === 'ios') {
    searchBar = (
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <View style={{width: '5%'}}>
              <TouchableWithoutFeedback
                onPress={() => props.navigation.goBack()}>
                <View>
                  <Icon
                    name="ios-arrow-back"
                    size={20}
                    style={{marginRight: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{width: '90%'}}>
              <TextInput
                placeholderTextColor="#bdbdbd"
                placeholder={'Search for any product in this shop'}
                style={{
                  fontFamily: Fonts.poppins_regular,
                  width: '100%',
                  color: '#000',
                }}
                onChangeText={dynamicSearchSellerProducts}
                value={searchInput}
                autoFocus={!browseByCategory ? true : false}
                style={{fontFamily: Fonts.poppins_regular, width: '100%'}}
              />
            </View>

            {searchInput !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchInput('');
                  fetchRandomSellerShopProducts();
                }}>
                <View>
                  <Icon name="ios-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
          <View style={styles.filterContainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.push('ShopsFilterScreen', {
                  seller_id: seller_id,
                })
              }>
              <View>
                <Icon name="md-funnel" size={20} style={{marginRight: 2}} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    searchBar = (
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <View style={{width: '5%', marginLeft: 10, marginTop: 14}}>
              <TouchableWithoutFeedback
                onPress={() => props.navigation.goBack()}>
                <View>
                  <Icon
                    name="ios-arrow-back"
                    size={20}
                    style={{marginRight: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{width: '87%'}}>
              <TextInput
                placeholderTextColor="#bdbdbd"
                placeholder={'Search for any product in this shop'}
                style={{
                  fontFamily: Fonts.poppins_regular,
                  width: '100%',
                  color: '#000',
                }}
                onChangeText={dynamicSearchSellerProducts}
                value={searchInput}
                autoFocus={!browseByCategory ? true : false}
                style={{fontFamily: Fonts.poppins_regular, width: '100%'}}
              />
            </View>

            {searchInput !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchInput('');
                  fetchRandomSellerShopProducts();
                }}>
                <View style={{marginRight: 10, marginTop: 14}}>
                  <Icon name="ios-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
          <View style={styles.filterContainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.push('ShopsFilterScreen', {
                  seller_id: seller_id,
                })
              }>
              <View>
                <Icon name="md-funnel" size={20} style={{marginRight: 2}} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.screen}>
      {searchBar}
      {isSearching && (
        <ActivityIndicator
          size="large"
          color={Colors.purple_darken}
          style={{marginTop: 20}}
        />
      )}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {!isLoading ? (
        <View style={{paddingHorizontal: 10, flex: 1}}>
          <SearchShop navigation={props.navigation} products={products} />
        </View>
      ) : (
        <View style={{marginTop: 10}}>
          <ProductPlaceholderLoader />
        </View>
      )}
      <NetworkConsumer>
        {({isConnected}) =>
          !isConnected && <ConnectionError networkValue={false} />
        }
      </NetworkConsumer>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 10,
    flexDirection: 'row',
    paddingLeft: Platform.OS === 'ios' ? 10 : 0,
    paddingRight: Platform.OS === 'ios' ? 10 : 0,
  },

  search: {
    flexDirection: 'row',
    padding: Platform.OS === 'ios' ? 15 : 0,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 0.5},
    elevation: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    shadowOpacity: 0.8,
    shadowRadius: 1,
    width: '85%',
  },
  dynamicSearch: {
    paddingTop: 10,
    height: 200,
  },
  shopDisplayArea: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 0.4,
    borderTopColor: Colors.light_grey,
    opacity: 0.6,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topHeaderRow_1: {
    flexDirection: 'row',
    width: '60%',
    paddingTop: 15,
  },
  filterContainer: {
    backgroundColor: '#fff',
    width: '10%',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchShopScreen;
