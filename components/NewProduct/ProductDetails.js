import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,

  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Keyboard,
} from 'react-native';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';
import * as appActions from '../../store/actions/appActions';
import {useSelector, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductDetails = (props) => {
  const {
    product_name,
    setProdcutName,
    product_price,
    setProductPrice,
    product_details,
    setProductDetails,
    product_qty,
    setProductQty,
    product_weight,
    product_weight_unit,
    setProduct_weight,
    setProduct_weight_unit,
  } = props;
  const [openWeightUnitModal, setOpenWeightUnitModal] = useState(false);

  return (
    <KeyboardAwareScrollView
      scrollEnabled={true}
      enableAutomaticScroll={true}
      extraHeight={100} keyboardShouldPersistTaps="always">
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <View style={{padding: 10}}>
          <View>
            <Text style={styles.label}>Product name*</Text>
            <TextInput
              style={styles.textInput}
              value={product_name}
              onChangeText={(value) => setProdcutName(value)}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '70%'}}>
              <Text style={styles.label}>Product price*</Text>
              <TextInput
                style={styles.textInput}
                value={product_price}
                onChangeText={(value) => setProductPrice(value)}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{width: '25%'}}>
              <Text style={styles.label}>Qty*</Text>
              <TextInput
                style={styles.textInput}
                value={product_qty}
                onChangeText={(value) => setProductQty(value)}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '50%'}}>
              <Text style={styles.label}>Product weight*</Text>
              <TextInput
                style={styles.textInput}
                value={product_weight}
                onChangeText={(value) => setProduct_weight(value)}
                keyboardType="decimal-pad"
                
              />
            </View>
            <View style={{width: '45%'}}>
              <Text style={styles.label}>Select a Unit*</Text>
              <TouchableOpacity onPress={() => setOpenWeightUnitModal(true)}>
                <View
                  style={{
                    width: 160,
                    height: 53,
                    borderWidth: 0.5,
                    borderColor: Colors.grey_darken,
                    borderRadius: 2,
                    marginTop: 4,
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 20,
                        paddingLeft: 10,
                        marginTop: 8,
                      }}>
                      {product_weight_unit}
                    </Text>
                    <Icon
                      name="md-arrow-dropdown"
                      size={28}
                      style={{marginRight: 10, marginTop: 8}}
                      color={Colors.grey_darken}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Product details*</Text>
            <TextInput
              style={[{...styles.textInput}, {maxHeight: 150}]}
              value={product_details}
              onChangeText={(value) => setProductDetails(value)}
              multiline={true}              
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={openWeightUnitModal}
        style={{backgroundColor: '#fff'}}>
        <SafeAreaView>
          <View style={styles.header}>
            <View style={{alignSelf: 'flex-end'}}>
              <TouchableOpacity onPress={() => setOpenWeightUnitModal(false)}>
                <View>
                  <Text
                    style={{
                      fontSize: 17,
                      marginLeft: 10,
                      fontFamily: Fonts.poppins_regular,
                      color: 'red',
                      paddingBottom: 5,
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setProduct_weight_unit('gram');
              setOpenWeightUnitModal(false);
            }}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  marginLeft: 15,
                }}>
                gram
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setProduct_weight_unit('ounce');
              setOpenWeightUnitModal(false);
            }}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  marginLeft: 15,
                }}>
                ounce
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setProduct_weight_unit('pound');
              setOpenWeightUnitModal(false);
            }}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  marginLeft: 15,
                }}>
                pound
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontFamily: Fonts.poppins_regular,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    fontSize: 20,
    fontFamily: Fonts.poppins_regular,
    padding: 10,
    borderColor: Colors.light_grey,
    borderRadius: 5,
    marginTop: 5,
  },
  header: {
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
    backgroundColor: '#fff',
  },
});

export default ProductDetails;
