import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  
  FlatList,
  Modal,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {URL} from '../socketURL';
import NetInfo from '@react-native-community/netinfo';
import {DotIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import Footer from '../components/Footer';
import Video from 'react-native-video';
import ViewPager from '@react-native-community/viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import NetworkError from '../components/NetworkError';
import VideoAdPlaceHolder from '../components/VideoAdPlaceHolder';
//import UpdatingLoader from '../components/UpdatingLoader';

import * as appActions from '../store/actions/appActions';
import {TouchableOpacity} from 'react-native-gesture-handler';

const VideoAdScreen = (props) => {
  const dispatch = useDispatch();
  const [videoAd, setVideoAd] = useState([]);
  //const [renderVideoAd, setRenderVideoAd] = useState({});
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const [video_index, setVideo_index] = useState(0);

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [checkBox, setCheckbox] = useState();
  const [main_cat, setMain_cat] = useState('');
  const [done, setDone] = useState(false);

  const changeFilter = async () => {
    try {
      setIsLoading(true);
      const resData = await appActions.fetchVideoAdPerCategory(
        user._id,
        main_cat,
      );
      setIsLoading(false);
      setVideoAd(resData.data);
      setCategoryData(resData.mainCategory);
      setOpenCategoryModal(false);
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const selectCategory = (name, index) => {
    setCheckbox(index);
    setMain_cat(name);
    setDone(true);
  };

  const fetchVideoAd = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.fetchVideoAd(user._id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setCategoryData(response.mainCategory);

      setVideoAd(response.data);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  useEffect(() => {
    fetchVideoAd();
  }, []);
  const decreaseVideoIndex = () => {
    console.log(video_index);

    setVideo_index((prev) => {
      const newPrev = prev - 1;
      return newPrev;
    });
  };
  const getVideoAd = () => {
    if (video_index + 1 >= videoAd.length) {
      fetchVideoAd();
    } else {
      setVideo_index((prev) => {
        prev = +1;
        return prev;
      });
    }
  };

  let view;
  if (videoAd.length === 0) {
    view = (
      <View
        style={{alignSelf: 'center', marginTop: '60%', padding: 25, flex: 1}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 20,
            textAlign: 'center',
            padding: 20,
            color: '#fff',
          }}>
          No video ad to show
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <Video
          source={{uri: videoAd[video_index].video}}
          style={styles.video}
          onBuffer={() => {
            console.log('buff');
          }}
          onError={() => {
            console.log('error');
          }}
          paused={true}
          muted={false}
          repeat={true}
          resizeMode="contain"
        />
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            justifyContent: 'space-around',
            width: '100%',
          }}>
          {video_index !== 0 && (
            <View style={styles.buttons}>
              <TouchableOpacity onPress={decreaseVideoIndex}>
                <View style={{alignSelf: 'center', marginTop: 1}}>
                  <Icon name="ios-arrow-round-back" size={60} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity onPress={getVideoAd}>
              <View style={{alignSelf: 'center', marginTop: 1}}>
                <Icon name="ios-arrow-round-forward" size={60} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          zIndex: 1,
          justifyContent: 'center',
          width: '100%',
          marginTop: 50,
        }}>
        <TouchableOpacity onPress={() => setOpenCategoryModal(true)}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              color: '#fff',
              marginRight: 30,
            }}>
            Change filter
          </Text>
        </TouchableOpacity>
        {videoAd.length !== 0 && (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Shops', {
                headerTile: 'Shop',
                backTitle: 'Ad',
                seller_id: videoAd[video_index].seller,
              });
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
                color: '#fff',
              }}>
              Visit my shop
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {isLoading ? <VideoAdPlaceHolder /> : view}
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
                <TouchableOpacity onPress={changeFilter}>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        marginRight: 10,
                        fontFamily: Fonts.poppins_regular,
                        color: 'blue',
                      }}>
                      Update
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
        </View>
      </Modal>

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
      <Footer navigation={props.navigation} footerColor="trasparent" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  buttons: {
    borderRadius: 100,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    height: 65,
    width: 65,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    marginBottom: 30,
    marginLeft: 10,
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

export default VideoAdScreen;
