import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
 
  TouchableOpacity,

  ScrollView,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Loader from '../components/Loader';
import UpdatingLoader from '../components/UpdatingLoader';
import NetworkError from '../components/NetworkError';
import ProductDetails from '../components/NewProduct/ProductDetails';
import ProductImage from '../components/NewProduct/ProductImage';
import CategoryModal from '../components/NewProduct/CategoryModal';
import ProductVariant from '../components/NewProduct/ProductVariant';
import ProductDiscount from '../components/NewProduct/ProductDiscount';

import * as appActions from '../store/actions/appActions';

const NewProductScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const [networkError, setNetworkError] = useState(false);
  const [savingLoader, setSavingLoader] = useState(false);
  //product details
  const product_data = props.navigation.getParam('product_data');

  const [product_name, setProdcutName] = useState(product_data.product_name);
  const [product_price, setProductPrice] = useState(product_data.product_price);
  const [product_details, setProductDetails] = useState(
    product_data.product_details,
  );
  const [product_qty, setProductQty] = useState(
    product_data.product_qty.toString(),
  );

  const [main_image, setMainImage] = useState({uri: product_data.main_image});
  const [main_image_data, setMainImage_data] = useState({});
  const [sub_image_1, setSubImage1] = useState(
    product_data.sub_image_1 === '' ? {} : {uri: product_data.sub_image_1},
  );
  const [sub_image_1_data, setSubImage1_data] = useState({});
  const [sub_image_2, setSubImage2] = useState(
    product_data.sub_image_2 === '' ? {} : {uri: product_data.sub_image_2},
  );
  const [sub_image_2_data, setSubImage2_data] = useState({});
  const [sub_image_3, setSubImage3] = useState(
    product_data.sub_image_3 === '' ? {} : {uri: product_data.sub_image_3},
  );
  const [sub_image_3_data, setSubImage3_data] = useState({});

  const [discount, setDiscount] = useState(product_data.discount);
  const [discount_start_date, setDiscount_start_date] = useState(
    product_data.discount_start_date === ''
      ? 'Select date'
      : product_data.discount_start_date,
  );

  const [discount_end_date, setDiscount_end_date] = useState(
    product_data.discount_end_date === ''
      ? 'Select date'
      : product_data.discount_end_date,
  );

  const [
    allow_purchase_when_out_of_stock,
    setAllow_purchase_when_out_of_stock,
  ] = useState(product_data.allow_purchase_when_out_of_stock);

  const [productHasDiscount, setProductHasDiscount] = useState(
    product_data.discount === '' ? false : true,
  );

  

  const [productCanBeCustomized, setProductCanBeCustomized] = useState(
    product_data.product_can_be_customized,
  );
  const [product_can_be_customized_is_optional, setProduct_can_be_customized_is_optional] = useState(product_data.product_can_be_customized_is_optional);
  const [product_personilization_note, setProduct_personilization_note] = useState(product_data.product_personilization_note);

  const [main_category, setMainCategory] = useState(product_data.main_category);
  const [main_category_id, setMainCategory_id] = useState('');
  const [sub_category1, setSubCategory1] = useState(
    product_data.sub_category1 === '' ? 'Select' : product_data.sub_category1,
  );
  const [sub_category1_id, setSubCategory1_id] = useState('');
  const [sub_category2, setSubCategory2] = useState(
    product_data.sub_category2 === '' ? 'Select' : product_data.sub_category2,
  );

  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryModalView, setCategoryModalView] = useState(
    'main_category_view',
  );

  const [selectedVariant, setSelectedVariant] = useState([]);

  const [fetching, setFetching] = useState(false);
  const [product_weight, setProduct_weight] = useState(product_data.product_weight);
  const [product_weight_unit, setProduct_weight_unit] = useState(product_data.product_weight_unit);

  useEffect(() => {
    //get maincategory id
    const getMainCategoryId = async () => {
      try {
        setFetching(true);
        const response = await appActions.getMainCategoryId(
          product_data.main_category,
          product_data.sub_category1 === "" ? "none" :  product_data.sub_category1,
          
        );        
        setFetching(false);
        if (!response.status) {
          setFetching(false);
          setNetworkError(true);
          return;
        }
        setMainCategory_id(response.main_data._id);
        //console.log( product_data.sub_category1 === "" ?"none" :  product_data.sub_category1,);
        
        if (response.sub_data.length !== 0) {
          setSubCategory1_id(response.sub_data._id);
        }
      } catch (e) {
          console.log(e);
        setFetching(false);
        setNetworkError(true);
      }
    };
    //console.log(selectedVariant.length);
    if (product_data.variants.length !== 0) {
      product_data.variants.map((value) => {
        setSelectedVariant((prev) => [
          ...prev,
          {name: value.name, _id: value._id},
        ]);
      });
    }
    getMainCategoryId();
  }, []);

  //const actionType = props.navigation.getParam('actionType');

  const editProduct = async () => {
    try {
      if (product_name === '') {
        Alert.alert(
          'Product name is required',
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
        _id:product_data._id,
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
        product_weight_unit, product_can_be_customized_is_optional,
        product_personilization_note
      };

      setSavingLoader(true);
      const response = await appActions.editUplaodDetails(_data);
      if (!response.status) {
        setSavingLoader(false);
        setNetworkError(true);
        return;
      }

      if (Object.entries(main_image_data).length !== 0) {
       await appActions.saveUplaodMainImage(
        main_image_data,
        product_data._id,
        user._id,
      );
    }


      if (Object.entries(sub_image_1_data).length !== 0) {
        await appActions.saveUplaodSubImageOne(
          sub_image_1_data,
          product_data._id,
        );
      }

      if (Object.entries(sub_image_2_data).length !== 0) {
        await appActions.saveUplaodSubImageTwo(
          sub_image_2_data,
          product_data._id,
        );
      }

      if (Object.entries(sub_image_3_data).length !== 0) {
        await appActions.saveUplaodSubImageThree(
          sub_image_3_data,
          product_data._id,
        );
      }
      dispatch(appActions.getMyShopProducts(user._id, 1));
      setSavingLoader(false);
      props.navigation.goBack();
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

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
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
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Edit product
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={editProduct}>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontSize: 17,
                    marginRight: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: 'blue',
                  }}>
                  update
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        nestedScrollEnabled={true}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 20,
          }}>
          <View style={{marginTop: 20}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              Product Description
            </Text>
          </View>
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
        <View
          style={{
            marginTop: 10,
          }}>
          <View style={{padding: 10}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
                alignSelf: 'center',
                marginBottom: 20,
                textAlign: 'center',
              }}>
              Product Image / Category
            </Text>
          </View>
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
        <View
          style={{
            marginTop: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 20,
          }}></View>
        <View style={{padding: 2}}>
          <ProductVariant
            setSelectedVariant={setSelectedVariant}
            selectedVariant={selectedVariant}
          />
        </View>

        <View
          style={{
            borderTopWidth: 0.5,
            borderTopColor: Colors.light_grey,
            marginTop: 20,
            marginBottom: 50,
          }}>
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
        </View>
      </ScrollView>

      {savingLoader && <Loader />}
      {fetching && (
        <UpdatingLoader />
      )}

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
