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

import {MaterialIndicator} from 'react-native-indicators';

const OptionModal = (props) => {
  const {
    optionModalView,
    variant,
    openOptionModal,
    setOpenOptionModal,
    setSelectedVariantContent,
    selectedVariantContent,
    qty,setQty,newQty,productData,setVariantsBorderColor
  } = props;
  const [networkError, setNetworkError] = useState(false);
  const [done, setDone] = useState(false);
  const [checkBox, setCheckbox] = useState();
  const [qtyArray, setQtyArray] = useState([]);

  const addVariant = (content, price, index) => {
    const deleteOld = selectedVariantContent.filter((value) => {
      return value.name != variant.name;
    });
    const newArray = [
      ...deleteOld,
      {name: variant.name, content: content, price: price},
    ];
    if(newArray.length === productData.variants.length){
      setVariantsBorderColor(false);
    }
  
    
    setSelectedVariantContent(newArray);

    setOpenOptionModal(false);

    setCheckbox(index);
  };

  useEffect(() => {
    const createQtyArray = () => {
      for (let i = 1; i <= parseInt(newQty); i++) {
        setQtyArray((prev) => [...prev, {i}]);
      }
    };
    createQtyArray();
  }, []);

  const addQty = (_qty,index) => {
    setQty(_qty)
    setCheckbox(index)
    setOpenOptionModal(false)
  };

  const loopQty = () => {    
    return qtyArray.map((result, index) => {
      
    return  <View
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
      </View>;
    });
  };

  let view;
  if (optionModalView === 'qty') {
    view = <ScrollView style={{marginBottom:110}}>{loopQty()}</ScrollView>
  } else {
    view = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={variant.variantContent}
        renderItem={({item, index}) => (
          <View
            style={{
              padding: 10,
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <TouchableOpacity
              onPress={addVariant.bind(this, item.content, item.price, index)}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
                    {item.content}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: checkBox === index ? 'blue' : '#000',
                  }}>
                  +${item.price}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom: 100}}
      />
    );
  }

  let headerTile;
  if (optionModalView === 'qty') {
    headerTile = 'Qty';
  } else {
    headerTile = variant.name;
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openOptionModal}
      style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => setOpenOptionModal(false)}>
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
          <View style={{width: '20%'}}></View>
        </View>
      </SafeAreaView>
      <View style={{padding: 10}}>{view}</View>
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
});

export default OptionModal;
