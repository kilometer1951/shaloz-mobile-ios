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

const AuthViewTwo = (props) => {
  const dispatch = useDispatch();
  const {setAuthViewToRender, authViewToRender, setIsNotAuthenticated} = props;
  const [viewToRender, setViewToRender] = useState('phoneNumber');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verification, setVerification] = useState('');
  const [fName, setFname] = useState('');
  const [lName, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [viewNumber, setViewNumber] = useState('1');
  const [resendActivityIndicator, setResendActivityIndicator] = useState(false);
  const [code, setCode] = useState('');
  const [errorPhone, setErrorPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorVerification, setErrorVerification] = useState('');

  const [errorFname, setErrorFname] = useState('');
  const [errorLname, setErrorLname] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [password, setPassword] = useState('');

  const [networkError, setNetworkError] = useState(false);

  const resendCode = async () => {
    try {
      setResendActivityIndicator(true);
      const response = await authActions.verifiyPhoneNumber(phoneNumber);
      setResendActivityIndicator(false);
      setErrorVerification(`Code sent to: ${phoneNumber}`);

      //if resData.status is true continue else return error
      if (!response.status) {
        setErrorVerification(`Error handling phone number`);
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
        const response = await authActions.verifiyPhoneNumber(phoneNumber);
        setIsLoading(false);
        if (!response.status) {
          setErrorPhoneNumber('Error handling phone number');
          return;
        }
        setCode(response.code);
        setErrorPhoneNumber('');
        setViewNumber('2');
        setViewToRender('verification');
      }
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const authButton_2 = async () => {
    try {
      if (verification !== '') {
        if (verification != code) {
          setErrorVerification(`Code is not valid`);
          return;
        }
        setErrorVerification('');
        setViewNumber('3');
        setViewToRender('info');
      }
    } catch (e) {
      setNetworkError(true);
    }
  };

  const handleConfirm = async () => {
    try{
      setIsLoading(true);
    await dispatch(
      authActions.createAcctount(
        fName,
        lName,
        phoneNumber,
        email,
        password,
      ),
    );
    
    setIsLoading(false);
    setAuthViewToRender('sellerView');
    } catch(e) {
      setIsLoading(false)
      Alert.alert(
        'User exist',
        ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
        {cancelable: false},
      );
      
    }
  };

  const authButton_3 = async () => {
    try {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      if (fName === '') {
        setErrorFname('Please enter your legal first name');
        return;
      } else {
        setErrorFname('');
      }
      if (lName === '') {
        setErrorLname('Please enter your legal last name');
        return;
      } else {
        setErrorLname('');
      }
      if (email === '') {
        setErrorEmail('Please enter your email');
        return;
      } else if (!validateEmail(email)) {
        setErrorEmail('Email not valid');
        return;
      } else {
        setErrorEmail('');
      }

      if (password === '') {
        Alert.alert(
          'Please create a password',
          ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          {cancelable: false},
        );
        return;
      }

      handleConfirm();
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const backButton = () => {
    if (viewToRender === 'phoneNumber') {
      setAuthViewToRender('getStarted');
    }
    if (viewToRender === 'verification') {
      setViewNumber('1');
      setViewToRender('phoneNumber');
    }
    if (viewToRender === 'info') {
      setViewNumber('2');
      setViewToRender('verification');
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
        <View>
          <TouchableOpacity
            disabled={verification === '' ? true : false}
            onPress={() => {
              authButton_2();
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
        </View>
      </View>
    );
  } else {
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
            }}>
            What's your legal first name*
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              padding: 10,
              borderColor: Colors.light_grey,
              borderRadius: 5,
            }}
            value={fName}
            onChangeText={(value) => setFname(value)}
            autoFocus={true}
          />
          {errorFname !== '' && <Error error={errorFname} />}

          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 10,
            }}>
            What's your legal last name*
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              padding: 10,
              borderColor: Colors.light_grey,
              borderRadius: 5,
            }}
            value={lName}
            onChangeText={(value) => setLname(value)}
          />
          {errorLname !== '' && <Error error={errorLname} />}
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
            }}
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          {errorEmail !== '' && <Error error={errorEmail} />}

          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
              marginTop: 10,
            }}>
            Create your password*
          </Text>
          <TextInput
            placeholder={'create your password*'}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              padding: 10,
              borderColor: Colors.light_grey,
              borderRadius: 5,
              marginBottom:10
            }}
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
          />

       
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
                disabled={fName === '' || email === '' ? true : false}
                onPress={() => {
                  authButton_3();
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
                    opacity: fName === '' || email === '' ? 0.4 : 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_semibold,
                      fontSize: 20,
                      alignSelf: 'center',
                      color: '#fff',
                    }}>
                    Signup
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
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              {viewNumber}/3
            </Text>
          </View>
        </View>
      </SafeAreaView>
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

export default AuthViewTwo;
