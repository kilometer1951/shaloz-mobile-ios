import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';
import NetworkError from '../NetworkError';

import * as appAction from '../../store/actions/appActions';
import * as authActions from '../../store/actions/authActions';

//const {height} = Dimensions.get('window');

const StepOne = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const {
    setImageSelected,
    imageSelected,
    setViewToRender,
    setViewNumber,
    closeModal,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [shopImageObject, setShopImageObject] = useState({});
  const [networkError, setNetworkError] = useState(false);

  const takePhoto = () => {
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
          //dispatch(authActions.referenceLicensePhotoData(data));
          setShopImageObject(data);
          setImageSelected(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const browseLibary = () => {
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
            name:
              Platform.OS === 'ios'
                ? response.filename
                : response.filename + '.JPEG',
          };
          setShopImageObject(data);
          //   dispatch(authActions.referenceLicensePhotoData(data));
          setImageSelected(source);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openActionSheet = () =>
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
          takePhoto();
        } else if (buttonIndex === 2) {
          browseLibary();
        }
      },
    );

  const goToSection = async () => {
    try {
      setIsLoading(true);
      await authActions.uploadShopPhoto(shopImageObject, user._id);
      setIsLoading(false);
      setViewNumber('2');
      setViewToRender('step2');
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  return (
    <View>
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
            Saving and verifying please wait ...
          </Text>
        </View>
      ) : (
        <View>
          <SafeAreaView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <TouchableOpacity onPress={() => closeModal()}>
                <View>
                  <Icon name="ios-close" size={35} />
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 18,
                  marginTop: 5,
                }}>
                {props.viewNumber}/6
              </Text>
            </View>
          </SafeAreaView>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 20,
                marginTop: 8,
                textAlign: 'center',
              }}>
              Profile picture OR Company logo
            </Text>
            <TouchableOpacity onPress={openActionSheet}>
              {Object.entries(imageSelected).length === 0 ? (
                <View style={styles.image}>
                  <Icon
                    name="md-add-circle"
                    size={30}
                    color={Colors.pink}
                    style={{alignSelf: 'center', marginTop: '40%'}}
                  />
                </View>
              ) : (
                <Image source={imageSelected} style={styles.image} />
              )}
            </TouchableOpacity>

            {Object.entries(imageSelected).length !== 0 && (
              <TouchableWithoutFeedback
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactLight', {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                  });
                  goToSection();
                }}>
                <View style={styles.button}>
                  <Icon name="md-arrow-round-forward" size={40} color="white" />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
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
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: '#eeeeee',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});

export default StepOne;
