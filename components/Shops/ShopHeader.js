import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,Share
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import NetworkError from '../NetworkError';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import StarRating from 'react-native-star-rating';
import {ScrollView} from 'react-native-gesture-handler';
import * as appActions from '../../store/actions/appActions';

const ShopHeader = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);

  const [rateNumber, setRateNumber] = useState(5);
  const {seller_id} = props;
  const [isVisibile, setIsvisible] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [sellerDetails, setSellerDetails] = useState({});

  useEffect(() => {
    const check_fav = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.checkShopFav(user._id, seller_id);

        setIsLoading(false);
        setSellerDetails(response.sellerDetails);
        setIsFav(response.fav_shop);
      } catch (e) {
        console.log(e);
      }
    };

    check_fav();
  }, []);

  const addFavShop = async () => {
    try {
      if (isFav) {
        dispatch(appActions.removeFavShop(user._id, sellerDetails._id));
        setIsFav((prev) => {
          const newValue = !prev;
          if (newValue) {
            console.log(newValue);
          } else {
            console.log(newValue);
          }
          return newValue;
        });
      } else {
        dispatch(appActions.addFavShop(user._id, sellerDetails._id));
        setIsFav((prev) => {
          const newValue = !prev;
          if (newValue) {
            console.log(newValue);
          } else {
            console.log(newValue);
          }
          return newValue;
        });
      }
    } catch (e) {
      console.log(e);
      setNetworkError(true);
    }
  };

  return (
    <View>
      {!isLoading && (
        <View style={styles.topHeader}>
          <View>
            <Image
              source={{
                uri: sellerDetails.shop_logo,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{marginLeft: 5}}>
            <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 18}}>
              {sellerDetails.shop_name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={rateNumber}
                  fullStarColor="#000"
                  starSize={18}
                  starStyle={{marginTop: 2, marginRight: 1}}
                />
              </View>
              {isVisibile && (
                <View style={{marginLeft: 3}}>
                  <Text
                    style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
                    (2,021)
                  </Text>
                </View>
              )}
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="ios-pin"
                size={25}
                style={{marginRight: 5}}
                color={Colors.purple_darken}
              />
              <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
                {sellerDetails.shop_location_city +
                  ', ' +
                  sellerDetails.shop_location_state}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  {...styles.customButton},
                  {backgroundColor: isFav ? '#000' : '#fff'},
                ]}
                onPress={addFavShop}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name={isFav ? 'ios-heart' : 'ios-heart-empty'}
                    size={20}
                    style={{
                      marginRight: 10,
                      alignSelf: 'center',
                      marginLeft: 2,
                    }}
                    color={isFav ? '#fff' : '#000'}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: Fonts.poppins_regular,
                      color: isFav ? '#fff' : '#000',
                    }}>
                    Favorite
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.customButton} onPress={async () => {
                 try {
                  const result = await Share.share({
                    message: `Visit ${sellerDetails.shop_name} on Shaloz, they have really cool and discounted products you might be interested in. shaloz://shop/${sellerDetails._id}`,
                    url: 'http://appstore.com/shaloz',
                    title: 'Download the Shaloz app and visit this shop ' + sellerDetails.shop_name,
                  });
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                      console.log(result.activityType);
            
                      // shared with activity type of result.activityType
                    } else {
                      // shared
                    }
                  } else if (result.action === Share.dismissedAction) {
                    // dismissed
                  }
                } catch (error) {
                  alert(error.message);
                }
              }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="md-share"
                    size={20}
                    style={{
                      marginRight: 10,
                      alignSelf: 'center',
                      marginLeft: 10,
                    }}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    Share
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    padding: 10,
    borderWidth: 1.6,
    borderRadius: 50,
  },
  container: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginRight: 10,
  },

  topHeader: {
    flexDirection: 'row',

    padding: 10,
  },
  customButton: {
    marginTop: 10,
    alignSelf: 'center',
    width: 120,
    padding: 8,
    borderWidth: 1.6,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default ShopHeader;
