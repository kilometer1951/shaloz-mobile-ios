import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {Card} from 'react-native-elements';
import ForgotPasswordAuth from './ForgotPasswordAuth';

import * as authActions from '../../store/actions/authActions';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const LoginAuth = (props) => {
  const dispatch = useDispatch();
  const {setAuthViewToRender, authViewToRender, setIsNotAuthenticated} = props;
  const [viewToRender, setViewToRender] = useState('login');
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [errorEmail, setErrorEmail] = useState('');
  const [password, setPassword] = useState('');

  const [networkError, setNetworkError] = useState(false);

  const login = async () => {
    try {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });

      if (email === '') {
        Alert.alert(
          'Please enter your email',
          ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          {cancelable: false},
        );
        return;
        return;
      } else if (!validateEmail(email)) {
        Alert.alert(
          'Email not valid',
          ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          {cancelable: false},
        );
        return;
      }

      if (password === '') {
        Alert.alert(
          'Please create a password',
          ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          {cancelable: false},
        );
        return;
      }

      setIsLoading(true);
      const response = await authActions.loginUser(email, password);

      if (!response.status) {
        setIsLoading(false);
        if (response.message === 'user not found') {
          Alert.alert(
            'Error',
            'Incorrect email or password',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: true},
          );
          return;
        }
      } else {
        await dispatch(appActions.fetchHomeProducts(response.user._id));
        await dispatch(appActions.fetchCartData(response.user._id, 1));
        await dispatch(authActions.dispatchUser(response.user));
        setIsLoading(false);
        setIsNotAuthenticated(false);
      }

      //authenticate user
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const backButton = () => {
    if (viewToRender === 'login') {
      setAuthViewToRender('getStarted');
    } else {
      setViewToRender('login');
    }
  };

  let view;
  if (viewToRender === 'login') {
    view = (
      <KeyboardAwareScrollView
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={300}
        keyboardShouldPersistTaps="always">
        <ScrollView
          style={{padding: 10}}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 10,
            }}>
            What's your email*
          </Text>
          <TextInput
            placeholder={'your email*'}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              padding: 10,
              borderColor: Colors.light_grey,
              borderRadius: 5,
              color: '#000',
            }}
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholderTextColor="#bdbdbd"
          />

          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 10,
            }}>
            What's your password*
          </Text>
          <TextInput
            placeholder={"what's your password"}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              padding: 10,
              borderColor: Colors.light_grey,
              borderRadius: 5,
              color: '#000',
            }}
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
            placeholderTextColor="#bdbdbd"
          />

          <TouchableOpacity
            style={{paddingHorizontal: 3, marginTop: 10}}
            onPress={() => {
              setViewToRender('forgot_password');
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              Forgot your password?
            </Text>
          </TouchableOpacity>

          <View>
            {isLoading ? (
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
              />
            ) : (
              <TouchableOpacity
                disabled={email === '' || password === '' ? true : false}
                onPress={() => {
                  login();
                }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    padding: 15,
                    backgroundColor: Colors.purple_darken,
                    borderRadius: 5,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    opacity: email === '' || password === '' ? 0.4 : 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_semibold,
                      fontSize: 20,
                      alignSelf: 'center',
                      color: '#fff',
                    }}>
                    Log in
                  </Text>
                  <Icon
                    name="ios-arrow-round-forward"
                    size={30}
                    style={{marginLeft: 10}}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  } else {
    view = <ForgotPasswordAuth setIsNotAuthenticated={setIsNotAuthenticated} />;
  }
  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => backButton()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Back
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {view}
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
});

export default LoginAuth;
