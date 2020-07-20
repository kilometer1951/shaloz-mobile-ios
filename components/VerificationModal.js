import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
  Modal,
  Linking,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import * as authActions from '../store/actions/authActions';
import Loader from '../components/Loader';
import NetworkError from '../components/NetworkError';
import VerificationPhotoFront from './VerificationPhotoFront';
import VerificationPhotoBack from './VerificationPhotoBack';

const VerificationModal = (props) => {
  const dispatch = useDispatch();
  const {
    open_verification_modal,
    setOpen_verification_modal,
    setDocumentVerification,
  } = props;
  const user = useSelector((state) => state.authReducer.user);
  const [fName, setFname] = useState('');
  const [lName, setLname] = useState('');
  const [savingLoader, setSavingLoader] = useState(false);
  const [viewToRender, setViewToRender] = useState('details');
  const [networkError, setNetworkError] = useState(false);

  const [imageSelectedPhotoID, setImageSelectedPhotoID] = useState({});
  const [frontImageObject, setFrontImageObject] = useState({});

  const [backImageObject, setBackImageObject] = useState({});
  const [imageSelectedPhotoID_back, setImageSelectedPhotoID_back] = useState(
    {},
  );

  const handleDetails = async () => {
    try {
      if (fName === '') {
        Alert.alert(
          'First name required',
          ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          {cancelable: false},
        );
        return;
      }
      if (lName === '') {
        Alert.alert(
          'Last name required',
          ''[{text: 'Ok', onPress: () => console.log('Cancel Pressed!')}],
          {cancelable: false},
        );
        return;
      }

      setSavingLoader(true);
      const response = await authActions.updateDetails(user._id, fName, lName);
      setSavingLoader(false);
      setViewToRender('photo_front');
    } catch (e) {
      setSavingLoader(false);
      setNetworkError(true);
    }
  };

  const uploadFront = async () => {
    try {
      setSavingLoader(true);
      await authActions.updateFrontID(frontImageObject, user._id);
      setSavingLoader(false);
      setViewToRender('photo_back');
    } catch (e) {
      setSavingLoader(false);
      setNetworkError(true);
    }
  };

  const uploadBack = async () => {
    try {
      setSavingLoader(true);
      await authActions.updateBackID(backImageObject, user._id);
      setSavingLoader(false);
      setViewToRender('details');
      setDocumentVerification(true);
      setOpen_verification_modal(false);
    } catch (e) {
      setSavingLoader(false);
      setNetworkError(true);
    }
  };

  const saveDetails = async () => {
    if (viewToRender === 'details') {
      handleDetails();
    } else if (viewToRender === 'photo_front') {
      uploadFront();
    } else {
      uploadBack();
    }
  };

  let view;
  if (viewToRender === 'details') {
    view = (
      <View style={{padding: 10}}>
        <View>
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
        </View>
        <View style={{marginTop: 20}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_semibold,
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
            autoFocus={true}
          />
        </View>
      </View>
    );
  } else if (viewToRender === 'photo_front') {
    view = (
      <View style={{padding: 10}}>
        <VerificationPhotoFront
          imageSelectedPhotoID={imageSelectedPhotoID}
          setImageSelectedPhotoID={setImageSelectedPhotoID}
          frontImageObject={frontImageObject}
          setFrontImageObject={setFrontImageObject}
        />
      </View>
    );
  } else {
    view = (
      <View style={{padding: 10}}>
        <VerificationPhotoBack
          backImageObject={backImageObject}
          setBackImageObject={setBackImageObject}
          imageSelectedPhotoID_back={imageSelectedPhotoID_back}
          setImageSelectedPhotoID_back={setImageSelectedPhotoID_back}
        />
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={open_verification_modal}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={() => setOpen_verification_modal(false)}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: 'red',
                  }}>
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Verification
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={saveDetails}>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontSize: 17,
                    marginRight: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: 'blue',
                  }}>
                  {viewToRender === 'details' || viewToRender === 'photo_front'
                    ? 'Save'
                    : 'Done'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {view}
      {savingLoader && <Loader />}
      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
    backgroundColor: '#fff',
  },
  headerRow: {
    width: '60%',
  },
});

export default VerificationModal;
