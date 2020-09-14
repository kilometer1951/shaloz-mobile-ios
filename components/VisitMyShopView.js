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

//import Svg, {Path, Rect} from 'react-native-svg';

//const {height} = Dimensions.get('window');

const VisitMyShopView = (props) => {
  const [height, setHeight] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  const scrollEnabled = viewHeight > height;
  onContentSizeChange = (contentWidth, contentHeight) => {
    setViewHeight(contentHeight);
  };
  return (
    <View
      style={{
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View
        style={{height: '90%'}}
        onLayout={(event) => {
          setHeight(event.nativeEvent.layout.height);
        }}>
        <SafeAreaView>
          <ScrollView
            onContentSizeChange={onContentSizeChange}
            scrollEnabled={scrollEnabled}>
            <View style={{padding: 10}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                }}>
                Your online shop is ready! You can start uploading your
                products.
              </Text>

              <View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '12%'}}>
                    <View style={styles.viewBorder}>
                      <Icon
                        name="ios-hammer"
                        size={25}
                        style={{color: '#fff'}}
                      />
                    </View>
                  </View>
                  <View style={{width: '88%'}}>
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
                  <View style={{width: '12%'}}>
                    <View style={styles.viewBorder}>
                      <Icon name="ios-card" size={25} style={{color: '#fff'}} />
                    </View>
                  </View>
                  <View style={{width: '88%'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 17,
                        marginLeft: 10,
                        marginTop: 20,
                      }}>
                      Simple, transparent, no additional monthly fees, Secure
                      transactions, Automatic deposits and Seller protection.
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '12%'}}>
                    <View style={styles.viewBorder}>
                      <Icon name="ios-cash" size={25} style={{color: '#fff'}} />
                    </View>
                  </View>
                  <View style={{width: '88%'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 17,
                        marginLeft: 10,
                        marginTop: 20,
                      }}>
                      5 % Transaction fee, 2.9% + $0.50 payment processing fee.
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '12%'}}>
                    <View style={styles.viewBorder}>
                      <Icon
                        name="ios-timer"
                        size={25}
                        style={{color: '#fff'}}
                      />
                    </View>
                  </View>
                  <View style={{width: '88%'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 17,
                        marginLeft: 10,
                        marginTop: 20,
                      }}>
                      Enlist your products for an unlimited duration.
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '12%'}}>
                    <View style={styles.viewBorder}>
                      <Icon
                        name="ios-timer"
                        size={25}
                        style={{color: '#fff'}}
                      />
                    </View>
                  </View>
                  <View style={{width: '88%'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 17,
                        marginLeft: 10,
                        marginTop: 20,
                      }}>
                      Spend less time managing your shop and more time on the
                      fun stuff.
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{width: '12%'}}>
                    <View style={styles.viewBorder}>
                      <Icon
                        name="ios-share-alt"
                        size={25}
                        style={{color: '#fff'}}
                      />
                    </View>
                  </View>
                  <View style={{width: '88%'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 17,
                        marginLeft: 10,
                        marginTop: 20,
                      }}>
                      Go social by sharing your store and products.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>

      <View>
        <TouchableWithoutFeedback onPress={props.done}>
          <View style={[{...styles.button}, {marginTop: 10, marginBottom: 20}]}>
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
      </View>
    </View>
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
    backgroundColor: Colors.purple_darken,

    borderRadius: 50,
    paddingLeft: 10,

    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default VisitMyShopView;
