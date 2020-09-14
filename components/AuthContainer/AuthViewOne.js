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

import * as appActions from '../../store/actions/appActions';
import {Platform} from 'react-native';

/* */

const AuthViewOne = (props) => {
  const dispatch = useDispatch();

  const {setAuthViewToRender, authViewToRender} = props;

  return (
    <SafeAreaView>
      <View style={{padding: 15}}>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
          Welcome to Shaloz, the world's most imaginative marketplace
        </Text>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <View style={styles.viewBorder}>
                <Icon name="ios-trophy" size={25} style={{color: '#fff'}} />
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
                Earn points while you shop for the things you love.
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View>
              <View style={styles.viewBorder}>
                <Icon name="ios-people" size={25} style={{color: '#fff'}} />
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
                A one-of-a-kind community.
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <View style={styles.viewBorder}>
                <Icon name="ios-person" size={25} style={{color: '#fff'}} />
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
                heart and soul into making something special.
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <View style={styles.viewBorder}>
                <Icon name="ios-nutrition" size={25} style={{color: '#fff'}} />
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
                whatever you need.
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <View style={styles.viewBorder}>
                <Icon name="ios-card" size={25} style={{color: '#fff'}} />
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
                Secure shopping. We use best-in-class technology to protect your
                transactions.
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View>
              <View style={styles.viewBorder}>
                <Icon name="ios-apps" size={25} style={{color: '#fff'}} />
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
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default AuthViewOne;
