import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import HorizontalProducts from './HorizontalProducts';
import ProductList from './ProductList';
import SingleCard from './SingleCard';
import SingleCardProducts from './SingleCardProducts';
import HorizontalProductCard from './HorizontalProductCard';
import * as appActions from '../../store/actions/appActions';

const Product = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const fetched_home_data = useSelector(
    (state) => state.appReducer.fetched_home_data,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshHome = async () => {
    try {
      setIsRefreshing(true);
      await dispatch(appActions.fetchHomeProducts(user._id));
      await dispatch(appActions.fetchCartData(user._id, 1));
      setIsRefreshing(false);
    } catch (e) {
      setIsRefreshing(false);
      setNetworkError(true);
    }
  };

  let banner_message;

  if (Object.entries(user).length === 0) {
    banner_message = (
      <TouchableOpacity
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');
          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }
          dispatch(appActions.SelectedFooterTab('profile'));
          props.navigation.navigate('Profile');
        }}>
        <View style={styles.firstSection}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '10%', alignSelf: 'center'}}>
              <Icon name="ios-heart" size={30} />
            </View>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.poppins_light,
                  fontWeight: 'normal',
                }}>
                Build your online store and start selling. Millions of shoppers
                can’t wait to see what you have in store. No monthly fees,
                automatic deposits and seller protection.
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else if (user.shop_setup === 'not_complete') {
    banner_message = (
      <TouchableOpacity
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');
          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }
          dispatch(appActions.SelectedFooterTab('profile'));
          props.navigation.navigate('Profile');
        }}>
        <View style={styles.firstSection}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '10%', alignSelf: 'center'}}>
              <Icon name="ios-heart" size={30} />
            </View>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.poppins_light,
                  fontWeight: 'normal',
                }}>
                Build your online store and start selling. Millions of shoppers
                can’t wait to see what you have in store. No monthly fees,
                automatic deposits and seller protection.
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
   } //else {
  //   banner_message = (
  //     <TouchableOpacity
  //       onPress={async () => {
  //         const userData = await AsyncStorage.getItem('@userData');
  //         if (!userData) {
  //           props.setIsNotAuthenticated(true);
  //           return;
  //         }
  //         dispatch(appActions.SelectedFooterTab('profile'));
  //         props.navigation.navigate('Profile');
  //       }}>
  //       <View style={styles.firstSection_1}>
  //         <View style={{flexDirection: 'row'}}>
  //           <View style={{width: '10%', alignSelf: 'center'}}>
  //             <Icon name="ios-heart" size={30} />
  //           </View>
  //           <View style={{width: '90%'}}>
  //             <Text
  //               style={{
  //                 fontSize: 15,
  //                 fontFamily: Fonts.poppins_light,
  //                 fontWeight: 'normal',
                  
  //               }}>
  //               Independent sellers. Buy directly from someone who put their
  //               heart and soul into making something special. Secure shopping.
  //               We use best-in-class technology to protect your transactions.
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          onRefresh={handleRefreshHome}
          refreshing={isRefreshing}
          tintColor="#000"
          titleColor="#000"
          title="Pull to refresh"
        />
      }>
      {banner_message}

      {Object.entries(user).length === 0 && (
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => {
            props.setIsNotAuthenticated(true);
          }}>
          <View style={styles.secondSection}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '7%', alignSelf: 'center'}}>
                <Icon name="ios-log-in" size={20} />
              </View>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_light,
                    fontWeight: 'normal',
                  }}>
                  Login or sign up to continue
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <HorizontalProducts
        heading="Health & Beauty"
        navigation={props.navigation}
        dataN={fetched_home_data.health_beauty}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />

      <SingleCard
        navigation={props.navigation}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />

      <HorizontalProducts
        heading="Baby, Kids & Maternity"
        navigation={props.navigation}
        dataN={fetched_home_data.baby_kids_mat}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <ProductList
        heading="Cell Phones & Accessories "
        navigation={props.navigation}
        dataN={fetched_home_data.cell_phone_acc}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />

      <HorizontalProductCard
        text="Mark your identity"
        heading="Hair Products & Supplies"
        navigation={props.navigation}
        dataN={fetched_home_data.hair_products}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <ProductList
        heading="Jewelry"
        navigation={props.navigation}
        dataN={fetched_home_data.jewelry}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <SingleCardProducts
        image={require('../../assets/fashion.jpeg')}
        text="Everyday living. Be unique, be brave, be divine"
        heading="Fashion"
        navigation={props.navigation}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />

      <HorizontalProductCard
        text="Recommend for you"
        heading="Home & Garden"
        navigation={props.navigation}
        dataN={fetched_home_data.home_garden}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <ProductList
        heading="Musical Instruments"
        navigation={props.navigation}
        dataN={fetched_home_data.musical_instru}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <SingleCardProducts
        image={require('../../assets/games.jpeg')}
        text="Adding Fun to your Life. Playing Ideas for Life"
        heading="Games & Accessories"
        navigation={props.navigation}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <HorizontalProductCard
        text="Shop from the best"
        heading="Wedding, Party & Events"
        navigation={props.navigation}
        dataN={fetched_home_data.wedding_party}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <SingleCardProducts
        image={require('../../assets/toys.jpg')}
        text="Every Toys have Spirit of Joy. Feel the Wonder of Toys"
        heading="Toys & Gifts"
        navigation={props.navigation}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />

      <ProductList
        heading="Workout Supplements"
        navigation={props.navigation}
        dataN={fetched_home_data.work_out_suplement}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />

      <SingleCardProducts
        image={require('../../assets/pet.jpg')}
        text="Stores that are full of Surprises. Making your Pet Happier"
        heading="Pet Supplies"
        navigation={props.navigation}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <ProductList
        heading="Shop All Categories"
        navigation={props.navigation}
        dataN={fetched_home_data.all_cat}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
      <SingleCardProducts
        image={require('../../assets/handmade.jpg')}
        text="Stay loyal to your creativity beause it's a gift"
        heading="Art & Design"
        navigation={props.navigation}
        setIsNotAuthenticated={props.setIsNotAuthenticated}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  secondSection: {
    padding: 10,
    height: 50,
    backgroundColor: '#f5f5f5',
    width: '95%',
    marginLeft: 10,
    borderRadius: 10,
  },
  firstSection: {
    padding: 10,
    height: 110,
    backgroundColor: '#fbe9e7',
    width: '95%',
    marginLeft: 10,
    borderRadius: 10,
  },

  firstSection_1: {
    padding: 10,
    height: 140,
    backgroundColor: '#fbe9e7',
    width: '95%',
    marginLeft: 10,
    borderRadius: 10,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    flexWrap: 'wrap',
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

export default Product;
