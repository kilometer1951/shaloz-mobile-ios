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
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

import TrackPackageComponent from '../components/TrackPackage/TrackPackageComponent';
import TrackPackageModal from '../components/TrackPackage/TrackPackageModal';
import OtherProducts from '../components/ProductCategory/OtherProducts';

import NetworkError from '../components/NetworkError';

import * as appActions from '../store/actions/appActions';
import CartPlaceHolder from '../components/CartPlaceHolder';

const TrackPackageScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const shop_orders = useSelector((state) => state.appReducer.shop_orders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const purchased_orders = useSelector(
    (state) => state.appReducer.purchased_orders,
  );
  const [tracking_number, setTracking_number] = useState('');
  const [openTrackingModal, setOpenTrackingModal] = useState(false);

  const [otherProducts, setOtherProducts] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchPurchasedPackage = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchPurchasedPackage(user._id, 1));
        const response = await appActions.fechProductByCategory(
          user._id,
          '',
          '',
          '',
          1,
        );
        setIsLoading(false);
        setOtherProducts(response.otherProducts);
        setShops(response.shops);
      } catch (e) {
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchPurchasedPackage();
  }, []);

  let view;
  if (purchased_orders.length === 0) {
    view = (
      <ScrollView>
        <View style={{marginTop: '10%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              textAlign: 'center',
              padding: 20,
            }}>
            No package to track yet
          </Text>
          <OtherProducts
            dataN={otherProducts}
            navigation={props.navigation}
            shops={shops}
          />
        </View>
      </ScrollView>
    );
  } else {
    view = (
      <TrackPackageComponent
        navigation={props.navigation}
        tracking_number={tracking_number}
        openTrackingModal={openTrackingModal}
        setOpenTrackingModal={setOpenTrackingModal}
        setTracking_number={setTracking_number}
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
                  You
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
              Track package
            </Text>
          </View>
          <View style={{width: '20%'}}></View>
        </View>
      </SafeAreaView>

      <View style={{flex: 1}}>{isLoading ? <CartPlaceHolder /> : view}</View>

      {openTrackingModal && (
        <TrackPackageModal
          tracking_number={tracking_number}
          openTrackingModal={openTrackingModal}
          setOpenTrackingModal={setOpenTrackingModal}
        />
      )}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
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

export default TrackPackageScreen;
