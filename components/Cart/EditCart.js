import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import UpdatingLoader from '../UpdatingLoader';

import {MaterialIndicator} from 'react-native-indicators';

const EditCart = (props) => {
  const dispatch = useDispatch();

  const {
    setOpenEditModal,
    openEditModal,
    editViewToRender,
    editItemData,
  } = props;
  const [networkError, setNetworkError] = useState(false);
  const [done, setDone] = useState(false);
  const [checkBox, setCheckbox] = useState();
  const [qtyArray, setQtyArray] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newVariant, setNewVariant] = useState([]);
  const [qty, setQty] = useState('');
  const user = useSelector((state) => state.authReducer.user);

  useEffect(() => {
    const cartProductVariant = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.cartProductVariant(
          editItemData.product_id,
        );

        setIsLoading(false);
        setNewVariant(editItemData.selected_variant_value);

        setVariants(response.data);
      } catch (e) {
        console.log(e);

        setIsLoading(false);
        setNetworkError(true);
      }
    };
    cartProductVariant();
  }, []);

  useEffect(() => {
    const createQtyArray = () => {
      for (let i = 1; i <= parseInt(editItemData.product_qty); i++) {
        setQtyArray((prev) => [...prev, {i}]);
      }
    };
    createQtyArray();
  }, []);

  const addOptionContent = (_name, price, content) => {
    //remove update
    const filtered = newVariant.filter((value) => value.name !== _name);
    setNewVariant(filtered);
    //add
    setNewVariant((prev) => [
      ...prev,
      {content: content, name: _name, price: price},
    ]);
    setDone(true);
  };

  const deleteSelectedVariant = (name) => {
    const filtered = newVariant.filter((value) => value.name !== name);
    setNewVariant(filtered);
    setDone(true);
  };

  const addQty = (_qty, index) => {
    setQty(_qty);
    setCheckbox(index);
    setDone(true);
  };

  const updateCart = async () => {
    try {
      if (editViewToRender === 'qty') {
        //update qty
        setIsLoading(true);
        await appActions.updateCartQty(
          user._id,
          qty,
          editItemData.cart_id,
          editItemData.item_id,
        );
        await dispatch(appActions.fetchCartData(user._id, 1));
        setIsLoading(false);
        setOpenEditModal(false);
      } else {
        setIsLoading(true);
        await appActions.updateCartVariants(
          user._id,
          newVariant,
          editItemData.cart_id,
          editItemData.item_id,
        );

        await dispatch(appActions.fetchCartData(user._id, 1));
        setIsLoading(false);
        setOpenEditModal(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const loopQty = () => {
    return qtyArray.map((result, index) => {
      return (
        <View
          key={index}
          style={{
            padding: 10,
            borderBottomColor: Colors.light_grey,
            borderBottomWidth: 0.5,
          }}>
          <TouchableOpacity onPress={addQty.bind(this, result.i, index)}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {checkBox === index && (
                <Icon name="ios-checkmark" size={25} color="blue" />
              )}
              <Text
                style={{
                  fontSize: 17,
                  marginLeft: 10,
                  fontFamily: Fonts.poppins_regular,
                  color: checkBox === index ? 'blue' : '#000',
                }}>
                {result.i}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const _selectedVariant = newVariant.map((result, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={deleteSelectedVariant.bind(this, result.name)}>
        <View style={styles.selectedVariant}>
          <View>
            <Text
              style={
                styles.textStyle
              }>{`${result.content} : $${result.price}`}</Text>
          </View>
          <View style={{marginLeft: 10}}>
            <Icon name="ios-close" size={18} />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const displayVariantContent = (items, __name) => {
    return items.map((result, index, array) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={addOptionContent.bind(
            this,
            __name,
            result.price,
            result.content,
          )}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
                marginLeft: 15,
              }}>
              - {`${result.content} ($${result.price})`.trunc(30)}
            </Text>

            <View style={{marginRight: 20}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 18,
                  color: Colors.blue,
                }}>
                Add
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  let view;

  if (editViewToRender === 'qty') {
    view = <ScrollView style={{marginBottom: 110}}>{loopQty()}</ScrollView>;
  } else {
    view = (
      <View>
        <ScrollView
          horizontal={true}
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}>
          {_selectedVariant}
        </ScrollView>
        <FlatList
          data={variants}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomColor: Colors.light_grey,
                  borderBottomWidth: 0.5,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 18,
                  }}>
                  {item.name.trunc(40)}
                </Text>
              </View>

              {displayVariantContent(item.variantContent, item.name)}
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  }

  let headerTile;
  if (editViewToRender === 'qty') {
    headerTile = 'Qty';
  } else {
    headerTile = 'Product Option';
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openEditModal}
      style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => setOpenEditModal(false)}>
              <View>
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
                textAlign: 'center',
              }}>
              {headerTile}
            </Text>
          </View>
          <View style={{width: '20%'}}>
            {done && (
              <TouchableOpacity onPress={updateCart}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 17,
                    fontFamily: Fonts.poppins_semibold,
                    textAlign: 'center',
                    color: 'blue',
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
      <View style={{padding: 10}}>{view}</View>
      {isLoading && <UpdatingLoader />}
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </Modal>
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
  selectedVariant: {
    borderWidth: 1,
    padding: 10,
    height: 40,
    marginRight: 5,
    borderRadius: 20,
    borderColor: '#eeeeee',
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EditCart;
