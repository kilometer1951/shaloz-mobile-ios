import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
  ActionSheetIOS,
  Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';

import * as authActions from '../store/actions/authActions';

import Svg, {Path, Rect} from 'react-native-svg';

const {height} = Dimensions.get('window');

const VisitMyShopView = (props) => {
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > height;
  onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  };
  return (
    <ScrollView
      onContentSizeChange={onContentSizeChange}
      scrollEnabled={scrollEnabled}>
      <Svg width="100%" height="600">
        <Rect x="0" y="0" width="100%" height="100%" fill="#fbe9e7" />
        <SafeAreaView>
          <View style={{padding: 20}}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              Your online shop is ready! You can start uploading your products.
            </Text>

            <View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-hammer" size={25} />
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginLeft: 10,
                      marginTop: 18,
                    }}>
                    Powerful tools. Our tools and services make it easy to
                    manage, promote and grow your business.
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-card" size={25} />
                  </View>
                </View>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginLeft: 10,
                      marginTop: 20,
                    }}>
                    Simple, transparent, secure. No additional monthly fees,
                    Secure transactions, Automatic deposits, Seller protection
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-cash" size={25} />
                  </View>
                </View>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginLeft: 10,
                      marginTop: 20,
                    }}>
                    5 % Transaction fee, 2.9% + $0.50 payment processing fee
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-timer" size={25} />
                  </View>
                </View>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginLeft: 10,
                      marginTop: 20,
                    }}>
                    Enlist your products for an unlimited duration
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-share-alt" size={25} />
                  </View>
                </View>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginLeft: 10,
                      marginTop: 20,
                    }}>
                    Go social by sharing your store and products
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Svg>
      <Svg height="100" width="100%">
        <Path
          d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
          stroke="none"
          fill="#fbe9e7"
        />
      </Svg>
      <TouchableWithoutFeedback onPress={props.done}>
        <View style={[{...styles.button}, {marginTop: 30}]}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              color: '#fff',
              alignSelf: 'center',
              fontSize: 20,
            }}>
            Visit my shop
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    width: '80%',
    borderRadius: 50,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  viewBorder: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default VisitMyShopView;
