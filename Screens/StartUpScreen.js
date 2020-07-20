import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import { useDispatch} from 'react-redux';
import {URL} from '../socketURL';
import NetInfo from '@react-native-community/netinfo';
import {DotIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import * as authActions from '../store/actions/authActions';

const StartUpScreen = (props) => {
  const dispatch = useDispatch();
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
//AsyncStorage.clear();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setNetworkError(false);
        const tryLogin = async () => {
          const userData = await AsyncStorage.getItem('@userData');
          if (!userData) {
            props.navigation.navigate('App');
            return;
          }
          const parseUserData =
            userData !== null && (await JSON.parse(userData));
          //dispatch
          
          await dispatch(authActions.userInfo(parseUserData._id));
           props.navigation.navigate('App');
        };
        tryLogin();
      } else {
        setNetworkError(true);
      }
    });
  }, []);

  return (
    <View style={styles.screen}>
      {networkError && (
        <Text
          style={{
            position: 'absolute',
            top: 70,
            fontFamily: Fonts.poppins_regular,
            zIndex: 1,
          }}>
          Network error please check your network
        </Text>
      )}
      <View style={styles.screen}>
       <Image source={require('../assets/logo1.png')} resizeMode="contain" style={{width:350}}/>
      </View>
      <View style={{bottom: 40, flexDirection: 'row'}}>
        <View style={{height: 20}}>
          <DotIndicator
            color="#fff"
            size={10}
            style={{marginTop: 15}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#fff",
  },
});

export default StartUpScreen;
