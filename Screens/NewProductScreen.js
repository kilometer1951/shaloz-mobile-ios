import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Loader from '../components/Loader';
import NetworkError from '../components/NetworkError';
import ProductDetails from '../components/NewProduct/ProductDetails';
import ProductImage from '../components/NewProduct/ProductImage';
import CategoryModal from '../components/NewProduct/CategoryModal';
import ProductVariant from '../components/NewProduct/ProductVariant';
import ProductDiscount from '../components/NewProduct/ProductDiscount';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as appActions from '../store/actions/appActions';

const NewProductScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [networkError, setNetworkError] = useState(false);
  const [savingLoader, setSavingLoader] = useState(false);
  const [viewNumber, setViewNumber] = useState('1');
  const [viewToRender, setViewToRender] = useState('product_details');
  //product details
  const [product_name, setProdcutName] = useState('');
  const [product_price, setProductPrice] = useState('');
  const [product_details, setProductDetails] = useState('');
  const [product_qty, setProductQty] = useState('1');

  const [main_image, setMainImage] = useState({});
  const [main_image_data, setMainImage_data] = useState({});
  const [sub_image_1, setSubImage1] = useState({});
  const [sub_image_1_data, setSubImage1_data] = useState({});
  const [sub_image_2, setSubImage2] = useState({});
  const [sub_image_2_data, setSubImage2_data] = useState({});
  const [sub_image_3, setSubImage3] = useState({});
  const [sub_image_3_data, setSubImage3_data] = useState({});
  const [main_category, setMainCategory] = useState('Select');
  const [main_category_id, setMainCategory_id] = useState('');
  const [sub_category1, setSubCategory1] = useState('Select');
  const [sub_category1_id, setSubCategory1_id] = useState('');
  const [sub_category2, setSubCategory2] = useState('Select');

  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryModalView, setCategoryModalView] = useState(
    'main_category_view',
  );

  const [selectedVariant, setSelectedVariant] = useState([]);

  const [discount, setDiscount] = useState('');
  const [discount_start_date, setDiscount_start_date] = useState('Select date');

  const [discount_end_date, setDiscount_end_date] = useState('Select date');

  const [
    allow_purchase_when_out_of_stock,
    setAllow_purchase_when_out_of_stock,
  ] = useState(false);
  const [productHasDiscount, setProductHasDiscount] = useState(false);

  const [productCanBeCustomized, setProductCanBeCustomized] = useState(false);
  const [product_can_be_customized_is_optional, setProduct_can_be_customized_is_optional] = useState(true);
  const [product_personilization_note, setProduct_personilization_note] = useState("");

  const [product_weight, setProduct_weight] = useState('');
  const [product_weight_unit, setProduct_weight_unit] = useState('gram');

  const saveProduct = async () => {
    try {
      if (viewToRender === 'product_details') {
        if (product_name === '') {
          Alert.alert(
            'Product name is required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        if (product_price === '') {
          Alert.alert(
            'Product price is required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        if (product_qty === '') {
          Alert.alert(
            'Product quantity is required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        if (product_details === '') {
          Alert.alert(
            'Product detail is required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        if (product_weight === '') {
          Alert.alert(
            'Product weight is required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        if (product_weight_unit === '') {
          Alert.alert(
            'Product weight unit is required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        setViewNumber('2');
        setViewToRender('product_images');
      } else if (viewToRender === 'product_images') {
        if (Object.entries(main_image).length === 0) {
          Alert.alert(
            'Main image required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        if (main_category === 'Select') {
          Alert.alert(
            'Main category required',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
        }
        setViewNumber('3');
        setViewToRender('product_variant');
      } else if (viewToRender === 'product_variant') {
        if (selectedVariant.length === 0) {
          Alert.alert(
            'Product Variants',
            'You have not selected any variants. Are you sure you want to continute?',

            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'text',
              },
              {
                text: 'Next',
                style: 'text',

                onPress: async () => {
                  setViewNumber('4');
                  setViewToRender('product_discount');
                },
              },
            ],
            {cancelable: false},
          );
          return;
        }
        setViewNumber('4');
        setViewToRender('product_discount');
      } else if (viewToRender === 'product_discount') {
        if (!productHasDiscount) {
          setDiscount('');
          setDiscount_start_date('Select date');
          setDiscount_end_date('Select date');
        } else {
          if (discount === '') {
            Alert.alert(
              'Discount required',
              ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
              {cancelable: false},
            );
            return;
          }
          // if (discount_start_date === 'Select date') {
          //   Alert.alert(
          //     'Select a start date',
          //     ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          //     {cancelable: false},
          //   );
          //   return;
          // }
          if (discount_end_date === 'Select date') {
            Alert.alert(
              'Select an end date',
              ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
              {cancelable: false},
            );
            return;
          }
        }

        const _data = {
          user_id: user._id,
          product_name,
          product_price: parseFloat(product_price).toFixed(2),
          product_details,
          product_qty,
          main_category,
          sub_category1,
          sub_category2,
          selectedVariant,
          discount,
          discount_start_date,
          discount_end_date,
          allow_purchase_when_out_of_stock,
          productCanBeCustomized,
          product_weight: parseFloat(product_weight).toFixed(2),
          product_weight_unit,
          product_can_be_customized_is_optional,
product_personilization_note
        };

        setSavingLoader(true);
        const response = await appActions.saveUplaodDetails(_data);
        if (!response.status) {
          setSavingLoader(false);
          setNetworkError(true);
          return;
        }

        const resData = await appActions.saveUplaodMainImage(
          main_image_data,
          response.product_id,
          user._id,
        );

        //   await dispatch(appActions.getMyShopProducts_new(resData.products));

        if (Object.entries(sub_image_1_data).length !== 0) {
          await appActions.saveUplaodSubImageOne(
            sub_image_1_data,
            response.product_id,
          );
        }

        if (Object.entries(sub_image_2_data).length !== 0) {
          await appActions.saveUplaodSubImageTwo(
            sub_image_2_data,
            response.product_id,
          );
        }

        if (Object.entries(sub_image_3_data).length !== 0) {
          await appActions.saveUplaodSubImageThree(
            sub_image_3_data,
            response.product_id,
          );
        }
        dispatch(appActions.getMyShopProducts(user._id, 1));
        setSavingLoader(false);
        props.navigation.goBack();
      }
    } catch (e) {
      console.log(e);
      setSavingLoader(false);
      setNetworkError(true);
    }
  };

  const cancel = () => {
    Alert.alert(
      'Are you sure you want to exit? All changes will be discarded',
      '',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Yes', onPress: () => props.navigation.goBack()},
      ],
      {cancelable: false},
    );
  };

  const backView = () => {
    if (viewToRender === 'product_images') {
      setViewNumber('1');
      setViewToRender('product_details');
    } else if (viewToRender === 'product_variant') {
      setViewNumber('2');
      setViewToRender('product_images');
    } else {
      setViewNumber('3');
      setViewToRender('product_variant');
    }
  };

  let view;
  if (viewToRender === 'product_details') {
    view = (
      <View style={{flex: 1}}>
        <ProductDetails
          product_name={product_name}
          setProdcutName={setProdcutName}
          product_price={product_price}
          setProductPrice={setProductPrice}
          product_details={product_details}
          setProductDetails={setProductDetails}
          product_qty={product_qty}
          setProductQty={setProductQty}
          product_weight={product_weight}
          product_weight_unit={product_weight_unit}
          setProduct_weight={setProduct_weight}
          setProduct_weight_unit={setProduct_weight_unit}
        />
      </View>
    );
  } else if (viewToRender === 'product_images') {
    view = (
      <View style={{flex: 1}}>
        <ProductImage
          main_image={main_image}
          sub_image_1={sub_image_1}
          sub_image_2={sub_image_2}
          sub_image_3={sub_image_3}
          setMainImage={setMainImage}
          setMainImage_data={setMainImage_data}
          setSubImage1={setSubImage1}
          setSubImage1_data={setSubImage1_data}
          setSubImage2={setSubImage2}
          setSubImage2_data={setSubImage2_data}
          setSubImage3={setSubImage3}
          setSubImage3_data={setSubImage3_data}
          setMainCategory={setMainCategory}
          main_category={main_category}
          setSubCategory1={setSubCategory1}
          sub_category1={sub_category1}
          setSubCategory2={setSubCategory2}
          sub_category2={sub_category2}
          setCategoryModal={setCategoryModal}
          setCategoryModalView={setCategoryModalView}
          setSubCategory1_id={setSubCategory1_id}
        />
      </View>
    );
  } else if (viewToRender === 'product_variant') {
    view = (
      <ProductVariant
        setSelectedVariant={setSelectedVariant}
        selectedVariant={selectedVariant}
      />
    );
  } else if (viewToRender === 'product_discount') {
    view = (
      <ProductDiscount
        discount={discount}
        discount_start_date={discount_start_date}
        discount_end_date={discount_end_date}
        allow_purchase_when_out_of_stock={allow_purchase_when_out_of_stock}
        productHasDiscount={productHasDiscount}
        setProductHasDiscount={setProductHasDiscount}
        setDiscount={setDiscount}
        setDiscount_start_date={setDiscount_start_date}
        setDiscount_end_date={setDiscount_end_date}
        setAllow_purchase_when_out_of_stock={
          setAllow_purchase_when_out_of_stock
        }
        productCanBeCustomized={productCanBeCustomized}
        setProductCanBeCustomized={setProductCanBeCustomized}

        product_can_be_customized_is_optional={product_can_be_customized_is_optional}
setProduct_can_be_customized_is_optional={setProduct_can_be_customized_is_optional}

product_personilization_note={product_personilization_note}
setProduct_personilization_note={setProduct_personilization_note}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            {viewToRender === 'product_details' ? (
              <TouchableOpacity onPress={cancel}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 17,
                      marginLeft: 10,
                      fontFamily: Fonts.poppins_regular,
                      color: 'red',
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={backView}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-arrow-back" size={25} />
                  <Text
                    style={{
                      fontSize: 17,
                      marginLeft: 10,
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_semibold,
              }}>
              New product ({viewNumber}/4)
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={saveProduct}>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontSize: 17,
                    marginRight: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: 'blue',
                  }}>
                  {viewToRender === 'product_discount' ? 'Done' : 'Save'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {view}
      {savingLoader && <Loader />}

      {categoryModal && (
        <CategoryModal
          categoryModal={categoryModal}
          setCategoryModal={setCategoryModal}
          categoryModalView={categoryModalView}
          setCategoryModalView={setCategoryModalView}
          setMainCategory={setMainCategory}
          setMainCategory_id={setMainCategory_id}
          main_category={main_category}
          main_category_id={main_category_id}
          setSubCategory1={setSubCategory1}
          setSubCategory1_id={setSubCategory1_id}
          sub_category1={sub_category1}
          setSubCategory2={setSubCategory2}
          sub_category1_id={sub_category1_id}
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
    backgroundColor: '#fff',
  },
  headerRow: {
    width: '60%',
  },
});

export default NewProductScreen;
