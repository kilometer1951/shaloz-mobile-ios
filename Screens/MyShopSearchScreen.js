import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Share,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import NetworkError from '../components/NetworkError';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import DialogInput from 'react-native-dialog-input';
import {withNavigation} from 'react-navigation';

import * as appActions from '../store/actions/appActions';
import FastImage from 'react-native-fast-image';

const MyShopSearchScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsloading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [searchInput, setSearchInput] = useState('');

  const openEditProductScreen = (item) => {
    props.navigation.navigate('EditShopProduct', {product_data: item});
  };
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [product_id, setProduct_id] = useState('');

  const myShopSearchProducts = useSelector(
    (state) => state.appReducer.myShopSearchProducts,
  );

  const [fetching, setFetching] = useState(false);

  const fetchShopProducts = async () => {
    try {
      setIsloading(true);
      await dispatch(appActions.getMyShopSearchProducts(user._id, 1));
      setIsloading(false);
    } catch (e) {
      setIsloading(false);
      setNetworkError(true);
    }
  };

  useEffect(() => {
    const {navigation} = props;
    let focusListener = navigation.addListener('didFocus', () => {
      fetchShopProducts();
    });

    () => {
      focusListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchShopProducts();
  }, []);

  const startSearch = async () => {
    try {
      if (searchInput !== '') {
        setIsloading(true);
        await dispatch(appActions.searchShopProduct(user._id, searchInput));
        setIsloading(false);
        // setMyShopProducts(response.my_shop_product);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onShareProduct = async (product_name, product_id) => {
    try {
      const result = await Share.share({
        message: `Check this product out - ${product_name} from ${user.shop_name} on Shaloz. shaloz://product/${product_id}`,
        url: 'http://appstore.com/shaloz',
        title: 'Download the Shaloz app and visit this shop ' + user.shop_name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);

          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const removeFromStock = (product_id, product_name) => {
    Alert.alert(
      'Are you sure you want to remove ' + product_name + ' from stock',
      '',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setFetching(true);
              await appActions.removeFromStock(product_id);
              await dispatch(appActions.getMyShopProducts(user._id, 1));
              await fetchShopProducts();

              setFetching(false);
            } catch (e) {
              console.log(e);

              setFetching(false);
              setNetworkError(true);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const androidHandleAddToStock = async (product_qty) => {
    if (product_qty !== '') {
      if (!Number.isNaN(parseInt(product_qty))) {
        try {
          setFetching(true);
          await appActions.handleAddToStockWithQty(product_id, product_qty);
          await fetchShopProducts();
          await dispatch(appActions.getMyShopProducts(user._id, 1));
          setFetching(false);
        } catch (e) {
          console.log(e);

          setFetching(false);
          setNetworkError(true);
        }
      } else {
        Alert.alert(
          'Quantity value is wrong! Only numbers are allowed',
          ',',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed!'),
            },
          ],
          {cancelable: false},
        );
        return;
      }
    } else {
      Alert.alert(
        'Quantity is required',
        '',
        [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed!'),
          },
        ],
        {cancelable: false},
      );
      return;
    }
  };

  const handleAddToStock = async (product_id, product_qty) => {
    if (parseInt(product_qty) > 0) {
      //add back to stock
      try {
        setFetching(true);
        await appActions.handleAddToStockWithOutQty(product_id);
        await dispatch(appActions.getMyShopProducts(user._id, 1));
        await fetchShopProducts();

        setFetching(false);
      } catch (e) {
        console.log(e);

        setFetching(false);
        setNetworkError(true);
      }
    } else {
      if (Platform.OS === 'ios') {
        //ask prompt please add a qty to add this item back to stock
        Alert.prompt(
          'Your product quantity is less than zero. Increase your product quantity.',
          '',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'destructive',
            },
            {
              text: 'Update',
              onPress: async (product_qty) => {
                if (product_qty !== '') {
                  if (!Number.isNaN(parseInt(product_qty))) {
                    try {
                      setFetching(true);
                      await appActions.handleAddToStockWithQty(
                        product_id,
                        product_qty,
                      );
                      await fetchShopProducts();
                      await dispatch(appActions.getMyShopProducts(user._id, 1));
                      setFetching(false);
                    } catch (e) {
                      console.log(e);

                      setFetching(false);
                      setNetworkError(true);
                    }
                  } else {
                    Alert.alert(
                      'Quantity value is wrong! Only numbers are allowed',
                      ',',
                      [
                        {
                          text: 'Ok',
                          onPress: () => console.log('Cancel Pressed!'),
                        },
                      ],
                      {cancelable: false},
                    );
                    return;
                  }
                } else {
                  Alert.alert(
                    'Quantity is required',
                    '',
                    [
                      {
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed!'),
                      },
                    ],
                    {cancelable: false},
                  );
                  return;
                }
              },
            },
          ],
        );
      } else {
        setProduct_id(product_id);
        setIsDialogVisible(true);
      }
    }
  };

  const addToStock = (product_id, product_qty, product_name) => {
    Alert.alert(
      'Are you sure you want to add ' + product_name + ' back to stock',
      '',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {
          text: 'Yes, add',
          onPress: () => {
            handleAddToStock(product_id, product_qty);
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.itemsCard}>
      <View
        style={{
          padding: 10,
          width: '100%',
          flexDirection: 'row',
          borderBottomColor: Colors.light_grey,
          borderBottomWidth: 0.5,
        }}>
        <View style={{width: '80%', flexDirection: 'row'}}>
          <View style={{width: '30%'}}>
            <FastImage
              source={{uri: item.main_image, priority: FastImage.priority.high}}
              style={{
                width: '100%',
                height: 100,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={{width: '70%', marginLeft: 5}}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
              {item.product_name}
            </Text>
            <View
              style={{
                padding: 5,
                backgroundColor:
                  parseInt(item.product_qty) <= 0 ? '#fbe9e7' : '#eeeeee',
                marginTop: 5,
                borderRadius: 20,
                width: 150,
              }}>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                Qty available : {item.product_qty}
              </Text>
            </View>
            <View
              style={{
                padding: 5,
                marginTop: 5,
              }}>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                {Moment(new Date(item.date)).format('MMM Do, YYYY')}
              </Text>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                Number of views: {item.number_of_views}
              </Text>
              <Text style={{fontFamily: Fonts.poppins_regular}}>
                Last date viewed:{' '}
                {Moment(new Date(item.last_date_viewed)).format('MMM Do, YYYY')}
              </Text>
            </View>

            <View
              style={{
                paddingLeft: 5,
              }}>
              {item.inStock ? (
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    color:
                      parseInt(item.product_qty) <= 0 ? Colors.pink : 'green',
                  }}>
                  In stock
                </Text>
              ) : (
                <Text style={{fontFamily: Fonts.poppins_regular, color: 'red'}}>
                  Out of stock
                </Text>
              )}
            </View>
            <View
              style={{
                paddingLeft: 5,
              }}>
              {item.allow_purchase_when_out_of_stock && (
                <Text
                  style={{fontFamily: Fonts.poppins_regular, color: 'green'}}>
                  Can allow purchase when out of stock
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={{width: '20%', alignSelf: 'flex-end'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              alignSelf: 'flex-end',
            }}>
            ${parseFloat(item.product_price).toFixed(2)}
          </Text>
        </View>
      </View>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <TouchableOpacity onPress={openEditProductScreen.bind(this, item)}>
              <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{marginLeft: 20}}>
            {item.inStock ? (
              <TouchableOpacity
                onPress={removeFromStock.bind(
                  this,
                  item._id,
                  item.product_name,
                )}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 16,
                    color: Colors.pink,
                  }}>
                  Remove from stock
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={addToStock.bind(
                  this,
                  item._id,
                  item.product_qty,
                  item.product_name,
                )}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 16,
                    color: Colors.blue,
                  }}>
                  Add to stock
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity
          disabled={item.product_approval_status ? false : true}
          onPress={onShareProduct.bind(this, item.product_name, item._id)}>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
            {item.product_approval_status ? 'Share' : 'under-review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  let view;
  if (myShopSearchProducts.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_light,
            fontSize: 20,
            fontWeight: '300',
            textAlign: 'center',
          }}>
          No product found for: {searchInput} try searching
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1, padding: 5}}>
        <FlatList
          showsVerticalScrollIndicator={Platform.OS === 'ios' ? false : true}
          renderItem={renderItem}
          data={myShopSearchProducts}
          keyExtractor={(item) => item._id}
          extraData={myShopSearchProducts}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
        />
      </View>
    );
  }

  let searchBar;

  if (Platform.OS === 'ios') {
    searchBar = (
      <SafeAreaView>
        <View style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
          <View style={styles.search}>
            <View style={{width: '5%'}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch(appActions.getMyShopProducts(user._id, 1));
                  props.navigation.goBack();
                }}>
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
                placeholder={'Search'}
                onChangeText={(value) => setSearchInput(value)}
                value={searchInput}
                autoFocus={true}
                style={{
                  fontFamily: Fonts.poppins_regular,
                  width: '100%',
                  color: '#000',
                }}
                returnKeyType={'search'}
                onSubmitEditing={() => {
                  startSearch();
                }}
              />
            </View>

            {searchInput !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchInput('');
                  startSearch();
                }}>
                <View>
                  <Icon name="ios-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    searchBar = (
      <SafeAreaView>
        <View style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
          <View style={styles.search}>
            <View style={{width: '5%', marginLeft: 10, marginTop: 14}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  dispatch(appActions.getMyShopProducts(user._id, 1));
                  props.navigation.goBack();
                }}>
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
                placeholder={'Search'}
                onChangeText={(value) => setSearchInput(value)}
                value={searchInput}
                autoFocus={true}
                style={{
                  fontFamily: Fonts.poppins_regular,
                  width: '100%',
                  color: '#000',
                }}
                returnKeyType={'search'}
                onSubmitEditing={() => {
                  startSearch();
                }}
              />
            </View>

            {searchInput !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchInput('');
                  startSearch();
                }}>
                <View style={{marginRight: 10, marginTop: 14}}>
                  <Icon name="ios-close" size={20} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      {searchBar}

      {isLoading ? <MaterialIndicator color={Colors.purple_darken} /> : view}
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      <DialogInput
        isDialogVisible={isDialogVisible}
        title={'Increase product qty'}
        message={
          'Your product quantity is less than zero. Increase your product quantity.'
        }
        hintInput={'Qty'}
        submitText={'Add to stock'}
        textInputProps={{keyboardType: 'number-pad'}}
        submitInput={(inputText) => {
          androidHandleAddToStock(inputText);
          setIsDialogVisible(false);
        }}
        closeDialog={() => {
          setIsDialogVisible(false);
        }}></DialogInput>
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
    marginHorizontal: 2,
  },
  searchContainer: {
    height: 80,
    padding: 10,
  },

  search: {
    flexDirection: 'row',
    backgroundColor: 'red',
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
  },
});

export default withNavigation(MyShopSearchScreen);
