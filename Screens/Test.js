import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
  ActionSheetIOS,
  Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';

import * as authActions from '../store/actions/authActions';
import * as appActions from '../store/actions/appActions';



const StepFour = (props) => {
 

  return (
    <View>
      <SafeAreaView>
        <View>
         
        </View>
      </SafeAreaView>
    </View>
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
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default StepFour;
