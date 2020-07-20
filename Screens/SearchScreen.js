import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {Card} from 'react-native-elements';
import SearchCategory from '../components/Search/SearchCategory';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

const SearchScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [main_cat, setMain_cat] = useState([]);
  const [sub_cat_1, setSub_cat_1] = useState([]);
  const [sub_cat_2, setSub_cat_2] = useState([]);
  const [browseByCategory, setBrowseByCategory] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [categoryView, setCategoryaView] = useState('all_category');

  const [newSubCatOne, setNewSubCatOne] = useState([]);
  const [newSubCatTwo, setNewSubCatTwo] = useState([]);

  const [main_cat_name, setMain_cat_name] = useState('');
  const [sub_cat_one_name, setSub_cat_one_name] = useState('');

  const fetchRandomCategoryShop = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.fetchRandomCategoryShop(user._id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setShops(response.shops);
      setProducts(response.products);

      setMain_cat(response.main_cat);
      setSub_cat_1(response.sub_cat_1);
      setSub_cat_2(response.sub_cat_2);
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const dynamicSearchAllProducts = async (value) => {
    setSearchInput(value);
    if (value === '') {
      fetchRandomCategoryShop();
    } else {
      try {
        setIsLoading(true);
        const response = await appActions.dynamicSearchAllProducts(
          user._id,
          value,
        );
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }
        setShops(response.shops);
        setProducts(response.products);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    }
  };

  //display 10 random products and 6 random shops
  useEffect(() => {
    fetchRandomCategoryShop();
  }, []);

  backAction = () => {
    if (!browseByCategory) {
      props.navigation.goBack();
    } else {
      if (categoryView === 'all_category') {
        setBrowseByCategory(false);
      } else if (categoryView === 'sub_cat_one_view') {
        setCategoryaView('all_category');
      } else {
        setCategoryaView('sub_cat_one_view');
      }
    }
  };

  const productLoader = (
    <View style={{marginTop: 20}}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine style={styles.bottomPlaceholder} />
        <PlaceholderLine style={styles.bottomPlaceholder} />
        <PlaceholderLine style={styles.bottomPlaceholder} />
        <PlaceholderLine style={styles.bottomPlaceholder} />
        <PlaceholderLine style={styles.bottomPlaceholder} />
        <PlaceholderLine style={styles.bottomPlaceholder} />
        <PlaceholderLine style={styles.bottomPlaceholder} />
      </Placeholder>
    </View>
  );

  const shopLoader = (
    <View>
      <Placeholder Animation={Fade}>
        <View style={{flexDirection: 'row'}}>
          <PlaceholderMedia style={{borderRadius: 30}} />
          <View style={{marginLeft: 5}}>
            <PlaceholderLine style={{width: 150, marginTop: 4}} />
            <PlaceholderLine style={{width: 200}} />
          </View>
        </View>
      </Placeholder>
    </View>
  );

  const renderSearchProducts = products.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          props.navigation.push('SingleProduct', {product_id: result._id})
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
            {result.product_name}
          </Text>
          <Icon name="md-open" size={20} />
        </View>
      </TouchableOpacity>
    );
  });

  const renderShops = shops.map((result, index, array) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.push('Shops', {
            seller_id: result._id,
            backTitle: 'Back',
          })
        }
        key={index}>
        <View style={styles.topHeader}>
          <View style={styles.topHeaderRow_1}>
            <View>
              <Image
                source={{uri: result.shop_logo}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
                resizeMode="cover"
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 17,
                }}>
                {result.shop_name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 15,
                    color: Colors.grey_darken,
                  }}>
                  {result.first_name}
                </Text>
                <Icon
                  name="ios-radio-button-on"
                  size={10}
                  style={{marginLeft: 5, marginTop: 7, marginRight: 5}}
                  color={Colors.grey_darken}
                />
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 15,
                    color: Colors.grey_darken,
                  }}>
                  Shop owner
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <View style={{width: '5%'}}>
              <TouchableWithoutFeedback onPress={backAction}>
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
                placeholder="Search for anything"
                onChangeText={dynamicSearchAllProducts}
                value={searchInput}
                autoFocus={!browseByCategory ? true : false}
                style={{fontFamily: Fonts.poppins_regular, width: '100%'}}
                onFocus={() => setBrowseByCategory(false)}
              />
            </View>

            {searchInput !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchInput('');
                  fetchRandomCategoryShop();
                }}>
                <View>
                  <Icon name="ios-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <View style={{paddingHorizontal: 10}}>
          {!browseByCategory ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Product', {
                    backTitle: 'Home',
                    headerTile: 'Products',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.4,
                    borderBottomColor: Colors.light_grey,
                    paddingBottom: 10,
                    justifyContent: 'space-between',
                    paddingRight: 5,
                    marginBottom:10
                  }}>
                  <Text
                    style={{fontFamily: Fonts.poppins_semibold, fontSize: 15}}>
                    Shop All Categories
                  </Text>
                  <View>
                    <Icon name="ios-arrow-forward" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
           
              <TouchableOpacity
                onPress={() => {
                  setBrowseByCategory(true);
                  Keyboard.dismiss();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.4,
                    borderBottomColor: Colors.light_grey,
                    paddingBottom: 10,
                    justifyContent: 'space-between',
                    paddingRight: 5,
                  }}>
                  <Text
                    style={{fontFamily: Fonts.poppins_semibold, fontSize: 15}}>
                    Browse by product category
                  </Text>
                  <View>
                    <Icon name="ios-arrow-forward" size={20} />
                  </View>
                </View>
              </TouchableOpacity>

              <View>
                {isLoading ? (
                  productLoader
                ) : (
                  <View style={styles.dynamicSearch}>
                    {renderSearchProducts}
                  </View>
                )}

                <View style={styles.shopDisplayArea}>
                  {searchInput !== '' && (
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_semibold,
                        fontSize: 15,
                        color: Colors.grey_darken,
                      }}>
                      Shop names containing "{searchInput}"
                    </Text>
                  )}

                    {isLoading ? shopLoader : <View style={{marginBottom:30}}>{renderShops}</View>}
                </View>
              </View>
            </View>
          ) : (
            <SearchCategory
              navigation={props.navigation}
              main_cat={main_cat}
              sub_cat_1={sub_cat_1}
              sub_cat_2={sub_cat_2}
              categoryView={categoryView}
              setCategoryaView={setCategoryaView}
              newSubCatOne={newSubCatOne}
              setNewSubCatOne={setNewSubCatOne}
              newSubCatTwo={newSubCatTwo}
              setNewSubCatTwo={setNewSubCatTwo}
              main_cat_name={main_cat_name}
              sub_cat_one_name={sub_cat_one_name}
              setMain_cat_name={setMain_cat_name}
              setSub_cat_one_name={setSub_cat_one_name}
            />
          )}
        </View>
      </ScrollView>
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
  searchContainer: {
    height: 80,
    padding: 10,
  },

  search: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 15,
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
  },
  dynamicSearch: {
    paddingTop: 10,
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
});

export default SearchScreen;



// <TouchableOpacity
// onPress={() => {
//   props.navigation.navigate('Product', {
//     backTitle: 'Home',
//     headerTile: 'Products',
//   });
// }}>
// <View
//   style={{
//     flexDirection: 'row',
//     borderBottomWidth: 0.4,
//     borderBottomColor: Colors.light_grey,
//     paddingBottom: 10,
//     justifyContent: 'space-between',
//     paddingRight: 5,
//     marginBottom:10
//   }}>
//   <Text
//     style={{fontFamily: Fonts.poppins_semibold, fontSize: 15}}>
//     Browse shops by category
//   </Text>
//   <View>
//     <Icon name="ios-arrow-forward" size={20} />
//   </View>
// </View>
// </TouchableOpacity>
