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
import AsyncStorage from '@react-native-community/async-storage';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';
import StepSix from './StepSix';

import * as appAction from '../../store/actions/appActions';

//const {height} = Dimensions.get('window');

const StepMain = (props) => {
  const dispatch = useDispatch();

  const {
    setAuthViewToRender,
    authViewToRender,
    setIsNotAuthenticated,
    setUploadingData,
    location,
    setShopStatus,
  } = props;
  const [viewToRender, setViewToRender] = useState('step1');
  const [viewNumber, setViewNumber] = useState('1');
  const [imageSelected, setImageSelected] = useState({});
  const [imageSelectedPhotoID, setImageSelectedPhotoID] = useState({});
  const [imageSelectedPhotoID_back, setImageSelectedPhotoID_back] = useState(
    {},
  );
  const [shopName, setShopName] = useState('');
  const [ssn, setSsn] = useState('');

  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');

  const closeModal = async () => {
    const userData = await AsyncStorage.getItem('@userData');
    const parseUserData = userData !== null && (await JSON.parse(userData));

    if (parseUserData.shop_setup === 'complete') {
      setShopStatus('complete');
    }
    setIsNotAuthenticated(false);
  };

  let view;
  if (viewToRender === 'step1') {
    view = (
      <StepOne
        navigation={props.navigation}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        setViewToRender={setViewToRender}
        setViewNumber={setViewNumber}
        setUploadingData={setUploadingData}
        viewNumber={viewNumber}
        closeModal={closeModal}
      />
    );
  } else if (viewToRender === 'step2') {
    view = (
      <StepTwo
        navigation={props.navigation}
        shopName={shopName}
        setShopName={setShopName}
        setViewToRender={setViewToRender}
        setViewNumber={setViewNumber}
        viewNumber={viewNumber}
        closeModal={closeModal}
      />
    );
  } else if (viewToRender === 'step3') {
    view = (
      <StepThree
        navigation={props.navigation}
        ssn={ssn}
        setSsn={setSsn}
        setViewToRender={setViewToRender}
        setViewNumber={setViewNumber}
        viewNumber={viewNumber}
        closeModal={closeModal}
      />
    );
  } else if (viewToRender === 'step4') {
    view = (
      <StepFour
        navigation={props.navigation}
        imageSelectedPhotoID={imageSelectedPhotoID}
        setImageSelectedPhotoID={setImageSelectedPhotoID}
        setViewToRender={setViewToRender}
        setViewNumber={setViewNumber}
        viewNumber={viewNumber}
        closeModal={closeModal}
      />
    );
  } else if (viewToRender === 'step5') {
    view = (
      <StepFive
        navigation={props.navigation}
        imageSelectedPhotoID_back={imageSelectedPhotoID_back}
        setImageSelectedPhotoID_back={setImageSelectedPhotoID_back}
        setViewToRender={setViewToRender}
        setViewNumber={setViewNumber}
        viewNumber={viewNumber}
        closeModal={closeModal}
      />
    );
  } else {
    view = (
      <StepSix
        navigation={props.navigation}
        setConfirmAccountNumber={setConfirmAccountNumber}
        confirmAccountNumber={confirmAccountNumber}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        routingNumber={routingNumber}
        setRoutingNumber={setRoutingNumber}
        setViewToRender={setViewToRender}
        setViewNumber={setViewNumber}
        setIsNotAuthenticated={setIsNotAuthenticated}
        location={location}
        setShopStatus={setShopStatus}
        viewNumber={viewNumber}
        closeModal={closeModal}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff'}}>
     
      {view}
    </View>
  );
};

const styles = StyleSheet.create({});

export default StepMain;
