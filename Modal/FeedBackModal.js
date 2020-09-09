import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../store/actions/appActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating';
import {Toast} from 'native-base';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import NetworkError from '../components/NetworkError';

const FeedBackModal = (props) => {
  const dispatch = useDispatch();
  const {openFeedBackModal, setOpenFeedbackModal} = props;
  const user = useSelector((state) => state.authReducer.user);
  const [content, setContent] = useState('');
  const [feedBackAppSection, setFeedBackAppSection] = useState('all');
  const [networkError, setNetworkError] = useState(false);

  const submitFeedback = () => {
    if (content !== '') {
      appActions.submitFeedback(user._id, feedBackAppSection, content);
      Toast.show({
        text: 'Thanks ' + user.first_name + '!',
        buttonText: 'Okay',
        position: 'top',
      });
      setContent('');
      setOpenFeedbackModal(false);
    }
  };

  let view = (
    <KeyboardAwareScrollView
      scrollEnabled={true}
      enableAutomaticScroll={true}
      extraHeight={300}
      keyboardShouldPersistTaps="always">
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <View style={{padding: 10}}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.poppins_semibold,
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            We value your feedback and all feedback is reviewed to make Shaloz
            better.
          </Text>

          <View>
            <TextInput
              style={{
                borderWidth: 1,
                fontSize: 20,
                fontFamily: Fonts.poppins_regular,
                padding: 10,
                borderColor: Colors.light_grey,
                borderRadius: 5,
                height: 200,
                color: '#000',
              }}
              value={content}
              onChangeText={(value) => setContent(value)}
              multiline={true}
              autoFocus={true}
            />
          </View>
          <TouchableOpacity onPress={submitFeedback}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 15,
                backgroundColor: Colors.purple_darken,
                marginTop: 10,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 20,
                  alignSelf: 'center',
                  color: '#fff',
                }}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openFeedBackModal}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableWithoutFeedback
              onPress={() => setOpenFeedbackModal(false)}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 17,
                  fontFamily: Fonts.poppins_regular,
                }}>
                Close
              </Text>
            </TouchableWithoutFeedback>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light_grey,
    flexDirection: 'row',
  },
  card: {
    marginBottom: 15,
    padding: 10,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    shadowColor: Colors.grey_darken,
    marginTop: 5,
    borderRadius: 5,
  },
});

export default FeedBackModal;
