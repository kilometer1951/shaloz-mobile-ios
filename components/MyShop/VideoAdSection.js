import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {DotIndicator} from 'react-native-indicators';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import Video from 'react-native-video';
import ViewPager from '@react-native-community/viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkError from '../NetworkError';
import UpdatingLoader from '../UpdatingLoader';
import ImagePicker from 'react-native-image-crop-picker';

import * as appActions from '../../store/actions/appActions';

const VideoAdSection = (props) => {
  const dispatch = useDispatch();
  const [videoAd, setVideoAd] = useState([]);
  //const [renderVideoAd, setRenderVideoAd] = useState({});
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [videoPreview, setVideoPreview] = useState({});
  const [isReview, setIsReview] = useState(false);
  const [done, setDone] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [video_ad_category, setVideo_ad_category] = useState('');
  const [videoData, setVideoData] = useState({});
  const [checkBox, setCheckbox] = useState();

  useEffect(() => {
    const fetchShopVideoAd = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fetchShopVideoAd(user._id);
        setIsLoading(false);
        if (!response.status) {
          setIsLoading(false);
          setNetworkError(true);
          return;
        }
        setCategoryData(response.mainCategory);
        if (response.data) {
          setVideoPreview({uri: response.data.video});
          setIsReview(response.data.active);
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchShopVideoAd();
  }, []);

  const upload = async () => {
    try {
      setIsLoading(true);
      const resData = await appActions.uploadVideoAd(
        videoData,
        video_ad_category,
        user._id,
      );
      setIsLoading(false);
      setReviewText('Your ad is under review');
      setVideoPreview({uri: resData.uri});
      setOpenCategoryModal(false);
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const browseVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(async (video) => {
        let data = {
          uri: video.sourceURL,
          type: video.mime,
          name: video.filename,
        };

        setVideoData(data);
        setOpenCategoryModal(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const selectCategory = (name, index) => {
    setCheckbox(index);
    setVideo_ad_category(name);
    setDone(true);
  };

  let text;
  if (isReview) {
    text = (
      <Text
        style={{
          fontSize: 20,
          fontFamily: Fonts.poppins_regular,
          textAlign: 'center',
          color: 'green',
          marginTop: 10,
        }}>
        Your ad is running.
      </Text>
    );
  } else {
    text = (
      <Text
        style={{
          fontSize: 20,
          fontFamily: Fonts.poppins_regular,
          textAlign: 'center',
          color: 'green',
          marginTop: 10,
        }}>
        Your ad is under review.
      </Text>
    );
  }

  return (
    <ScrollView>
      <View style={{padding: 20}}>
      
        {Object.entries(videoPreview).length !== 0 && text}
        <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            textAlign: 'center',
            color: 'green',
            marginTop: 10,
          }}>
          {reviewText}
        </Text>

        {Object.entries(videoPreview).length === 0 ? (
          <TouchableOpacity onPress={browseVideo.bind(this, 'video')}>
            <View style={styles.image}>
              <Icon
                name="md-videocam"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseVideo.bind(this, 'video')}>
            <View style={styles.changeImageButton}>
              <Icon
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>
            <Video
              source={videoPreview}
              style={styles.image}
              muted={true}
              repeat={true}
              resizeMode={'cover'}
              rate={1.0}
              onBuffer={() => {
                console.log('buff');
              }}
              onError={(e) => {
                console.log(e);
              }}
              onLoad={(load) => {
                console.log(parseInt(load.duration));
              }}
            />
          </TouchableOpacity>
        )}
          <Text
          style={{
            fontSize: 20,
            fontFamily: Fonts.poppins_regular,
            marginTop:30
          }}>
          Ad manager allows you to use videos to advertise your phyical store
          and products. We run your ads within the platform.
          Your ad is reivewed within 24hours before it starts running and its
          free. Maximum length of a video ad is 2:15 minute. If your video ad is
          longer than 2:15 minute, its not going to run. Your ad never stops running. To
          change your ad, simply upload a new video.
        </Text>

      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={openCategoryModal}
        style={{backgroundColor: '#fff'}}>
        <SafeAreaView>
          <View style={styles.header}>
            <View style={{width: '20%'}}>
              <TouchableOpacity onPress={() => setOpenCategoryModal(false)}>
                <View>
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
                  textAlign: 'center',
                }}>
                Select a category
              </Text>
            </View>
            <View style={{width: '20%'}}>
              {done && (
                <TouchableOpacity onPress={upload}>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        marginRight: 10,
                        fontFamily: Fonts.poppins_regular,
                        color: 'blue',
                      }}>
                      Done
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>

        <View style={{marginBottom: 10}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={categoryData}
            renderItem={({item, index}) => (
              <View
                style={{
                  padding: 10,
                  borderBottomColor: Colors.light_grey,
                  borderBottomWidth: 0.5,
                }}>
                <TouchableOpacity
                  onPress={selectCategory.bind(this, item.name, index)}>
                  <View style={{flexDirection: 'row'}}>
                    {checkBox === index && (
                      <Icon name="ios-checkmark" size={25} color="blue" />
                    )}
                    <Text
                      style={{
                        fontSize: 17,
                        marginLeft: 10,
                        fontFamily: Fonts.poppins_regular,
                        color: checkBox === index ? 'blue' : '#000',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item._id}
            style={{marginTop: 2, marginBottom: 100}}
          />
          {isLoading && <UpdatingLoader />}
        </View>
      </Modal>

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  video: {
    width: 210,
    height: 210,
  },
  changeImageButton: {
    position: 'absolute',
    zIndex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    width: '100%',
    marginLeft: '72%',
  },
  image: {
    width: 210,
    height: 210,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
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

export default VideoAdSection;
