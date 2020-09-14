import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

import Modal from 'react-native-modalbox';

const ToolTip = (props) => {
  const dispatch = useDispatch();
  const {
    textToRender,
    setTextToRender,
    toolTipVisible,
    setToolTipVisible,
  } = props;
  const user = useSelector((state) => state.authReducer.user);

  const onClose = () => {
    setTextToRender('');
    setToolTipVisible(false);
  };

  return (
    <Modal
      style={styles.modal}
      position={'bottom'}
      isOpen={toolTipVisible}
      onClosed={onClose}>
      <View
        style={{
          width: 100,
          height: 5,
          backgroundColor: '#bdbdbd',
          alignSelf: 'center',
          borderRadius: 20,
        }}
      />
      <View
        style={{
          marginTop: 20,
        }}>
        <View>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              marginLeft: 15,
            }}>
            {textToRender}
          </Text>
        </View>
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

export default ToolTip;
