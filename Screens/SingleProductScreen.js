import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,

  Animated,
  Alert,
  Share,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import SingleProductComponent from '../components/SingleProduct/SingleProductComponent';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import SingleProductScreenPlaceholder from '../components/SingleProductScreenPlaceholder';
import NetworkError from '../components/NetworkError';
import * as appActions from '../store/actions/appActions';
const {height: viewportHeight} = Dimensions.get('window');

const SingleProductScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const cart_data = useSelector((state) => state.appReducer.cart_data);

  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [productData, setProductData] = useState({});
  const [productReviews, setProductReviews] = useState([]);
  const [recentViewed, setRecentViewed] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [moreItemsFromShop, setMoreItemsFromShop] = useState([]);

  const [isAddedToCard, setIsAddedToCard] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [rateNumber, setRateNumber] = useState(5);
  const [initialPage, setInitialPage] = useState(0);
  const [itemDetails, setItemDetails] = useState(false);
  const [shippingPolicies, setShippingPolicies] = useState(false);
  const [bounces, setBounces] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [previewData, setPreviewData] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [qty, setQty] = useState('1');
  const [optionModalView, setOptionModalView] = useState('');
  const [variant, setVariant] = useState({});
  const [openOptionModal, setOpenOptionModal] = useState(false);
  const [selectedVariantContent, setSelectedVariantContent] = useState([]);
  const [customization_note, setCustomization_note] = useState('');
  const [variantsBorderColor, setVariantsBorderColor] = useState(false);
  const [_price, setPrice] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [newQty, setNewQty] = useState('');
  const [reviewCount, setReviewCount] = useState('');

  let animatedPress = new Animated.Value(1);

  const backTitle = props.navigation.getParam('backTitle');
  const product_id = props.navigation.getParam('product_id');

  const displayPrice = (product_price, discount) => {
    if (discount === '') {
      setPrice(product_price);
    } else {
      let price = parseInt(product_price);
      let _discount = parseInt(discount);

      let total_d = _discount / 100;
      let total_p = price * total_d;
      let total = price - total_p;

      setPrice(total);
    }
  };

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fetchSingleProduct(
          product_id,
          user._id,
        );
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }
        setIsFav(response.fav_products);
        setRecentViewed(response.recent_viewed);
        setOtherProducts(response.otherProducts);
        setMoreItemsFromShop(response.moreItemsFromShop);
        setReviewCount(response.reviews_count);
        //chceck if cart has been added
        if (cart_data.length !== 0) {
          for (let i = 0; i < cart_data.length; i++) {
            const filter = cart_data[i].items.filter((value) => {
              if (value.product._id == response.product._id) {
                setIsAddedToCard(true);
              }
            });
          }
        }
        //end

        displayPrice(response.product.product_price, response.product.discount);
        setProductData(response.product);
        setProductReviews(response.reviews);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };

    fetchSingleProduct();
  }, []);

  const animateOut = () => {
    Animated.timing(animatedPress, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const pressAction = async (_product_id) => {
    props.navigation.push('SingleProduct', {product_id: _product_id});
  };

  const addToCart = async () => {
    try {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });

      if (!isAddedToCard) {
        if (productData.variants.length !== 0) {
          //this product has a variant
          if (selectedVariantContent.length === 0) {
            setOpenOptionModal(true);
            //select the first vairant
            setVariant(productData.variants[0]);
            setOptionModalView('variant');
            return;
          }
        }

        //check if the variant length and selected variant are the same
        if (productData.variants.length !== selectedVariantContent.length) {
          Alert.alert(
            'You missed some variants',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          
          setVariantsBorderColor(true);
          return;
        }
        if (!productData.product_can_be_customized_is_optional) {
          if (customization_note === '') {
            Alert.alert(
              'Add personalization',
              ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
              {cancelable: false},
            );
            return;
          }
        }

        //add to cart
        const data = {
          product: productData._id,
          seller: productData.user._id,
          user: user._id,
          price: parseFloat(_price).toFixed(2),
          qty: qty,
          discount: productData.discount,
          selected_variant_value: selectedVariantContent,
          product_personalization_note: customization_note,
        };

       
     


        setIsAddedToCard(true);
         setAddingToCart(true)
       await dispatch(appActions.addToCart(data));
      await dispatch(appActions.fetchCartData(user._id, 1));
          setAddingToCart(false)
      
      } else {
        Animated.timing(animatedPress, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }).start();
        dispatch(appActions.SelectedFooterTab("cart"));
        dispatch(appActions.fetchCartData(user._id, 1));
        
        props.navigation.navigate('Cart');
      }
    } catch (e) {
      console.log(e);
      
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const addFavProduct = () => {
    try {
      if (isFav) {
        dispatch(appActions.removeFavProduct(user._id, productData._id));
        setIsFav((prev) => {
          const newValue = !prev;
          if (newValue) {
            console.log(newValue);
          } else {
            console.log(newValue);
          }
          return newValue;
        });
      } else {
        dispatch(appActions.addFavProduct(user._id, productData._id));
        setIsFav((prev) => {
          const newValue = !prev;
          if (newValue) {
            console.log(newValue);
          } else {
            console.log(newValue);
          }
          return newValue;
        });
      }
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const onShareProduct = async () => {
    try {
      const result = await Share.share({
        message: `Check this product out - ${productData.product_name} from ${productData.user.shop_name} on Shaloz. shaloz://product/${productData._id}`,
        url: 'http://appstore.com/shaloz',
        title:
          'Download the Shaloz app and visit this shop ' +
          productData.user.shop_name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);

          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  let view;
  if (Object.entries(productData).length !== 0) {
    view = (
      <SingleProductComponent
        addToCart={addToCart}
        navigation={props.navigation}
        isAddedToCard={isAddedToCard}
        animatedPress={animatedPress}
        animateOut={animateOut}
        productData={productData}
        productReviews={productReviews}
        rateNumber={rateNumber}
        setRateNumber={setRateNumber}
        initialPage={initialPage}
        setInitialPage={setInitialPage}
        itemDetails={itemDetails}
        setItemDetails={setItemDetails}
        shippingPolicies={shippingPolicies}
        setShippingPolicies={setShippingPolicies}
        bounces={bounces}
        setBounces={setBounces}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        previewData={previewData}
        setPreviewData={setPreviewData}
        previewModal={previewModal}
        setPreviewModal={setPreviewModal}
        qty={qty}
        setQty={setQty}
        optionModalView={optionModalView}
        setOptionModalView={setOptionModalView}
        variant={variant}
        setVariant={setVariant}
        openOptionModal={openOptionModal}
        setOpenOptionModal={setOpenOptionModal}
        selectedVariantContent={selectedVariantContent}
        setSelectedVariantContent={setSelectedVariantContent}
        customization_note={customization_note}
        setCustomization_note={setCustomization_note}
        variantsBorderColor={variantsBorderColor}
        _price={_price}
        addingToCart={addingToCart}
        recentViewed={recentViewed}
        otherProducts={otherProducts}
        pressAction={pressAction}
        moreItemsFromShop={moreItemsFromShop}
        navigation={props.navigation}
        setNewQty={setNewQty}
        newQty={newQty}
        reviewCount={reviewCount}
        setVariantsBorderColor={setVariantsBorderColor}
      />
    );
  }

  const _onScroll = (event) => {
    const scrollPosition =
      event &&
      event.nativeEvent &&
      event.nativeEvent.contentOffset &&
      event.nativeEvent.contentOffset.y;
    let newBouncesValue;

    if (scrollPosition < viewportHeight / 3) {
      newBouncesValue = false;
    } else {
      newBouncesValue = true;
    }

    if (newBouncesValue === bounces) {
      return;
    }

    setBounces(newBouncesValue);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 17,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Back
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
              Item
            </Text>
          </View>
          <View style={styles.headerRow}>
            {!isLoading && (
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={onShareProduct}>
                  <View style={{marginRight: 20, marginTop: 1}}>
                    <Icon name="md-share" size={23} color={Colors.blue} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={addFavProduct}>
                  <View style={{paddingRight: 10}}>
                    <Icon
                      name={isFav ? 'ios-heart' : 'ios-heart-empty'}
                      size={25}
                      style={{alignSelf: 'flex-end'}}
                      color={Colors.purple_darken}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>

      {!isLoading ? (
        <ScrollView
          style={styles.screen}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          bounces={bounces}
          showsVerticalScrollIndicator={false}
          onScroll={_onScroll}>
          {view}
        </ScrollView>
      ) : (
        <SingleProductScreenPlaceholder />
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
    width: '30%',
  },
});

export default SingleProductScreen;
