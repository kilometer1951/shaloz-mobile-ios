import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
 ScrollView
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import DealsComponent from '../components/Deals/DealsComponent';
import CartPlaceHolder from '../components/CartPlaceHolder';
import CartComponent from '../components/Cart/CartComponent';
import InfoModal from '../components/Cart/InfoModal';
import EditCart from '../components/Cart/EditCart';
import Footer from '../components/Footer';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';
import Modal from 'react-native-modalbox';
import OtherProducts from '../components/ProductCategory/OtherProducts';

const CartScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const cart_data = useSelector((state) => state.appReducer.cart_data);

  const [networkError, setNetworkError] = useState(false);
  const [editItemData, setEditItemData] = useState({});

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [editViewToRender, setEditViewToRender] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [otherProducts, setOtherProducts] = useState([]);
  const [shops, setShops] = useState([]);
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        await dispatch(appActions.fetchCartData(user._id, 1));
        await dispatch(appActions.fetchPurchasedPackage(user._id, 1));
        const response = await appActions.fechProductByCategory(
            user._id,
            "",
            "",
            "",
            1,
          );
          setOtherProducts(response.otherProducts);
          setShops(response.shops);
        setIsLoading(false);
       
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchCartData();
  }, []);

  let view;
  if (cart_data.length === 0) {
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
         You have not added any product(s) to your cart
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
      <CartComponent
        setEditItemData={setEditItemData}
        openInfoModal={openInfoModal}
        setOpenInfoModal={setOpenInfoModal}
        editItemData={editItemData}
        navigation={props.navigation}
      />
    );
  }

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
            Cart
          </Text>
        </View>
      </SafeAreaView>
      <View style={{flex: 1}}>{isLoading ? <CartPlaceHolder /> : view}</View>
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}

      <InfoModal
        openInfoModal={openInfoModal}
        setOpenInfoModal={setOpenInfoModal}
        setEditViewToRender={setEditViewToRender}
        setOpenEditModal={setOpenEditModal}
        editItemData={editItemData}
      />

      {openEditModal && (
        <EditCart
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          setOpenInfoModal={setOpenInfoModal}
          setEditViewToRender={setEditViewToRender}
          editViewToRender={editViewToRender}
          editItemData={editItemData}
        />
      )}

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
  modal: {
    height: '30%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
});

export default CartScreen;
