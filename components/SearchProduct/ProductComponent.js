import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ProductComponent from '../ProductComponent';
import ProductPlaceholderLoader from '../ProductPlaceholderLoader';
import NetworkError from '../NetworkError';
import * as appActions from '../../store/actions/appActions';
import OtherProducts from '../ProductCategory/OtherProducts';

const ProductComponent_ = (props) => {
  const {otherProducts, otherShops} = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLoadMore = async () => {
    try {
      if (!endOfFile) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          const response = await appActions.loadMoreDynamicSearchProductData(
            user._id,
            props.searchInput,
            page,
          );
          setIsLoadingMoreData(false);
          if (!response.status) {
            console.log('error parsing server');
            return;
          }
          if (response.endOfFile) {
            setEndOfFile(true);
            return;
          }
          setPage((prev) => (prev = prev + 1));
          await props.setDataProduct((prev) => [...prev, ...response.products]);
        }
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    const response = await appActions.searchRefreshDynamicProduct(
      user._id,
      props.searchInput,
    );
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    props.setDataProduct(response.products);
    setIsRefreshing(false);
  };

  let view;

  if (props.dataProduct.length === 0) {
    view = (
      <ScrollView>
        <View style={{marginTop: '10%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              paddingLeft: 5,
              marginBottom: 20,
              textAlign: 'center',
            }}>
            No products to show for {props.searchInput}
          </Text>
          <OtherProducts
            dataN={otherProducts}
            navigation={props.navigation}
            shops={otherShops}
          />
        </View>
      </ScrollView>
    );
  } else {
    view = (
      <ProductComponent
        navigation={props.navigation}
        data={props.dataProduct}
        handleRefresh={handleRefresh}
        handleLoadMore={handleLoadMore}
        isRefreshing={isRefreshing}
        isLoadingMoreData={isLoadingMoreData}
        endOfFile={endOfFile}
      />
    );
  }

  return (
    <View style={styles.screen}>
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

export default ProductComponent_;
