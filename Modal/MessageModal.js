import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
 
  TextInput,
  TouchableOpacity,
  
  Modal,
  ScrollView,
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import * as appActions from '../store/actions/appActions';
import {URL} from '../socketURL';

import io from 'socket.io-client';

//const {height} = Dimensions.get('window');

const MessageModal = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const open_message_modal = useSelector(
    (state) => state.appReducer.open_message_modal,
  );
  const message_shop_name = useSelector(
    (state) => state.appReducer.message_shop_name,
  );
  const message_seller_id = useSelector(
    (state) => state.appReducer.message_seller_id,
  );
  const [messageTextInput, setMessageTextInput] = useState('');

  const socket = io(URL);

  const alphabet_order = (str) => {
    return str.split('').sort().join('');
  };

  let room = alphabet_order(user._id + '/' + message_seller_id);

    //listen to event from server
    // socket.on('connect', function () {
    //   console.log('yea! User Connected');
    //   //join users
    //   socket.emit('join', room, function () {
    //     console.log('User has joined');
    //   });
    // });

//   const sendMessage = () => {
//     socket.emit('createMessage', {
//       message: messageTextInput,
//       from: user._id,
//       to: message_seller_id,
//       room: room,
//     });
//     setMessageTextInput('');
//   };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={open_message_modal}
      style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity
              onPress={() =>
                dispatch(appActions.openMessageModal(false, '', ''))
              }>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
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
                textAlign: 'center',
              }}>
              New message
            </Text>
          </View>
          <View style={{width: '20%'}}>
            {messageTextInput !== '' && (
              <TouchableOpacity onPress={sendMessage}>
                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontSize: 17,
                      marginRight: 10,
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    Send
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
      <View style={{paddingLeft: 10, paddingTop: 10}}>
        <View
          style={{
            borderBottomColor: Colors.light_grey,
            borderBottomWidth: 0.5,
            paddingBottom: 10,
          }}>
          <Text
            style={{
              fontSize: 17,
              marginRight: 10,
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
            }}>
            {message_shop_name}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 17,
            marginRight: 10,
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
            color: Colors.grey_darken,
            marginTop: 10,
          }}>
          Message
        </Text>
      </View>
      <ScrollView>
        <TextInput
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            padding: 10,
            borderColor: Colors.light_grey,
            borderRadius: 5,
            maxHeight: 350,
          }}
          value={messageTextInput}
          onChangeText={(value) => setMessageTextInput(value)}
          multiline={true}
          autoFocus={true}
        />
      </ScrollView>
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

export default MessageModal;
