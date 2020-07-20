import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
  TouchableOpacity,
 
  SafeAreaView,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {DotIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import ViewPager from '@react-native-community/viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkError from '../components/NetworkError';
import UpdatingLoader from '../components/UpdatingLoader';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet} from 'native-base'

import * as authActions from '../store/actions/authActions';





const ChangeShopLogoScreen = (props) => {
  const dispatch = useDispatch();
  const [networkError, setNetworkError] = useState(false);
  const user = useSelector((state) => state.authReducer.user);

  const [shopLogo, setShopLogo] = useState({uri: user.shop_logo});

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
         // setShopImageObject(data);
         setShopLogo(source);
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
             // setShopImageObject(data);
             dispatch(authActions.changeShopLogo(data,response.path, user._id));
              setShopLogo(source);
            }
          })
          .catch((e) => {
            console.log(e);
          });
}
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
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Shop
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
              }}>
              Shop Logo
            </Text>
          </View>
          <View style={{width: '20%'}}></View>
        </View>
      </SafeAreaView>
      <View style={{alignSelf: 'center', marginTop: 20}}>
        <View style={styles.imageContainer}>
          <Image source={shopLogo} style={styles.image} resizeMode="cover" />
        </View>
        <TouchableOpacity onPress={openActionSheet}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              padding: 15,
              backgroundColor: Colors.purple_darken,
              marginTop: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 25,
                alignSelf: 'center',
                color: '#fff',
              }}>
              Change logo
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
    </View>
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
  },
  headerRow: {
    width: '60%',
  },
  imageContainer: {
    width: 250,
    height: 220,
    borderColor: 'black',
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
export default ChangeShopLogoScreen;
