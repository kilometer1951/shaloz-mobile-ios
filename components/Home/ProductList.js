import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import {ActionSheet} from 'native-base';
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ProductDesignComponent from '../ProductDesignComponent';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
{
  /* <UpdateMessage
openUpdateMessage={openUpdateMessage}
setOpenUpdateMessage={setOpenUpdateMessage}
updateMessage={updateMessage}
/> */
}
const ProductList = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const {dataN} = props;
  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [networkError, setNetworkError] = useState(false);
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
            // dispatch(appActions.)
            Toast.show({
              text: 'Added to favorites!',
              buttonText: 'Okay',
            });
          } catch (e) {
            console.log(e);
            setNetworkError(true);
          }
        }
      },
    );

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };
  const openSingleScreen = (product_id) => {
    props.navigation.navigate('SingleProduct', {product_id: product_id});
  };

  const renderItem_beauty_barber = dataN.map((result, index, array) => {
    return (
      <View style={{width: '49%'}} key={result._id}>
        <ProductDesignComponent
          openSingleScreen={openSingleScreen.bind(this, result._id)}
          discount={result.discount}
          main_image={result.main_image}
          product_name={result.product_name}
          openActionSheet={openActionSheet.bind(this, result.user, result._id)}
          product_price={result.product_price}
          setIsNotAuthenticated={props.setIsNotAuthenticated}
        />
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 1,
          marginTop: 10,
          width: '100%',
          paddingRight: 10,
          paddingLeft: 10,
        }}>
        <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
          {props.heading}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const userData = await AsyncStorage.getItem('@userData');

            if (!userData) {
              props.setIsNotAuthenticated(true);
              return;
            }

            if (props.heading !== 'Shop All Categories') {
              if (props.heading === 'Workout Supplements') {
                props.navigation.navigate('ProductCategory', {
                  backTitle: 'Home',
                  headerTile: 'Workout Supplements',
                  main_cat: 'Workout Supplements & Equipments',
                  sub_cat_one: '',
                  sub_cat_two: '',
                });
              } else {
                props.navigation.navigate('ProductCategory', {
                  backTitle: 'Home',
                  headerTile: props.heading,
                  main_cat: props.heading,
                  sub_cat_one: '',
                  sub_cat_two: '',
                });
              }
            } else {
              props.navigation.navigate('Product', {
                backTitle: 'Home',
                headerTile: 'Products',
              });
            }
          }}>
          <Text style={{color: Colors.blue, marginTop: 4}}>See more</Text>
        </TouchableOpacity>
      </View>
      {renderItem_beauty_barber}

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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginRight: 5,
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
  productCard: {
    width: '48%',
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
  },

  previousPrice: {
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
});

export default ProductList;
