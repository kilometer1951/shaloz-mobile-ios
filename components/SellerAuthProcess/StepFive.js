import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,SafeAreaView
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import NetworkError from '../NetworkError';
import {ActionSheet} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';

import * as authActions from '../../store/actions/authActions';

//const {height} = Dimensions.get('window');

const StepFive = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const {
    setImageSelectedPhotoID_back,
    imageSelectedPhotoID_back,
    setViewToRender,
    setViewNumber,closeModal
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [backImageObject, setBackImageObject] = useState({});
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
          setBackImageObject(data);
          setImageSelectedPhotoID_back(source);
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
            name: response.filename,
          };
          setBackImageObject(data);
          setImageSelectedPhotoID_back(source);
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
      Alert.alert(
        'Verify information',
        'If your government issued ID does not match your legal first and last name, we would not be able to verify your identity. Verification takes 5 to 10 seconds if your first and last name you used to signup matches your government issued id.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'text',
          },
          {
            text: 'Next',
            style: 'text',

            onPress: async () => {
              setIsLoading(true);
              const response = await authActions.updateBackID(
                backImageObject,
                user._id,
              );
              setIsLoading(false);
              if (!response.status) {
                setIsLoading(false);
                setNetworkError(true);
                return;
              }
              setViewNumber('6');
              setViewToRender('step6');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  return (
    <ScrollView>
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
            Saving and uploading please wait
          </Text>
        </View>
      ) : (
        <View style={{padding: 10}}>
          <SafeAreaView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
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
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
            }}>
            Government-Issued ID
          </Text>
          <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
            We need a copy of any government-issued ID. This is for verification
            purposes. Inorder to proccess your earnings, an image of the front
            is required for government-issued IDs and driver’s licenses. Image
            should be in color and have all information clearly legible. Files
            should be in color, be rotated with the image right-side up, and
            have all information clearly legible. Raise your phone above the
            image to take a clear photo.
          </Text>
          <View style={{alignSelf: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 30,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              Back
            </Text>
            <TouchableOpacity onPress={openActionSheet}>
              {Object.entries(imageSelectedPhotoID_back).length === 0 ? (
                <View style={styles.image}>
                  <Icon
                    name="md-add-circle"
                    size={30}
                    color={Colors.pink}
                    style={{alignSelf: 'center', marginTop: '40%'}}
                  />
                </View>
              ) : (
                <Image
                  source={imageSelectedPhotoID_back}
                  style={styles.image}
                />
              )}
            </TouchableOpacity>
          </View>

          {Object.entries(imageSelectedPhotoID_back).length !== 0 && (
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
      )}
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 300,
    marginTop: 10,
    borderRadius: 10,
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
    marginTop: 20,
  },
});

export default StepFive;
