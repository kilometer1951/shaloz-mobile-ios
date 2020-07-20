import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
 
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ProductComponent from '../components/ProductComponent';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import ShopsComponent from '../components/Shops/ShopsComponent';

const ShopsScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const backTitle = props.navigation.getParam('backTitle');
  const headerTile = props.navigation.getParam('headerTile');
  const seller_id = props.navigation.getParam('seller_id');

  

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '25%'}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  {backTitle}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Shop
            </Text>
          </View>
          <View style={{width: '25%'}}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("SearchShop", {seller_id:seller_id})
              }}>
              <View style={{paddingRight: 10, marginTop: 2}}>
                <Icon
                  name={'ios-search'}
                  size={20}
                  style={{alignSelf: 'flex-end', marginRight: 10}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {!isLoading ? (
        <ShopsComponent navigation={props.navigation} seller_id={seller_id}/>
      ) : (
        <View style={{marginTop: 10}}>
          <ProductPlaceholderLoader />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
  },
  headerRow: {
    width: '50%',
  },
});

export default ShopsScreen;
