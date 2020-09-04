import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import StarRating from 'react-native-star-rating';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-view';
import FastImage from 'react-native-fast-image';

const ShopReviews = (props) => {
  const {seller_id} = props;
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);

  useEffect(() => {
    const fetchShopReviews = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fetchShopReviews(seller_id, 1);
        setIsLoading(false);

        setShopData(response.data);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchShopReviews();
  }, []);

  const handleLoadMore = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appActions.fetchShopReviews(seller_id, page);
        setIsLoadingMoreData(false);
        //  console.log(response.images.length);
        if (!response.status) {
          console.log('error parsing server');
          return;
        }
        if (response.endOfFile) {
          setEndOfFile(true);
          return;
        }
        //  console.log(page);
        setPage((prev) => (prev = prev + 1));
        await setShopData((prev) => [...prev, ...response.data]);
      }
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    const response = await appActions.fetchShopReviews(seller_id, 1);
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    setShopData(response.data);
    setIsRefreshing(false);
  };

  const imageViewData = (product) => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{padding: 10, flexDirection: 'row'}}>
          <TouchableOpacity>
            <View style={{width: 80, height: 80, marginRight: 10}}>
              <TouchableWithoutFeedback>
                <FastImage
                  source={{
                    uri: product.main_image,
                    priority: FastImage.priority.high,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
          {product.sub_image_1 !== '' && (
            <TouchableOpacity>
              <View style={{width: 80, height: 80, marginRight: 10}}>
                <TouchableWithoutFeedback>
                  <FastImage
                    source={{
                      uri: product.sub_image_1,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          )}

          {product.sub_image_2 !== '' && (
            <TouchableOpacity>
              <View style={{width: 80, height: 80, marginRight: 10}}>
                <TouchableWithoutFeedback>
                  <FastImage
                    source={{
                      uri: product.sub_image_2,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          )}

          {product.sub_image_3 !== '' && (
            <TouchableOpacity>
              <View style={{width: 80, height: 80, marginRight: 10}}>
                <TouchableWithoutFeedback>
                  <FastImage
                    source={{
                      uri: product.sub_image_3,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback>
      <View>
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: 14, fontFamily: Fonts.poppins_semibold}}>
                {item.user.first_name}
              </Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 14, fontFamily: Fonts.poppins_light}}>
              {Moment(new Date(item.dateReviewed)).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
        <View style={{}}>
          <View style={{width: 80}}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={item.rateNumber}
              fullStarColor="#000"
              starSize={14}
              starStyle={{marginTop: 5, marginRight: 1}}
            />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.poppins_semibold,
              textDecorationLine: 'underline',
            }}>
            {item.product.product_name}
          </Text>
          <Text style={{fontSize: 14, fontFamily: Fonts.poppins_regular}}>
            {item.comment}
          </Text>
          {imageViewData(item.product)}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  let view;

  if (shopData.length === 0) {
    view = (
      <View>
        <View>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              textAlign: 'center',
              padding: 20,
              marginTop: '30%',
            }}>
            No review(s) to show.
          </Text>
        </View>
      </View>
    );
  } else {
    view = (
      <View style={{padding: 15, flex: 1}}>
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
              title="Pull to refresh"
              tintColor="#000"
              titleColor="#000"
            />
          }
          showsVerticalScrollIndicator={false}
          data={shopData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          extraData={shopData}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          onMomentumScrollBegin={() => {
            handleLoadMore();
          }}
          ListFooterComponent={
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                alignSelf: 'center',
              }}>
              {isLoadingMoreData && (
                <MaterialIndicator color={Colors.purple_darken} size={30} />
              )}
              {endOfFile && shopData.length > 16 && (
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    color: Colors.grey_darken,
                  }}>
                  No more data to load
                </Text>
              )}
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {!isLoading ? (
        <View style={{flex: 1}}>{view}</View>
      ) : (
        <View style={{marginTop: 100}}>
          <MaterialIndicator color={Colors.purple_darken} />
        </View>
      )}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    padding: 10,
    borderWidth: 1.6,
    borderRadius: 50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
  },
  headerRow: {
    width: '50%',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topHeaderRow_1: {
    flexDirection: 'row',
    width: '60%',
    padding: 10,
  },
  topHeaderRow_2: {
    flexDirection: 'row',
    width: '38%',
  },
});

export default ShopReviews;
