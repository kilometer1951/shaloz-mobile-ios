import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';

import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';
import NetworkError from '../NetworkError';

import * as authActions from '../../store/actions/authActions';

//const {height} = Dimensions.get('window');

const StepTwo = (props) => {
  const dispatch = useDispatch();
  const {setShopName, shopName, setViewToRender, setViewNumber,closeModal} = props;
  const user = useSelector((state) => state.authReducer.user);

  const [activityIndicator, setActivityIndicator] = useState(false);
  const [shopLocation, setShopLocation] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';
  const myLocation = (section) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        setActivityIndicator(true);
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myApiKey}`,
        );
        const res = await response.json();
        let address = res.results[0].formatted_address;
        // setLocationLat(res.results[0].geometry.location.lat);
        // setLocationLng(res.results[0].geometry.location.lng);
        setDisplayError(false);
        setShopLocation(address);
        setActivityIndicator(false);
      },
      (error) => {
        console.log(error);
        setActivityIndicator(false);
        // setNetworkError(true);
        Alert.alert(
          'Location Error',
          'Cannot get current location, try searching',
          [
            {
              text: 'Ok',
              onPress: async () => {},
            },
          ],
          {cancelable: false},
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSearch = async (value) => {
    setShopLocation(value);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&key=${myApiKey}`,
    );
    const resData = await response.json();
    setSearchData(resData.results);
    let newAdressArray = shopLocation.split(',');
    //newAdressArray.length !== 4 && setDisplayNextButton(false);
  };

  const goToSection = async () => {
    try {
      setIsLoading(true);
      let newAdressArray = shopLocation.split(',');
      if (newAdressArray.length == 4) {
        if (newAdressArray[3].trim() !== '') {
          let address = newAdressArray[0].trim();
          let locationState = newAdressArray[2].slice(0, 3).trim();
          let locationCity = newAdressArray[1].trim();
          let postalCode = newAdressArray[2]
            .split(`${locationState}`)[1]
            .trim();
          const response = await authActions.updateShopLocation(
            locationState,
            locationCity,
            address,
            postalCode,
            user._id,
            shopName,
          );
          if (!response.status) {
            setIsLoading(false);
            return;
          }
          setIsLoading(false);
          setViewNumber('3');
          setViewToRender('step3');
        } else {
          setIsLoading(false);
          setDisplayError(true);
        }
      } else {
        setIsLoading(false);
        setDisplayError(true);
      }
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  return (
    <View style={{}}>
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
          <View style={{width: '100%'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
                marginTop: 15,
              }}>
              Create your shop name*
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                fontSize: 20,
                fontFamily: Fonts.poppins_regular,
                padding: 10,
                borderColor: Colors.light_grey,
                borderRadius: 5,
                width: '100%',
              }}
              value={shopName}
              onChangeText={(value) => setShopName(value)}
              autoFocus={true}
            />
          </View>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <View
              style={{
                width: shopName !== '' && shopLocation !== '' ? '80%' : '100%',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Fonts.poppins_semibold,
                  marginTop: 15,
                }}>
                Shop location
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                  padding: 10,
                  borderColor: Colors.light_grey,
                  borderRadius: 5,
                  width: '100%',
                }}
                value={shopLocation}
                onChangeText={handleSearch}
              />
            </View>

            <View style={{width: '20%', marginTop: 30}}>
              {shopName !== '' && shopLocation !== '' && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger('impactLight', {
                      enableVibrateFallback: true,
                      ignoreAndroidSystemSettings: false,
                    });
                    goToSection();
                  }}>
                  <View style={styles.button}>
                    <Icon
                      name="md-arrow-round-forward"
                      size={40}
                      color="white"
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
          {displayError && (
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  color: Colors.pink,
                }}>
                Invalid address. We need a complete address. For example: 1800
                Ellis St, San Francisco, CA 94115, USA
              </Text>
            </View>
          )}
          <View>
            {!activityIndicator ? (
              <TouchableOpacity
                style={styles.locationButton}
                onPress={myLocation}>
                <Icon
                  name="md-locate"
                  size={20}
                  style={{marginRight: 10, marginTop: 3}}
                  color={Colors.pink}
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000',
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Use my current location
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  marginTop: 30,
                }}>
                <MaterialIndicator color={Colors.pink} />
              </View>
            )}
          </View>
          <FlatList
            data={searchData}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.listView}
                onPress={() => {
                  // setLocationLat(item.geometry.location.lat);
                  // setLocationLng(item.geometry.location.lng);
                  setShopLocation(item.formatted_address);
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  {item.formatted_address}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            style={{height: '100%'}}
          />
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
    marginTop: '10%',
  },
  locationButton: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    //display: !displayCheckButton ? 'none' : 'flex',
  },
  listView: {
    flexDirection: 'column',
    padding: 5,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
});

export default StepTwo;
