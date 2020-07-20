import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
  TouchableOpacity,
  
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';
import * as appActions from '../../store/actions/appActions';
import Modal from 'react-native-modalbox';
import UpdatingLoader from '../UpdatingLoader';

const InfoModal = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);

  const [networkError, setNetworkError] = useState(false);
  const {
    openInfoModal,
    setOpenInfoModal,
    setEditViewToRender,
    setOpenEditModal,
    editItemData,
  } = props;

  const onClose = () => {
    setOpenInfoModal(false);
  };

  return (
    <Modal
      style={styles.modal}
      position={'bottom'}
      isOpen={openInfoModal}
      onClosed={onClose}>
      <View
        style={{
          width: 100,
          height: 5,
          backgroundColor: '#bdbdbd',
          alignSelf: 'center',
          borderRadius: 20,
        }}
      />
      {editItemData.productHasVariant && (
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setEditViewToRender('variant');
              onClose();
              setOpenEditModal(true);
            }}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  marginLeft: 15,
                }}>
                Product option
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {console.log(editItemData.product_can_be_customized)}

      {editItemData.product_can_be_customized && (
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            onPress={async () => {
              Alert.prompt(
                'Edit personalization for ' + editItemData.product_name,
                editItemData.product_personalization_note,
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'destructive',

                  },
                  {
                    text: 'OK',
                    onPress: async (product_personalization_note) => {
                      console.log(product_personalization_note);
                      if (product_personalization_note !== '') {
                        try {
                          setIsLoading(true);
                          await appActions.updateCartProductPersonlizationText(
                            user._id,
                            product_personalization_note,
                            editItemData.cart_id,
                            editItemData.item_id,
                          );
                          await dispatch(appActions.fetchCartData(user._id, 1));
                          setIsLoading(false);
                          onClose()
                        } catch (e) {
                          setIsLoading(false);
                          setNetworkError(true);
                        }
                      }
                    },
                  },
                ],
              );

              //setEditViewToRender('customization');
              // onClose();
              // setOpenEditModal(true);
            }}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  marginLeft: 15,
                }}>
                Edit personalization
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={{marginTop: 20}}>
        <TouchableOpacity
          onPress={() => {
            setEditViewToRender('qty');
            onClose();
            setOpenEditModal(true);
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 20,
                marginLeft: 15,
              }}>
              Add qty
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {isLoading && <UpdatingLoader />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '30%',
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
});

export default InfoModal;
