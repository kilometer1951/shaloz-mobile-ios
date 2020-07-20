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
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';
import NetworkError from '../components/NetworkError';

import * as authActions from '../store/actions/authActions';

const SellerShippingLocationScreen = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const [shopName, setShopName] = useState(user.shop_name);
  const [isLoading, setIsLoading] = useState(true);
  const [updateButton, setUpdateButton] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [shopLocation, setShopLocation] = useState(
    `${user.shop_address}, ${user.shop_location_city}, ${user.shop_location_state} ${user.shop_postal_code}, ${user.country} `,
  );
  const [searchData, setSearchData] = useState([]);
  const [displayError, setDisplayError] = useState(false);
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
        setUpdateButton(true);
        setShopLocation(address);
        setActivityIndicator(false);
      },
      (error) => {
        console.log(error);
        setActivityIndicator(false);
        // setNetworkError(true);
        Alert.alert(
          'Location Error',
          'Cannot get current location try searching thanks',
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

  const updateShippingPromo = async () => {
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
          authActions.updateShopLocation(
            locationState,
            locationCity,
            address,
            postalCode,
            user._id,
            shopName,
          );

          let data = {
            locationState,
            locationCity,
            address,
            postalCode,
            shopName,
          };

          dispatch(authActions.updateShopLocationShopNameSettings(data));
          props.navigation.goBack();

          setIsLoading(false);
        } else {
          setIsLoading(false);
          setDisplayError(true);
        }
      } else {
        setIsLoading(false);
        setDisplayError(true);
      }
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      setNetworkError(true);
    }
  };

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
              Shipping promotion
            </Text>
          </View>
          <View style={{width: '20%'}}>
            {updateButton && (
              <TouchableOpacity onPress={updateShippingPromo}>
                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontSize: 17,
                      marginRight: 10,
                      fontFamily: Fonts.poppins_regular,
                      color: 'blue',
                    }}>
                    update
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
      <View style={{width: '100%', padding: 10}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 15,
          }}>
          Update your shop name
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
          onChangeText={(value) => {
            setUpdateButton(true);
            setShopName(value);
          }}
          autoFocus={true}
        />
      </View>
      <View style={{width: '100%', flexDirection: 'row', padding: 10}}>
        <View
          style={{
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
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
      </View>
      {displayError && (
        <View style={{padding: 10}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              color: Colors.pink,
            }}>
            Invalid address. We need a complete address. For example: 1800 Ellis
            St, San Francisco, CA 94115, USA
          </Text>
        </View>
      )}

      <View>
        {!activityIndicator ? (
          <TouchableOpacity style={styles.locationButton} onPress={myLocation}>
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
              setUpdateButton(true);
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
  locationButton: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
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

export default SellerShippingLocationScreen;
