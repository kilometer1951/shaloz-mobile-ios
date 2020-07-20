import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,

  TouchableOpacity,
  Image,
  ScrollView,
 
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const OtherProducts = (props) => {
  const dispatch = useDispatch();

  const {dataN,shops} = props;

  const renderItems = dataN.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          props.navigation.navigate('SingleProduct', {product_id: result._id})
        }>
        <View style={{marginRight: 10, width:180, height:160}}>
          {result.discount !== '' && (
            <View style={styles.discountContainer}>
              <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                {result.discount}% OFF
              </Text>
            </View>
          )}
          <Image
            source={{url: result.main_image}}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  });




  const renderShops = shops.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
            props.navigation.navigate('Shops', {
                headerTile: 'Shop',
                backTitle: 'Favorites',
                seller_id:result._id
              })
        }>
        <View style={{marginRight: 10, width:180, height:160}}>
          
          <Image
            source={{url: result.shop_logo}}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  });


  return (
    <View style={styles.beautyContainer}>
       <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular, padding:5}}>
          Products you might be interested in
        </Text>
      <ScrollView
        horizontal={true}
        style={{marginTop: 5}}
        showsHorizontalScrollIndicator={false}>
        {renderItems}
      </ScrollView>


      <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular, padding:5, marginTop:50}}>
          Shops you might be interested in
        </Text>
      <ScrollView
        horizontal={true}
        style={{marginTop: 5}}
        showsHorizontalScrollIndicator={false}>
        {renderShops}
      </ScrollView>

      
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default OtherProducts;
