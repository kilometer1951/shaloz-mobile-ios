import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,ScrollView

} from 'react-native';
import {TabHeading, Tab, Tabs,ScrollableTab} from 'native-base';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import StarRating from 'react-native-star-rating';
import ShopProducts from './ShopProducts'
import ShopDeals from './ShopDeals'
import ShopReviews from './ShopReviews'
import ShopAbout from './ShopAbout'
import ShopPolicies from './ShopPolicies'

const ShopsComponent = (props) => {
  const {seller_id} = props
  const [isVisible, setIsvisible] = useState(false)

  return (
    <View style={{flex: 1}}>
    <Tabs tabBarUnderlineStyle={{backgroundColor: Colors.purple_darken, height:1}} >
      <Tab
        heading={
          <TabHeading style={{backgroundColor: '#fff'}}>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,

              }}>
              Shop
            </Text>
          </TabHeading>
        }>
         
         <ShopProducts navigation={props.navigation} seller_id={seller_id}/>
         
      </Tab>
      <Tab
        heading={
          <TabHeading style={{backgroundColor: '#fff'}}>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              Deals
            </Text>
          </TabHeading>
        }>
        <ShopDeals navigation={props.navigation} seller_id={seller_id}/>
      </Tab>
      <Tab
        heading={
          <TabHeading style={{backgroundColor: '#fff'}}>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              Reviews
            </Text>
          </TabHeading>
        }>
         <ShopReviews navigation={props.navigation} seller_id={seller_id}/>
      </Tab>
      {isVisible &&   <Tab
        heading={
          <TabHeading style={{backgroundColor: '#fff'}}>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              About
            </Text>
          </TabHeading>
        }>
         <ShopAbout navigation={props.navigation} seller_id={seller_id}/>
      </Tab>}
    
      <Tab
        heading={
          <TabHeading style={{backgroundColor: '#fff'}}>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              Policies
            </Text>
          </TabHeading>
        }>
         <ShopPolicies navigation={props.navigation}/>
      </Tab>
      
    
    </Tabs>
  </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    padding: 10,
    borderWidth: 1.6,
    borderRadius: 50,
  },
  container: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginRight: 10,
  },
});

export default ShopsComponent;
