import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TabHeading, Tab, Tabs} from 'native-base';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Footer from '../components/Footer';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FavoriteProductComponent from '../components/Favorite/FavoriteProductComponent';
import FavoriteShopComponent from '../components/Favorite/FavoriteShopComponent';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';

const FavoriteScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            Favorities
          </Text>
        </View>
      </SafeAreaView>
      <View style={{flex: 1}}>
        <Tabs tabBarUnderlineStyle={{backgroundColor: Colors.purple_darken, height:1}}>
          <Tab
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 17,
                  }}>
                  Items
                </Text>
              </TabHeading>
            }>
            <FavoriteProductComponent navigation={props.navigation} />
          </Tab>
          <Tab
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 17,
                  }}>
                  Shop
                </Text>
              </TabHeading>
            }>
            <FavoriteShopComponent navigation={props.navigation} />
          </Tab>
        </Tabs>
      </View>
      <Footer navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light_grey,
  },
});

export default FavoriteScreen;
