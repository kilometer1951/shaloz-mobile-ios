import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  
  TextInput,
  TouchableOpacity,
 
  Modal,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';
import {Tooltip} from 'react-native-elements';

import * as appActions from '../../store/actions/appActions';

import {MaterialIndicator} from 'react-native-indicators';

const NewVariantModal = (props) => {
  const {
    openNewVariantModal,
    setOpenNewVariantModal,
    closeVariantModal,
    viewToRender,
    setViewToRender,
    variant_id,
    setVariant_id,
    content_price,
    setContent_price,
    setContent,
    content,
    setActionType,
    actionType,
    setName,
    name,
    variantContentId,
    removeBackButton,
  } = props;
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.authReducer.user);

  const optionList = [
    {id: '1', name: 'Color'},
    {id: '2', name: 'Finish'},
    {id: '3', name: 'Material'},
    {id: '4', name: 'Style'},
    {id: '5', name: 'Size'},
  ];

  const options = optionList.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setName(result.name);
          addOptionName_list(result.name);
        }}>
        <View
          style={{
            borderBottomColor: Colors.light_grey,
            borderBottomWidth: 0.5,
            paddingBottom: 5,
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginTop: 5,
            }}>
            {result.name}
          </Text>
          <Icon name="ios-arrow-forward" size={25} />
        </View>
      </TouchableOpacity>
    );
  });

  const addOptionName = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.addVariant(name, user._id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setVariant_id(response.variant_id);
      setViewToRender('option_content');
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };
  const addOptionName_list = async (_name) => {
    try {
      setIsLoading(true);
      const response = await appActions.addVariant(_name, user._id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setVariant_id(response.variant_id);
      setViewToRender('option_content');
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const addOptionContent = () => {
    try {
      appActions.addOptionContent(
        variant_id,
        content,
        parseFloat(content_price).toFixed(2),
      );
      setContent('');
      setContent_price('0.00');
    } catch (e) {
      setNetworkError(true);
    }
  };

  const editOptionName = async () => {
    try {
      setIsLoading(true);
      await appActions.editOptionName(variant_id, name);
      setIsLoading(false);
      closeVariantModal();
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const editOptionContent = async () => {
    try {
      setIsLoading(true);
      await appActions.editOptionContent(
        variant_id,
        variantContentId,
        content,
        parseFloat(content_price).toFixed(2),
      );
      setIsLoading(false);
      closeVariantModal();
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  let view;
  if (viewToRender === 'option_name') {
    view = (
      <View style={{padding: 10}}>
        <View style={{width: '100%', flexDirection: 'row'}}>
          <View
            style={{
              width: name !== '' ? '80%' : '100%',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
                marginTop: 15,
              }}>
              Option name
            </Text>
            <TextInput
              placeholder="Example - Size"
              style={{
                borderWidth: 1,
                fontSize: 20,
                fontFamily: Fonts.poppins_regular,
                padding: 10,
                borderColor: Colors.light_grey,
                borderRadius: 5,
                width: '100%',
              }}
              value={name}
              onChangeText={(value) => setName(value)}
              autoFocus={true}
            />
          </View>

          <View style={{width: '20%', marginTop: 30}}>
            {name !== '' && (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (actionType === 'add') {
                    addOptionName();
                  } else {
                    editOptionName();
                  }
                }}>
                <View style={styles.button}>
                  <Icon
                    name={actionType === 'add' ? 'md-add' : 'md-create'}
                    size={40}
                    color="white"
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        {actionType === 'add' && options}
      </View>
    );
  } else {
    view = (
      <View
        style={{
          width: '100%',
          padding: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 15,
          }}>
          Option value
        </Text>
        <TextInput
          placeholder="option value"
          style={{
            borderWidth: 1,
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            padding: 10,
            borderColor: Colors.light_grey,
            borderRadius: 5,
            width: '100%',
          }}
          value={content}
          onChangeText={(value) => setContent(value)}
          autoFocus={true}
        />
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 15,
            }}>
            Option price
          </Text>
          <Tooltip
            popover={
              <Text
                style={{
                  color: '#fff',
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 18,
                }}>
                This is an add-on to your products price(extra). If your product
                price is $100.00 and your option price is $2.00, your customers
                new total will be $102.00 if your customer selects this option.
              </Text>
            }
            backgroundColor={Colors.purple_darken}
            height={300}
            width={250}>
            <Icon
              name="ios-help-circle"
              size={20}
              style={{marginTop: 18, marginLeft: 10}}
              color={Colors.purple_darken}
            />
          </Tooltip>
        </View>
        <TextInput
          placeholder="Example - $2.00"
          style={{
            borderWidth: 1,
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            padding: 10,
            borderColor: Colors.light_grey,
            borderRadius: 5,
            width: '100%',
          }}
          value={content_price}
          onChangeText={(value) => setContent_price(value)}
          keyboardType="decimal-pad"
        />
        <View>
          <TouchableOpacity
            disabled={content === '' || content_price === '' ? true : false}
            onPress={() => {
              if (actionType === 'add') {
                addOptionContent();
              } else {
                editOptionContent();
              }
            }}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 15,
                backgroundColor: Colors.purple_darken,
                marginTop: 10,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                opacity: content === '' || content_price === '' ? 0.4 : 1,
              }}>
              <Icon
                name={actionType === 'add' ? 'ios-add' : 'md-create'}
                size={30}
                style={{marginRight: 10}}
                color="#fff"
              />
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 20,
                  alignSelf: 'center',
                  color: '#fff',
                }}>
                {actionType === 'add' ? 'Add' : 'Edit'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  let headerView;
  if (viewToRender === 'option_name') {
    headerView = (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '20%'}}>
          <TouchableOpacity onPress={() => closeVariantModal()}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '60%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              alignSelf: 'center',
            }}>
            {actionType === 'add' ? ' New Variant' : 'Edit ' + name}
          </Text>
        </View>

        <View style={{width: '20%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
            }}></Text>
        </View>
      </View>
    );
  } else {
    headerView = (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '20%'}}>
          {!removeBackButton && (
            <TouchableOpacity
              onPress={() => {
                setName('');
                setViewToRender('option_name');
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    marginLeft: 10,
                  }}>
                  Back
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={{width: '60%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              alignSelf: 'center',
            }}>
            {name}
          </Text>
        </View>

        <View style={{width: '20%'}}>
          <TouchableOpacity onPress={() => closeVariantModal()}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
                alignSelf:'flex-end'
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openNewVariantModal}>
      <View style={styles.screen}>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.light_grey,
            padding: 10,
          }}>
          <SafeAreaView>{headerView}</SafeAreaView>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag">
          {isLoading ? (
            <View style={{alignItems: 'center', marginTop: '40%'}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{
                  paddingHorizontal: 10,
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 18,
                  marginTop: 15,
                  marginTop: 40,
                }}>
                Saving please wait
              </Text>
            </View>
          ) : (
            view
          )}
        </ScrollView>
        {networkError && (
          <NetworkError
            networkError={networkError}
            setNetworkError={setNetworkError}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: '10%',
  },
});

export default NewVariantModal;
