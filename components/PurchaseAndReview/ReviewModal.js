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
import * as appActions from '../../store/actions/appActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';

const ReviewModal = (props) => {
  const dispatch = useDispatch();
  const {
    product_id,
    openReviewModal,
    setOpenReviewModal,
    product_name,
    viewToRender,
    shop_id,
    shop_name,
  } = props;
  const user = useSelector((state) => state.authReducer.user);
  const [reviewText, setReviewText] = useState('');
  const [reviewText_shop, setReviewText_shop] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [rateNumber, setRateNumber] = useState(5);
  const [rateNumber_shop, setRateNumber_shop] = useState(5);

  const submitReview = () => {
    appActions.reviewProduct(user._id, product_id, reviewText, rateNumber);
    setOpenReviewModal(false);
  };

  const submitReview_shop = () => {
    appActions.submitReview_shop(user._id, shop_id, reviewText_shop, rateNumber_shop);
    setOpenReviewModal(false);
  };

  const onStarRatingPress_shop = (rating) => {
    setRateNumber_shop(rating);
  };
  const onStarRatingPress = (rating) => {
    setRateNumber(rating);
  };

  let view;
  if (viewToRender === 'product') {
    view = (
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
                fontSize: 24,
                fontFamily: Fonts.poppins_semibold,
                alignSelf: 'center',
              }}>
              {product_name}
            </Text>
            <View
              style={{marginTop: 20, alignSelf: 'center', marginBottom: 15}}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rateNumber}
                selectedStar={(rating) => onStarRatingPress(rating)}
                fullStarColor={Colors.purple_darken}
              />
            </View>
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
                }}
                value={reviewText}
                onChangeText={(value) => setReviewText(value)}
                multiline={true}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity onPress={submitReview}>
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
                  Review
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  } else {
    view = (
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
                fontSize: 24,
                fontFamily: Fonts.poppins_semibold,
                alignSelf: 'center',
              }}>
              {shop_name}
            </Text>
            <View
              style={{marginTop: 20, alignSelf: 'center', marginBottom: 15}}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rateNumber_shop}
                selectedStar={(rating) => onStarRatingPress_shop(rating)}
                fullStarColor={Colors.purple_darken}
              />
            </View>
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
                }}
                value={reviewText_shop}
                onChangeText={(value) => setReviewText_shop(value)}
                multiline={true}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity onPress={submitReview_shop}>
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
                  Review
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <Modal animationType="slide" transparent={false} visible={openReviewModal}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableWithoutFeedback onPress={() => setOpenReviewModal(false)}>
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

export default ReviewModal;
