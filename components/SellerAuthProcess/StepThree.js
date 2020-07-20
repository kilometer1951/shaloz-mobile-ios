import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,TouchableOpacity
} from 'react-native';
import Error from '../Error';

import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';
import NetworkError from '../NetworkError';

import * as authActions from '../../store/actions/authActions';

//const {height} = Dimensions.get('window');

const StepThree = (props) => {
  const dispatch = useDispatch();
  const {setSsn, ssn, setViewToRender, setViewNumber,closeModal} = props;
  const [errorSSN, setErrorSSN] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [networkError, setNetworkError] = useState(false);

  const goToSection = async () => {
    try {
      if (ssn.length !== 9) {
        setErrorSSN('Social security number is invalid');
        setDialogVisible(false);
        return;
      }
      setIsLoading(true);
      const response = await authActions.updateSSN(ssn, user._id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        console.log('error handling request');
        return;
      }
      setErrorSSN('');
      setIsLoading(false);
      setViewNumber('4');
      setViewToRender('step4');
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  return (
    <View>
      {isLoading ? (
        <View style={{alignItems: 'center', marginTop: '40%'}}>
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{
              paddingHorizontal: 10,
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginTop: 15,
              marginTop: 40,
            }}>
            Saving and uploading please wait
          </Text>
        </View>
      ) : (
        <View style={{padding: 10}}>
          <SafeAreaView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={() => closeModal()}>
                <View>
                  <Icon name="ios-close" size={35} />
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 18,
                  marginTop: 5,
                }}>
                {props.viewNumber}/6
              </Text>
            </View>
          </SafeAreaView>
          <View style={{width: '100%'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppins_semibold,
                marginTop: 15,
              }}>
              What's your social security number
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
              value={ssn}
              onChangeText={(value) => setSsn(value)}
              autoFocus={true}
            />
            {errorSSN !== '' && (
              <Error error={errorSSN} moreStyles={{marginLeft: 4}} />
            )}
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              Your personal details are saved securly. We do not share your
              personal details with any third party vendor or merchant. By
              providing theShop with your social security number, you are
              allowing theShop to run a background check on you.
            </Text>
          </View>

          {ssn !== '' && (
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                goToSection();
              }}>
              <View style={styles.button}>
                <Icon name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          )}
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
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 100,
    backgroundColor: '#eeeeee',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: '10%',
  },
});

export default StepThree;
