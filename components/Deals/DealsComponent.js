import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  
  FlatList,
  RefreshControl,

} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import {MaterialIndicator} from 'react-native-indicators';
import NetworkError from '../NetworkError';
import * as appActions from '../../store/actions/appActions';
import {ActionSheet} from "native-base"
import Toast from 'react-native-root-toast';

import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import UpdateMessage from '../UpdateMessage';

import ProductDesignComponent from '../ProductDesignComponent';

const DealsComponent = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [openUpdateMessage, setOpenUpdateMessage] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const [networkError, setNetworkError] = useState(false);

  const {
    deals,
    handleRefresh,
    handleLoadMoreDeals,
    isRefreshing,
    isLoadingMoreData,
    endOfFile,
  } = props;

  const visitShop = (seller_id) => {
    props.navigation.navigate('Shops', {
      headerTile: 'Shop',
      backTitle: 'Deals',
      seller_id:seller_id
    })
  }

  

  const openActionSheet = (product_id,seller_id) =>
  ActionSheet.show(
      {
        options: ['Cancel', 'Visit shop', 'Add to favorite'],
        cancelButtonIndex: 0,
        tintColor: '#000',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          visitShop(seller_id)
         //console.log(seller);
         
        } else if (buttonIndex === 2) {
          try{
            dispatch(appActions.addFavProduct(user._id,product_id));
            Toast.show('Added to favorites', {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
          })


          } catch(e) {
            console.log(e);
            setNetworkError(true)
          }
        }
      },
    );

  const openSingleScreen = (product_id) => {
    props.navigation.navigate('SingleProduct', {product_id:product_id});

  };

  const renderItem = ({item}) => (
    <View style={{width: '48%', marginHorizontal: 3}}>
      <ProductDesignComponent
        openSingleScreen={openSingleScreen.bind(this, item._id)}
        discount={item.discount}
        main_image={item.main_image}
        product_name={item.product_name}
        openActionSheet={openActionSheet.bind(this,item._id, item.user)}
        product_price={item.product_price}

      />
    </View>
  );

  return (
    <View style={styles.screen}>
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
        data={deals}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom:20}}
        numColumns={2}
        extraData={deals}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
        onMomentumScrollBegin={() => {
          handleLoadMoreDeals();
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
            {endOfFile && deals.length > 16 && (
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  color: Colors.grey_darken,
                }}>
                No more deals to load
              </Text>
            )}
          </View>
        }
      />
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
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    flexWrap: 'wrap',
  },
  productCard: {
    width: '47%',
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    height: 275,
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
    marginHorizontal: 8,
  },
  discountContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    marginTop: 5,
    marginLeft: 5,
    padding: 2,
    borderRadius: 5,
    opacity: 0.7,
  },
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: 5,
    fontFamily: Fonts.poppins_regular,
  },
});

export default DealsComponent;
