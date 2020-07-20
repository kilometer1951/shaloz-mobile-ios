import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import StarRating from 'react-native-star-rating';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import * as appActions from '../store/actions/appActions';
import NetworkError from '../components/NetworkError';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductReviewScreen = (props) => {
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [productData, setProductData] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const product_id = props.navigation.getParam('product_id');

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.fetchProductReviews(product_id, 1);
        setIsLoading(false);
        console.log(response);

        setProductData(response.data);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    fetchProductReviews();
  }, []);

  const handleLoadMore = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appActions.fetchProductReviews(product_id, page);
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
        await setProductData((prev) => [...prev, ...response.data]);
      }
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    const response = await appActions.fetchProductReviews(product_id, 1);
    if (!response.status) {
      //console.log('error parsing server');
      return;
    }
    //  console.log(response);
    setProductData(response.data);
    setIsRefreshing(false);
  };

  const renderItem = ({item}) => (
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
        <Text style={{fontSize: 14, fontFamily: Fonts.poppins_regular}}>
          {item.comment}
        </Text>
      </View>
    </View>
  );

  let view;

  if (productData.length === 0) {
    view = (
      <View>
        <View>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 20,
              textAlign: 'center',
              padding: 20,
            }}>
            No review(s) to show
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
          data={productData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          extraData={productData}
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
              {endOfFile && productData.length > 16 && (
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
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '25%'}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-arrow-back" size={25} />
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Back
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
              Reviews
            </Text>
          </View>
          <View style={{width: '25%'}}></View>
        </View>
      </SafeAreaView>
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
    marginTop: 15,
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

export default ProductReviewScreen;
