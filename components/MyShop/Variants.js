import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  
  FlatList,
  
  TouchableOpacity,
Alert
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';
import NewVariantModal from './NewVariantModal';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';
import {cos} from 'react-native-reanimated';

//const {height} = Dimensions.get('window');

const ProductOptions = (props) => {
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

  const addNewOptionContent = (_variant_id, _name) => {
    setName(_name);
    setVariant_id(_variant_id);
    setActionType('add');
    setViewToRender('option_content');
    setOpenNewVariantModal(true);
  };

  const editOptionName = (_variant_id, _name) => {
    setName(_name);
    setVariant_id(_variant_id);
    setActionType('edit');
    setViewToRender('option_name');
    setOpenNewVariantModal(true);
  };

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '. . .' : this;
    };

  const deleteVariant = (variant_id) => {
    try {
      dispatch(appActions.deleteVariant(variant_id));
    } catch (e) {
      setNetworkError(true);
    }
  };

  const deleteVariantContent = async (variant_id, variant_content_id) => {
    try {
      const response = await appActions.deleteVariantContent(
        variant_id,
        variant_content_id,
      );
      getProductOptions();
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const openActionSheetDeleteVariant = (variant_id) =>{
    Alert.alert(
      'Are you sure?',
      '',

      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteVariant(variant_id);
          },
        },
      ],
      {cancelable: false},
    );
  
  }
    

  const openActionSheetDeleteVariantContent = (
    variant_id,
    variant_content_id,
  ) =>
    {
      Alert.alert(
        'Are you sure?',
        '',
  
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              deleteVariantContent(variant_id, variant_content_id);
            },
          },
        ],
        {cancelable: false},
      );
    
    
    }

  const editOptionContent = (
    _variant_id,
    variant_content_id,
    _content,
    _price,
    __name,
  ) => {
    console.log(variant_id, variant_content_id);
    setContent(_content);
    setContent_price(_price);
    setVariant_id(_variant_id);
    setVariantContentId(variant_content_id);
    setName(__name);
    setRemoveBackButton(true);
    setActionType('edit');
    setViewToRender('option_content');
    setOpenNewVariantModal(true);
  };

  const displayVariantContent = (items, variant_id, __name) => {
    return items.map((result, index, array) => {
      return (
        <View
          key={index}
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

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={editOptionContent.bind(
                this,
                variant_id,
                result._id,
                result.content,
                result.price,
                __name,
              )}>
              <View style={{marginRight: 20}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    color: Colors.blue,
                  }}>
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openActionSheetDeleteVariantContent.bind(
                this,
                variant_id,
                result._id,
              )}>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 18,
                    color: 'red',
                  }}>
                  Delete
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  let view;
  if (variants.length === 0) {
    view = (
      <View style={{alignSelf: 'center', marginTop: '40%',padding:25}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_light,
            fontSize: 20,
            fontWeight: '300',
            textAlign: 'center',
          }}>
          You have not created any variant(s) yet.
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
        <TouchableOpacity onPress={newVariant}>
          <View style={{flexDirection: 'row', marginTop: 5}}>
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
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={addNewOptionContent.bind(
                      this,
                      item._id,
                      item.name,
                    )}>
                    <Icon
                      name="ios-add-circle"
                      size={23}
                      color={Colors.purple_darken}
                      style={{marginRight: 25}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={editOptionName.bind(this, item._id, item.name)}>
                    <Icon
                      name="md-create"
                      size={23}
                      color={Colors.blue}
                      style={{marginRight: 25}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openActionSheetDeleteVariant.bind(this, item._id)}>
                    <Icon
                      name="ios-trash"
                      size={23}
                      color="red"
                      style={{marginRight: 10}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {displayVariantContent(item.variantContent, item._id, item.name)}
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
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

const styles = StyleSheet.create({});

export default ProductOptions;
