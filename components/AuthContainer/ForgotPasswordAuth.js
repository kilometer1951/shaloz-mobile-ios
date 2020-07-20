import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
  TextInput,
  TouchableOpacity,

  Alert,Linking
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {Card} from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

import * as appActions from '../../store/actions/appActions';
import * as authActions from '../../store/actions/authActions';
import Error from '../Error';
import NetworkError from '../NetworkError';

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const ForgotPasswordAuth = (props) => {
  const dispatch = useDispatch();
  const {setAuthViewToRender, authViewToRender, setIsNotAuthenticated} = props;
  const [viewToRender, setViewToRender] = useState('phoneNumber');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verification, setVerification] = useState('');
 
  const [resendActivityIndicator, setResendActivityIndicator] = useState(false);
  const [code, setCode] = useState('');
  const [errorPhone, setErrorPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorVerification, setErrorVerification] = useState('');
  const [handleUserData, setHandleUserData] = useState({})

  

  const [networkError, setNetworkError] = useState(false);

  const resendCode = async () => {
    try {
      setResendActivityIndicator(true);
      const response = await authActions.verifiyPhoneNumber(phoneNumber);
      setResendActivityIndicator(false);
      setErrorVerification(`Code sent to: ${phoneNumber}`);
      //if resData.status is true continue else return error
      if (!response.status) {
        Alert.alert(
            'Error handling phone number',
            ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
            {cancelable: false},
          );
          return;
      }
      setCode(response.code);
    } catch (e) {
      setResendActivityIndicator(false);
      setNetworkError(true);
    }
  };

  const handlePhoneNumber = (value) => {
    const formatted = value
      .replace(/[^\d]+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    setPhoneNumber(formatted);
  };

  const authButton_1 = async () => {
    try {
      if (phoneNumber !== '') {
        setIsLoading(true);
        const response = await authActions.verifyUser(phoneNumber);
        setIsLoading(false);
        if (!response.status) {
            Alert.alert(
                'Error handling phone number',
                ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
                {cancelable: false},
              );
              return;
        }
        //set user 
        setHandleUserData(response.user)
        setCode(response.code);
        setViewToRender('verification');
      }
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const authenticateUser = async () => {
    try {
      if (verification !== '') {
        if (verification != code) {
            Alert.alert(
                'Code is not valid',
                ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
                {cancelable: false},
              );
              return;
        }
        setIsLoading(true)
       await dispatch(appActions.fetchHomeProducts(handleUserData._id));
       dispatch(authActions.dispatchUser(handleUserData))
       setIsLoading(false)
       setIsNotAuthenticated(false);
      }
    } catch (e) {
        console.log(e);
        
      setNetworkError(true);
    }
  };

  

 
  
  let view;
  if (viewToRender === 'phoneNumber') {
    view = (
      <View style={{padding: 10}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_semibold,
          }}>
          Phone Number*
        </Text>
        <TextInput
          placeholder={'(312) 708-0122*'}
          style={{
            borderWidth: 1,
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            padding: 10,
            borderColor: Colors.light_grey,
            borderRadius: 5,
          }}
          value={phoneNumber}
          onChangeText={handlePhoneNumber}
          keyboardType="number-pad"
          autoFocus={true}
        />
        {errorPhone !== '' && <Error error={errorPhone} />}
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          We will send you a code to verify your phone number
        </Text>

        <TouchableOpacity
            style={{paddingHorizontal: 3, marginTop: 10}}
            onPress={() => {
                Linking.openURL(
                    'mailto:support@shaloz.com?cc=&subject=help&body=body',
                  );
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
             Having troubles? Contact support
            </Text>
          </TouchableOpacity>
        <View>
          {isLoading ? (
            <MaterialIndicator
              color={Colors.purple_darken}
              style={{
                paddingHorizontal: 10,
                marginTop: 50,
              }}
            />
          ) : (
            <TouchableOpacity
              disabled={phoneNumber === '' ? true : false}
              onPress={() => {
                authButton_1();
              }}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  padding: 15,
                  backgroundColor: Colors.purple_darken,
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  opacity: phoneNumber === '' ? 0.4 : 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 20,
                    alignSelf: 'center',
                    color: '#fff',
                  }}>
                  Next
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
      </View>
    );
  } else if (viewToRender === 'verification') {
    view = (
      <View style={{padding: 10}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_semibold,
          }}>
          Verification Code*
        </Text>
        <TextInput
          placeholder={'Enter Verification Code'}
          style={{
            borderWidth: 1,
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            padding: 10,
            borderColor: Colors.light_grey,
            borderRadius: 5,
          }}
          value={verification}
          onChangeText={(value) => setVerification(value)}
          keyboardType="number-pad"
          autoFocus={true}
        />
        {errorVerification !== '' && <Error error={errorVerification} />}

        <View style={{marginTop: 5}}>
          {resendActivityIndicator ? (
            <View style={{marginTop: 20, marginBottom: 20}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                }}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={resendCode}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 18,
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {isLoading ?  <MaterialIndicator
              color={Colors.purple_darken}
              style={{
                paddingHorizontal: 10,
                marginTop: 50,
              }}
            /> :  <View>
            <TouchableOpacity
              disabled={verification === '' ? true : false}
              onPress={() => {
                authenticateUser();
              }}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  padding: 15,
                  backgroundColor: Colors.purple_darken,
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  opacity: verification === '' ? 0.4 : 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 20,
                    alignSelf: 'center',
                    color: '#fff',
                  }}>
                  Next
                </Text>
                <Icon
                  name="ios-arrow-round-forward"
                  size={30}
                  style={{marginLeft: 10}}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>}
       
      </View>
    );
  } 
  return (
    <View style={{flex: 1}}>
     
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      {view}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ForgotPasswordAuth;
