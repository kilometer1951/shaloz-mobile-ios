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
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';
import FastImage from 'react-native-fast-image';
import ProductComponent from '../components/SearchProduct/ProductComponent';
import ShopComponent from '../components/SearchProduct/ShopComponent';
import {TabHeading, Tab, Tabs} from 'native-base';

const SearchProductScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataShop, setDataShop] = useState([]);

  const [otherProducts, setOtherProducts] = useState([]);
  const [otherShops, setOtherShops] = useState([]);

  const searchInput = props.navigation.getParam('searchInput');

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  useEffect(() => {
    const searchDynamicProduct = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.searchDynamicProduct(
          user._id,
          searchInput,
        );
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }
        setDataProduct(response.products);
        setDataShop(response.shops);

        setOtherProducts(response.otherProducts);
        setOtherShops(response.otherShops);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    };
    searchDynamicProduct();
  }, []);

  let view = (
    <Tabs
      tabBarUnderlineStyle={{backgroundColor: Colors.purple_darken, height: 1}}
      locked={true}>
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
        <ProductComponent
          navigation={props.navigation}
          dataProduct={dataProduct}
          setDataProduct={setDataProduct}
          searchInput={searchInput}
          otherProducts={otherProducts}
          otherShops={otherShops}
        />
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
        <ShopComponent
          navigation={props.navigation}
          dataShop={dataShop}
          setDataShop={setDataShop}
          searchInput={searchInput}
          otherProducts={otherProducts}
          otherShops={otherShops}
        />
      </Tab>
    </Tabs>
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Search
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_regular,
              }}>
              {searchInput.trunc(30)}
            </Text>
          </View>
          <View style={{width: '20%'}}></View>
        </View>
      </SafeAreaView>
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {!isLoading ? (
        view
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
    width: '60%',
  },
});

export default SearchProductScreen;
