import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';
import * as appActions from '../../store/actions/appActions';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ProductDiscount = (props) => {
  const {
    discount,
    discount_start_date,
    discount_end_date,
    allow_purchase_when_out_of_stock,
    setProductHasDiscount,
    productHasDiscount,
    setDiscount,
    setDiscount_start_date,
    setDiscount_end_date,
    setProductCanBeCustomized,
    productCanBeCustomized,
    setAllow_purchase_when_out_of_stock,
    product_can_be_customized_is_optional,
    setProduct_can_be_customized_is_optional,
    product_personilization_note,
    setProduct_personilization_note,
  } = props;
  const [isDatePickerVisible_start, setDatePickerVisibility_start] = useState(
    false,
  );
  const [isDatePickerVisible_end, setDatePickerVisibility_end] = useState(
    false,
  );

  const hideDatePicker = () => {
    setDatePickerVisibility_start(false);
  };

  const handleConfirm = (date) => {
    const newDate = Moment(date).format('MM / DD / YYYY');
    setDiscount_start_date(newDate);
    hideDatePicker();
  };

  const hideDatePicker_end = () => {
    setDatePickerVisibility_end(false);
  };

  const handleConfirm_end = (date) => {
    const newDate = Moment(date).format('MM / DD / YYYY');
    setDiscount_end_date(newDate);
    hideDatePicker_end();
  };

  return (
    <KeyboardAwareScrollView
      scrollEnabled={true}
      enableAutomaticScroll={true}
      extraHeight={300}
      keyboardShouldPersistTaps="always">
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <View style={{padding: 10}}>
          <TouchableOpacity
            onPress={() => {
              //   setDiscount('1');

              setProductHasDiscount((prev) => {
                if (prev) {
                  setDiscount('');
                  //  console.log("0");
                } else {
                  // console.log("1");

                  setDiscount('1');
                }
                let _prev = !prev;
                return _prev;
              });
            }}>
            <View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                {productHasDiscount ? (
                  <Icon
                    name="md-checkbox-outline"
                    size={35}
                    color={Colors.grey_darken}
                  />
                ) : (
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 2,
                      borderColor: Colors.grey_darken,
                      borderRadius: 2,
                    }}
                  />
                )}

                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 20,
                    marginLeft: 10,
                  }}>
                  Apply discount
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {productHasDiscount && (
            <View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_semibold,
                    marginTop: 10,
                  }}>
                  Discount (%)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    fontSize: 20,
                    fontFamily: Fonts.poppins_regular,
                    padding: 10,
                    borderColor: Colors.light_grey,
                    borderRadius: 5,
                  }}
                  value={discount}
                  keyboardType="number-pad"
                  onChangeText={(value) => setDiscount(value)}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_semibold,
                    marginTop: 15,
                  }}>
                  Select an end date
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => setDatePickerVisibility_end(true)}>
                  <View
                    style={{
                      borderWidth: 1,
                      fontSize: 20,
                      fontFamily: Fonts.poppins_regular,
                      padding: 10,
                      borderColor: Colors.light_grey,
                      borderRadius: 5,
                      height: 55,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: Fonts.poppins_regular,
                        marginTop: 3,
                      }}>
                      {discount_end_date}
                    </Text>
                    <Icon
                      name="md-arrow-dropdown"
                      size={30}
                      style={{marginLeft: 5}}
                      color={Colors.light_grey}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
          <View style={{marginTop: 20}}>
            <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 20}}>
              Product personlization
            </Text>
            <TouchableOpacity
              onPress={() => {
                setProduct_can_be_customized_is_optional(true)
                setProductCanBeCustomized((prev) => {
                  let _prev = !prev;
                  return _prev;
                });
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    flexWrap: 'wrap',
                  }}>
                  <View style={{width: '8%'}}>
                    {productCanBeCustomized ? (
                      <Icon
                        name="md-checkbox-outline"
                        size={35}
                        color={Colors.grey_darken}
                      />
                    ) : (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderWidth: 2,
                          borderColor: Colors.grey_darken,
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </View>
                  <View style={{width: '90%'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 20,
                        marginLeft: 10,
                      }}>
                      Can this product be personalized or customized ?
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {productCanBeCustomized && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setProduct_can_be_customized_is_optional((prev) => {
                      let _prev = !prev;
                      return _prev;
                    });
                  }}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        flexWrap: 'wrap',
                      }}>
                      <View style={{width: '8%'}}>
                        {!product_can_be_customized_is_optional ? (
                          <Icon
                            name="md-checkbox-outline"
                            size={35}
                            color={Colors.grey_darken}
                          />
                        ) : (
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              borderWidth: 2,
                              borderColor: Colors.grey_darken,
                              borderRadius: 2,
                            }}
                          />
                        )}
                      </View>
                      <View style={{width: '90%'}}>
                        <Text
                          style={{
                            fontFamily: Fonts.poppins_regular,
                            fontSize: 20,
                            marginLeft: 10,
                          }}>
                          Is it mandatory to enter a personlization before
                          checkout?
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 20,
                    marginTop: 20,
                  }}>
                  Personlization note to buyers
                </Text>

                <TextInput
                  style={{
                    borderWidth: 1,
                    fontSize: 20,
                    fontFamily: Fonts.poppins_regular,
                    padding: 10,
                    borderColor: Colors.light_grey,
                    borderRadius: 5,
                    maxHeight: 200,
                  }}
                  value={product_personilization_note}
                  onChangeText={(value) =>
                    setProduct_personilization_note(value)
                  }
                  multiline={true}
                />
              </View>
            )}
          </View>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
              marginTop: 30,
            }}>
            Product settings
          </Text>
          <TouchableOpacity
            onPress={() => {
              setAllow_purchase_when_out_of_stock((prev) => {
                let _prev = !prev;
                return _prev;
              });
            }}>
            <View>
              <View
                style={{flexDirection: 'row', marginTop: 15, flexWrap: 'wrap'}}>
                <View style={{width: '8%'}}>
                  {allow_purchase_when_out_of_stock ? (
                    <Icon
                      name="md-checkbox-outline"
                      size={35}
                      color={Colors.grey_darken}
                    />
                  ) : (
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderWidth: 2,
                        borderColor: Colors.grey_darken,
                        borderRadius: 2,
                      }}
                    />
                  )}
                </View>

                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 20,
                      marginLeft: 10,
                    }}>
                    Allow purchase when out of stock
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible_start}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            locale="en_GB" // Use "en_GB" here
            minimumDate={new Date()}
            isDarkModeEnabled={false}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible_end}
            mode="date"
            onConfirm={handleConfirm_end}
            onCancel={hideDatePicker_end}
            locale="en_GB" // Use "en_GB" here
            minimumDate={new Date()}
            isDarkModeEnabled={false}
          />
        </View>
      </ScrollView>
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
});

export default ProductDiscount;

// <View>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   fontFamily: Fonts.poppins_semibold,
//                   marginTop: 15,
//                 }}>
//                 Select a start date
//               </Text>
//               <TouchableWithoutFeedback
//                 onPress={() => setDatePickerVisibility_start(true)}>
//                 <View
//                   style={{
//                     borderWidth: 1,
//                     fontSize: 20,
//                     fontFamily: Fonts.poppins_regular,
//                     padding: 10,
//                     borderColor: Colors.light_grey,
//                     borderRadius: 5,
//                     height: 55,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                   }}>
//                   <Text
//                     style={{
//                       fontSize: 18,
//                       fontFamily: Fonts.poppins_regular,
//                       marginTop: 3,
//                     }}>
//                     {discount_start_date}
//                   </Text>
//                   <Icon
//                     name="md-arrow-dropdown"
//                     size={30}
//                     style={{marginLeft: 5}}
//                     color={Colors.light_grey}
//                   />
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
