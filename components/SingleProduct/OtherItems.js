import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const OtherItems = (props) => {
  const {dataN, pressAction} = props;

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + ' . . .' : this;
    };

  const renderItem_other_items = dataN.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={pressAction.bind(this, result._id)}>
        <View style={styles.otherItemsCard}>
          {result.discount !== '' && (
            <View style={styles.discountContainer}>
              <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                {result.discount}% OFF
              </Text>
            </View>
          )}
          <View
            style={{
              backgroundColor: '#e1e4e8',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}>
            <Image
              source={{uri: result.main_image}}
              style={{
                width: '100%',
                height: 150,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{padding: 7}}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
              {result.product_name.trunc(15)}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '60%'}}>
                <Text style={{fontFamily: Fonts.poppins_light, fontSize: 17}}>
                  {result.main_category.trunc(8)}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end', width: '40%'}}>
                <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
                  ${parseFloat(result.product_price).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.otherItems}>
      <View style={{padding: 10, marginTop: 10}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 17,
          }}>
          {props.title}
        </Text>
      </View>
      <ScrollView
        horizontal={true}
        style={{marginTop: 5}}
        showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row'}}>
          {renderItem_other_items}
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate('Product', {
                backTitle: 'Back',
                headerTile: 'Product',
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 50,
                alignSelf: 'center',
                marginRight: 40,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 17,
                  color: Colors.purple_darken,
                }}>
                See all
              </Text>
              <Icon
                name="ios-arrow-forward"
                size={20}
                style={{marginRight: 5, marginTop: 1, marginLeft: 15}}
                color={Colors.purple_darken}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  otherItems: {
    borderTopWidth: 0.4,
    borderTopColor: Colors.light_grey,
    paddingBottom: 30,
  },

  otherItemsCard: {
    marginRight: 10,
    width: 180,
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginLeft: 10,
    backgroundColor: '#fff',
    height: 215,
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
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
});

export default OtherItems;
