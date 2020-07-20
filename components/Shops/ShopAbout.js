import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,

  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import * as appActions from '../../store/actions/appActions';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ShopAbout = (props) => {
  const dispatch = useDispatch();
  const {seller_id} = props
  const [aboutMe, setAboutMe] = useState("")
  const [shop_name, setShop_name] = useState("")

useEffect(() => {
  const fetchShopAboutMe = async () => {
    try{
   const response =   await appActions.fetchShopAboutMe(seller_id)
   setAboutMe(response.seller.about)
   setShop_name(response.seller.shop_name)
    } catch(e) {
      console.log(e);
      
    }
  }; 
  fetchShopAboutMe();
}, []);


  return (
    <ScrollView>
      <Text
        style={{
          marginTop: 20,
          marginLeft: 10,
          fontFamily: Fonts.poppins_light,
          fontSize: 25,
        }}>
        About {shop_name}
      </Text>
      
      <View style={{paddingHorizontal: 5}}>
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
          }}>
         {aboutMe}
        </Text>
     
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customButton: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems:'center',
    width: '60%',
    padding: 8,
    borderWidth: 1.6,
    borderRadius: 50,
    marginRight: 10,
    marginBottom:40,
    marginTop:20
  },
});

export default ShopAbout;
