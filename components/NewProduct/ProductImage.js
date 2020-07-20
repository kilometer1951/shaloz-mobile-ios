import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
  TouchableWithoutFeedback,
  Image,
  
  TouchableOpacity,
  
  ScrollView,
 
  ActionSheetIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';
import * as appActions from '../../store/actions/appActions';
import {useSelector, useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet} from "native-base"

const ProductImage = (props) => {
  const {
    main_image,
    sub_image_1,
    sub_image_2,
    sub_image_3,
    setMainImage,
    setSubImage1,
    setSubImage2,
    setSubImage3,
    setMainCategory,
    main_category,
    setSubCategory1,
    sub_category1,
    setSubCategory2,
    sub_category2,
    setCategoryModal,
    setCategoryModalView,
    setSubCategory1_id,



    setMainImage_data,setSubImage1_data,setSubImage2_data,setSubImage3_data
  } = props;

  const takePhotoMain = () => {
    ImagePicker.openCamera({})
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename + '.JPEG',
          };
          setMainImage_data(data);
          setMainImage(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const browseLibaryMain = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename,
          };
           setMainImage_data(data);
          setMainImage(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const takePhotoSubOne = () => {
    ImagePicker.openCamera({})
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename + '.JPEG',
          };
          setSubImage1_data(data);
          setSubImage1(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const browseLibarySubOne = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename,
          };
          setSubImage1_data(data);
          setSubImage1(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const takePhotoSubTwo = () => {
    ImagePicker.openCamera({})
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename + '.JPEG',
          };
          setSubImage2_data(data);
          setSubImage2(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const browseLibarySubTwo = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename,
          };
          setSubImage2_data(data);
          setSubImage2(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const takePhotoSubThree = () => {
    ImagePicker.openCamera({})
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename + '.JPEG',
          };
          setSubImage3_data(data);
          setSubImage3(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const browseLibarySubThree = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename,
          };
          setSubImage3_data(data);
          setSubImage3(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openActionSheetMain = () =>
  ActionSheet.show(
      {
        options: ['Cancel', 'Take photo', 'Browse libary'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          takePhotoMain();
        } else if (buttonIndex === 2) {
          browseLibaryMain();
        }
      },
    );

  const openActionSheetSubOne = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take photo', 'Browse libary'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          takePhotoSubOne();
        } else if (buttonIndex === 2) {
          browseLibarySubOne();
        }
      },
    );

  const openActionSheetSubTwo = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take photo', 'Browse libary'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          takePhotoSubTwo();
        } else if (buttonIndex === 2) {
          browseLibarySubTwo();
        }
      },
    );

  const openActionSheetSubThree = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take photo', 'Browse libary'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          takePhotoSubThree();
        } else if (buttonIndex === 2) {
          browseLibarySubThree();
        }
      },
    );

  const openCategoryModal = (category_view) => {
    if (category_view === 'main_category_view') {
      setCategoryModalView('main_category_view');
      setCategoryModal(true);
    } else if (category_view === 'sub_category_view') {
      setCategoryModalView('sub_category_view');
      setCategoryModal(true);
    } else {
      setCategoryModalView('sub_category_view_two');
      setCategoryModal(true);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag">
      <View style={{marginBottom:40}}>
        <TouchableOpacity onPress={openActionSheetMain}>
          {Object.entries(main_image).length === 0 ? (
            <View style={styles.image}>
              <Icon
                name="md-add-circle"
                size={30}
                color={Colors.pink}
                style={{alignSelf: 'center', marginTop: '35%'}}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 17,
                  fontFamily: Fonts.poppins_regular,
                }}>
                Main image
              </Text>
            </View>
          ) : (
            <Image
              source={main_image}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <View style={{width: '30%'}}>
            <TouchableOpacity onPress={openActionSheetSubOne}>
              {Object.entries(sub_image_1).length === 0 ? (
                <View
                  style={[
                    {...styles.image},
                    {width: '100%', height: 120, borderRadius: 10},
                  ]}>
                  <Icon
                    name="md-add-circle"
                    size={30}
                    color={Colors.pink}
                    style={{alignSelf: 'center', marginTop: '20%'}}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      fontFamily: Fonts.poppins_regular,
                      textAlign: 'center',
                    }}>
                    Side image one
                  </Text>
                </View>
              ) : (
                <Image
                  source={sub_image_1}
                  style={[
                    {...styles.image},
                    {width: '100%', height: 120, borderRadius: 10},
                  ]}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={{width: '30%'}}>
            <TouchableOpacity onPress={openActionSheetSubTwo}>
              {Object.entries(sub_image_2).length === 0 ? (
                <View
                  style={[
                    {...styles.image},
                    {width: '100%', height: 120, borderRadius: 10},
                  ]}>
                  <Icon
                    name="md-add-circle"
                    size={30}
                    color={Colors.pink}
                    style={{alignSelf: 'center', marginTop: '20%'}}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      fontFamily: Fonts.poppins_regular,
                      textAlign: 'center',
                    }}>
                    Side image two
                  </Text>
                </View>
              ) : (
                <Image
                  source={sub_image_2}
                  style={[
                    {...styles.image},
                    {width: '100%', height: 120, borderRadius: 10},
                  ]}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={{width: '30%'}}>
            <TouchableOpacity onPress={openActionSheetSubThree}>
              {Object.entries(sub_image_3).length === 0 ? (
                <View
                  style={[
                    {...styles.image},
                    {width: '100%', height: 120, borderRadius: 10},
                  ]}>
                  <Icon
                    name="md-add-circle"
                    size={30}
                    color={Colors.pink}
                    style={{alignSelf: 'center', marginTop: '20%'}}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 17,
                      fontFamily: Fonts.poppins_regular,
                      textAlign: 'center',
                    }}>
                    Side image three
                  </Text>
                </View>
              ) : (
                <Image
                  source={sub_image_3}
                  style={[
                    {...styles.image},
                    {width: '100%', height: 120, borderRadius: 10},
                  ]}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{padding: 10}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
            }}>
            Product category
          </Text>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.poppins_semibold,
                marginTop: 15,
              }}>
              Main category*
            </Text>

            <TouchableWithoutFeedback
              onPress={openCategoryModal.bind(this, 'main_category_view')}>
              <View style={styles.dropDownCat}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_regular,
                    marginTop: 3,
                  }}>
                  {main_category}
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
          {main_category !== 'Select' && (
            <View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.poppins_semibold,
                    marginTop: 15,
                  }}>
                  Sub category one
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSubCategory1_id('');
                    setSubCategory2("Select")
                    setSubCategory1('Select');
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.poppins_semibold,
                      marginTop: 15,
                      color: 'blue',
                    }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableWithoutFeedback
                onPress={openCategoryModal.bind(this, 'sub_category_view')}>
                <View style={styles.dropDownCat}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: Fonts.poppins_regular,
                      marginTop: 3,
                    }}>
                    {sub_category1}
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
          )}

          {sub_category1 !== 'Select' && (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.poppins_semibold,
                  marginTop: 15,
                }}>
                Sub category two
              </Text>
              <TouchableWithoutFeedback onPress={openCategoryModal.bind(this, 'sub_category_view_two')}>
                <View style={styles.dropDownCat}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: Fonts.poppins_regular,
                      marginTop: 3,
                    }}>
                    {sub_category2}
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
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 350,
    backgroundColor: '#eeeeee',
  },
  dropDownCat: {
    borderWidth: 1,
    fontSize: 20,
    fontFamily: Fonts.poppins_regular,
    padding: 10,
    borderColor: Colors.light_grey,
    borderRadius: 5,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductImage;
