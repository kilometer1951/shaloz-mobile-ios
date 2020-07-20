import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import * as appActions from '../store/actions/appActions';
import AsyncStorage from '@react-native-community/async-storage';

const Footer = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const cart_data = useSelector((state) => state.appReducer.cart_data);
  const selected_footer_tab = useSelector(
    (state) => state.appReducer.selected_footer_tab,
  );
  const shop_orders = useSelector((state) => state.appReducer.shop_orders);

  return (
    <View style={{...styles.footer}}>
      <TouchableOpacity
        style={styles.footerRow}
        onPress={() => {
          dispatch(appActions.SelectedFooterTab('home'));
          props.navigation.navigate('Home');
        }}>
        <Icon
          name="ios-home"
          size={30}
          color={selected_footer_tab === 'home' ? '#000' : Colors.light_grey}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerRow}
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');

          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }

          dispatch(appActions.SelectedFooterTab('fav'));
          dispatch(appActions.fetchFavProducts(user._id, 1));
          dispatch(appActions.fetchFavShop(user._id, 1));

          props.navigation.navigate('Favorite');
        }}>
        <Icon
          name="ios-heart-empty"
          size={30}
          color={selected_footer_tab === 'fav' ? '#000' : Colors.light_grey}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerRow}
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');

          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }
          dispatch(appActions.SelectedFooterTab('profile'));
          props.navigation.navigate('Profile');
        }}>
        {shop_orders.length !== 0 && <View style={styles.notification} />}

        <Icon
          name="md-person"
          size={30}
          color={selected_footer_tab === 'profile' ? '#000' : Colors.light_grey}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerRow}
        onPress={async () => {
          const userData = await AsyncStorage.getItem('@userData');

          if (!userData) {
            props.setIsNotAuthenticated(true);
            return;
          }
          dispatch(appActions.SelectedFooterTab('cart'));
          dispatch(appActions.fetchCartData(user._id, 1));
          props.navigation.navigate('Cart');
        }}>
        {cart_data.length !== 0 && <View style={styles.notification} />}

        <Icon
          name="ios-cart"
          size={30}
          color={selected_footer_tab === 'cart' ? '#000' : Colors.light_grey}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#eeeeee',
    height: '9%',
    backgroundColor: '#fff',
  },
  footerRow: {
    width: '10%',
    marginLeft: 10,
  },

  notification: {
    backgroundColor: Colors.purple_darken,
    borderRadius: 55,
    width: 10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 10,
    position: 'absolute',
    zIndex: 1,
    marginLeft: 20,
  },
});

export default Footer;

// {/* <TouchableOpacity
// style={styles.footerRow}
// onPress={async () => {
//   // dispatch(appActions.fetchFavProducts(user._id, 1));
//   // dispatch(appActions.fetchFavShop(user._id, 1));
//   props.navigation.navigate('VideoAd');
// }}>
// <Icon name="ios-videocam" size={30} color={Colors.light_grey} />
// </TouchableOpacity> */}
