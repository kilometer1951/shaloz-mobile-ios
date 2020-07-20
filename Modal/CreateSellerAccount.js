import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  
  TouchableOpacity,
  
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

import * as authActions from '../store/actions/authActions';
import Error from '../components/Error';

import StepMain from '../components/SellerAuthProcess/StepMain';
import {MaterialIndicator} from 'react-native-indicators';
import CreateSellerAccountMessage from '../components/CreateSellerAccountMessage'

const CreateSellerAccount = (props) => {
  const {isNotAuthenticated, setIsNotAuthenticated,setShopStatus} = props;
  const [viewToRender, setViewToRender] = useState('getstarted');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.authReducer.user);


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
      console.log(e);
      
      setIsLoading(false);
      setError(
        'Network error. Please click the get started button to try again.',
      );
    }
  };

  let view;
  if (viewToRender === 'getstarted') {
    view = (
      <View>
       
        {isLoading ? (
          <View style={{alignItems: 'center', marginTop: '40%',padding:20}}>
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
                textAlign: 'center',
              }}>
              Preparing your seller account this might take a minute
            </Text>
          </View>
        ) : (
          <View>
            {error !== '' &&  <View style={{marginTop:"30%"}}><Error error={error} /></View>}
            <CreateSellerAccountMessage getStarted={getStarted} closeModal={() => setIsNotAuthenticated(false)}/>

           
          
          </View>
        )}
      </View>
    );
  } 
   else {
    view = (
      <StepMain
        navigation={props.navigation}
        setIsNotAuthenticated={setIsNotAuthenticated}
        location="profilescreen"
        setShopStatus={setShopStatus}
      />
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isNotAuthenticated}
      style={{backgroundColor: '#fff'}}>
      {view}
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    height: 80,
    padding: 10,
  },

  search: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 0.5},
    elevation: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  panel: {
    flex: 1,
    position: 'relative',
  },
  panelHeader: {
    height: 80,
    backgroundColor: '#b197fc',
    justifyContent: 'flex-end',
    padding: 24,
  },
  textHeader: {
    fontSize: 28,
    color: '#FFF',
  },
});

export default CreateSellerAccount;
