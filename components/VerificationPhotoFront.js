import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
  TouchableWithoutFeedback,
  Image,
  
  TouchableOpacity,
  
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';


//const {height} = Dimensions.get('window');

const VerificationPhotoFront = (props) => {
  const dispatch = useDispatch();
  const {
    setImageSelectedPhotoID,
    imageSelectedPhotoID,
    setFrontImageObject,frontImageObject
  } = props;
  const user = useSelector((state) => state.authReducer.user);

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
          setFrontImageObject(data);
          setImageSelectedPhotoID(source);
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
          setFrontImageObject(data);
          setImageSelectedPhotoID(source);
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

  
  return (
    <ScrollView>
      
        <View>
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
                fontSize: 20,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              Front
            </Text>
            <TouchableOpacity onPress={openActionSheet}>
              {Object.entries(imageSelectedPhotoID).length === 0 ? (
                <View style={styles.image}>
                  <Icon
                    name="md-add-circle"
                    size={30}
                    color={Colors.pink}
                    style={{alignSelf: 'center', marginTop: '40%'}}
                  />
                </View>
              ) : (
                <Image source={imageSelectedPhotoID} style={styles.image} />
              )}
            </TouchableOpacity>
          </View>

     
        </View>
     
     
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

export default VerificationPhotoFront;
