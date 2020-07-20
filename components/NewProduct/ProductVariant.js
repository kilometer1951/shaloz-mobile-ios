import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  
  TouchableWithoutFeedback,
  
  TouchableOpacity,
 
  ScrollView,
  
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';
import NewVariantModal from '../MyShop/NewVariantModal';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';

//const {height} = Dimensions.get('window');

const ProductVariant = (props) => {
  const {selectedVariant, setSelectedVariant} = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const variants = useSelector((state) => state.appReducer.variants);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openNewVariantModal, setOpenNewVariantModal] = useState(false);
  const [viewToRender, setViewToRender] = useState('option_name');
  const [variant_id, setVariant_id] = useState('');
  const [variantContentId, setVariantContentId] = useState('');
  const [content_price, setContent_price] = useState('0.00');
  const [content, setContent] = useState('');
  const [actionType, setActionType] = useState('');
  const [name, setName] = useState('');
  const [removeBackButton, setRemoveBackButton] = useState(false);

  getProductOptions = async () => {
    try {
      setIsLoading(true);
      await dispatch(appActions.getProductOptions(user._id));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };
  useEffect(() => {
    getProductOptions();
  }, []);

  const newVariant = () => {
    setActionType('add');
    setVariant_id('');
    setContent_price('0.00');
    setName('');
    setContent('');
    setOpenNewVariantModal(true);
  };

  const closeVariantModal = () => {
    getProductOptions();
    setVariant_id('');
    setContent_price('0.00');
    setName('');
    setContent('');
    setRemoveBackButton(false);
    setViewToRender('option_name');
    setOpenNewVariantModal(false);
  };

  const selectVariant = (_variant_id, _name, index) => {
    const filtered = selectedVariant.filter(
      (value) => value._id === _variant_id,
    );
    if (filtered.length === 0) {
      setSelectedVariant((prev) => [...prev, {name: _name, _id: _variant_id}]);
    }

    //     const d = [...dynamic[index]]
    //      d[index] = _variant_id
    //     setDynamic((prev) => [...prev, {[index]: d}])
    //     console.log(dynamic[index])
    //    // setDynamic((prev) => [...prev, {completed: true}]);
  };

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '. . .' : this;
    };

  const deleteSelectedVariant = (_id) => {
    const filtered = selectedVariant.filter((value) => value._id !== _id);
    setSelectedVariant(filtered);
  };

  const optionContent = (variantContent) => {
    return variantContent.map((result, index, array) => {
      return (
        <Text
          key={index}
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 17,
            marginRight: 5,
          }}>
          {result.content + ' - $' + result.price}
        </Text>
      );
    });
  };

  const renderItem = variants.map((item, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={selectVariant.bind(this, item._id, item.name, index)}
        style={{marginTop: 10}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 18,
                }}>
                {item.name.trunc(40)}
              </Text>
              {optionContent(item.variantContent)}
            </View>

            <Icon
              name="ios-add-circle"
              size={23}
              color={Colors.purple_darken}
              style={{marginRight: 25}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const _selectedVariant = selectedVariant.map((result, index) => {
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={deleteSelectedVariant.bind(this, result._id)}>
        <View style={styles.selectedVariant}>
          <View>
            <Text style={{fontSize:18, fontFamily:Fonts.poppins_regular, color:"#fff"}}>{result.name}</Text>
          </View>
          <View style={{marginLeft: 10}}>
            <Icon name="ios-close" size={24} color="#fff"/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  let view;
  if (variants.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%'}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_light,
            fontSize: 20,
            fontWeight: '300',
            textAlign: 'center',
          }}>
          You have not created any variant yet.
        </Text>
        <TouchableOpacity onPress={newVariant}>
          <View
            style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
            <Icon name="ios-add" size={30} color={Colors.purple_darken} />
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 20,
                marginLeft: 10,
              }}>
              New Variant
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginLeft: 10,
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          Select a variant
        </Text>

        <TouchableOpacity onPress={newVariant}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Icon name="ios-add" size={23} color={Colors.purple_darken} />
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                marginLeft: 10,
              }}>
              New variant
            </Text>
          </View>
        </TouchableOpacity>
        <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 20,
              }}>
              Selected variant : {selectedVariant.length}
            </Text>
        <View style={{marginTop: 15}}>
          <ScrollView
            horizontal={true}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}>
            
            {_selectedVariant}
          </ScrollView>
        </View>
        {renderItem}
      </View>
    );
  }

  return (
    <View style={{padding: 10, flex: 1, backgroundColor: '#fff'}}>
      {isLoading ? <MaterialIndicator color={Colors.purple_darken} /> : view}
      {openNewVariantModal && (
        <NewVariantModal
          setOpenNewVariantModal={setOpenNewVariantModal}
          openNewVariantModal={openNewVariantModal}
          closeVariantModal={closeVariantModal}
          viewToRender={viewToRender}
          setViewToRender={setViewToRender}
          variant_id={variant_id}
          setVariant_id={setVariant_id}
          content_price={content_price}
          setContent_price={setContent_price}
          setContent={setContent}
          content={content}
          setActionType={setActionType}
          actionType={actionType}
          setName={setName}
          name={name}
          variantContentId={variantContentId}
          removeBackButton={removeBackButton}
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
  selectedVariant: {
    borderWidth: 1,
    padding: 10,
    height: 50,
    marginRight: 5,
    borderRadius: 50,
    borderColor: Colors.purple_darken,
    backgroundColor: Colors.purple_darken,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductVariant;
