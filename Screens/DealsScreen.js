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
import DealsComponent from '../components/Deals/DealsComponent';
import ProductPlaceholderLoader from '../components/ProductPlaceholderLoader';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';

const ProductScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [deals, setDeals] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backTitle = props.navigation.getParam('backTitle');
  const headerTile = props.navigation.getParam('headerTile');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fetchDeals(user._id, 1);
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }
        setDeals(response.deals);
      } catch (e) {
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchDeals();
  }, []);

  const handleLoadMoreDeals = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appActions.fetchDeals(user._id, page);
        setIsLoadingMoreData(false);
        //  console.log(response.images.length);
        if (!response.status) {
          console.log('error parsing server');
          return;
        }
        if (response.endOfFile) {
          setEndOfFile(true);
          return;
        }
        //  console.log(page);
        setPage((prev) => (prev = prev + 1));
        await setDeals((prev) => [...prev, ...response.deals]);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    const response = await appActions.fetchDeals(user._id, 1);
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    setDeals(response.deals);
    setIsRefreshing(false);
  };

  let view;

  if (deals.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%', padding: 25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_light,
            fontSize: 20,
            fontWeight: '300',
            textAlign: 'center',
            padding: 20,
          }}>
          No deals available at the moment
        </Text>
      </View>
    );
  } else {
    view = (
      <DealsComponent
        navigation={props.navigation}
        deals={deals}
        handleRefresh={handleRefresh}
        handleLoadMoreDeals={handleLoadMoreDeals}
        isRefreshing={isRefreshing}
        isLoadingMoreData={isLoadingMoreData}
        endOfFile={endOfFile}
      />
    );
  }

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
                fontFamily: Fonts.poppins_regular,
              }}>
              Deals
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Search')}>
              <View style={{paddingRight: 10}}>
                <Icon
                  name="ios-search"
                  size={25}
                  style={{alignSelf: 'flex-end'}}
                />
              </View>
            </TouchableOpacity>
          </View>
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

export default ProductScreen;
