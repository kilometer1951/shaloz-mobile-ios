import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,

  TouchableOpacity,
  
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {Card} from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Error from '../Error';
import * as authActions from '../../store/actions/authActions';
import StepMain from '../SellerAuthProcess/StepMain';
import {MaterialIndicator} from 'react-native-indicators';

import CreateSellerAccountMessage from '../CreateSellerAccountMessage'

//const {height} = Dimensions.get('window');

const AuthViewThree = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const {setAuthViewToRender, authViewToRender, setIsNotAuthenticated} = props;
  const [viewToRender, setViewToRender] = useState('intro');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setIsNotAuthenticated(false);
  };

  const getStarted = async () => {
    try {
      setIsLoading(true);
      const response = await authActions.createSellerStripeAccount(user._id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setError(
          'Network error. Please click the get started button to try again.',
        );
        return;
      }
     setViewToRender('createSellerAccount');
    } catch (e) {
      setIsLoading(false);
      setError(
        'Network error. Please click the get started button to try again.',
      );
    }
  };

  let view;
  if (viewToRender === 'intro') {
    view = (
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
                textAlign:'center'
              }}>
              Preparing your seller account this might take a minute
            </Text>
          </View>
        ) : (
          <View>
           {error !== '' &&  <View style={{marginTop:"30%"}}><Error error={error} /></View>}
            <CreateSellerAccountMessage getStarted={getStarted} closeModal={closeModal}/>
           
          </View>
        )}
      </View>
    );
  } else {
    view = (
      <StepMain
        navigation={props.navigation}
        setIsNotAuthenticated={setIsNotAuthenticated}
        location="authscreen"
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff'}}>{view}</View>
  );
};

const styles = StyleSheet.create({});

export default AuthViewThree;
