import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const EarningsHelpModal = props => {
  const onClose = () => {
    props.setOpenEarningsHelpModal(false);
  };

  return (
    <Modal
      style={styles.modal}
      isOpen={props.openEarningsHelpModal}
      position="bottom"
      onClosed={onClose}>
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onClose();
          }}>
          <View
            style={{
              alignItems: 'flex-end',
              paddingRight: 10,
            }}>
            <Icon
              name="ios-close-circle-outline"
              size={25}
              style={{marginBottom: 10, paddingTop: 10}}
              color="#000"
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
            textAlign: 'center',
            color: '#000',
          }}>
          Your first payout takes seven days to deposit. Your next payout will
          be on a daily basics. For any questions concerning payments and
          payouts, and other issues, you can reach us through the support
          section of the app located in settings.
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '30%',
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
});

export default EarningsHelpModal;
