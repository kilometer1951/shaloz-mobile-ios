import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

import Svg, {Path, Rect} from 'react-native-svg';

const {height} = Dimensions.get('window');

import * as appActions from '../../store/actions/appActions';

const AuthViewOne = (props) => {
  const dispatch = useDispatch();
  const [screenHeight, setScreenHeight] = useState(0);
  const scrollEnabled = screenHeight > height;
  onContentSizeChange = (contentWidth, contentHeight) => {
    setScreenHeight(contentHeight);
  };
  const {setAuthViewToRender, authViewToRender} = props;

  return (
    <ScrollView
      onContentSizeChange={onContentSizeChange}
      scrollEnabled={scrollEnabled}>
      <Svg width="100%" height="590">
        <Rect x="0" y="0" width="100%" height="100%" fill="#fbe9e7" />
        <SafeAreaView>
          <View style={{padding: 20}}>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              Welcome to Shaloz, the world's most imaginative marketplace
            </Text>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-people" size={25} />
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginLeft: 10,
                      marginTop: 28,
                    }}>
                    A one-of-a-kind community
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-person" size={25} />
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
                    Independent sellers. Buy directly from someone who put their
                    heart and soul into making something special
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-nutrition" size={25} />
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
                    We have millions of one-of-a-kind items, so you can find
                    whatever you need
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
                    Secure shopping. We use best-in-class technology to protect
                    your transactions
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View>
                  <View style={styles.viewBorder}>
                    <Icon name="ios-apps" size={25} />
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
                    Build your store and let Shaloz handle the rest.
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
      <TouchableOpacity
        onPress={() => {
          setAuthViewToRender('auth');
        }}>
        <View style={[{...styles.button}, {marginTop: 20}]}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              color: '#fff',
              alignSelf: 'center',
              fontSize: 20,
            }}>
            Sign up
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setAuthViewToRender('login');
        }}>
        <View
          style={[
            {...styles.button},
            {backgroundColor: '#fff', marginTop: 20},
          ]}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              alignSelf: 'center',
              fontSize: 20,
            }}>
            I already have an account
          </Text>
        </View>
      </TouchableOpacity>
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

export default AuthViewOne;
