import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../Screens/HomeScreen';
import SingleProductScreen from '../Screens/SingleProductScreen';
import ProductScreen from '../Screens/ProductScreen';
import SearchScreen from '../Screens/SearchScreen';
import FavoriteScreen from '../Screens/FavoriteScreen';
import DealsScreen from '../Screens/DealsScreen';
import CartScreen from '../Screens/CartScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import ShopsScreen from '../Screens/ShopsScreen';
import SearchShopScreen from '../Screens/SearchShopScreen';
import MyShopScreen from '../Screens/MyShopScreen';
import StartUpScreen from '../Screens/StartUpScreen';
import NewProductScreen from '../Screens/NewProductScreen';
import EditShopProductScreen from '../Screens/EditShopProductScreen';
import MyShopSearchScreen from '../Screens/MyShopSearchScreen';
import RecentlyViewedScreen from '../Screens/RecentlyViewedScreen';
import ProductCategoryScreen from '../Screens/ProductCategoryScreen';
import MyShopOrdersScreen from '../Screens/MyShopOrdersScreen';
import CompletedOrdersScreen from '../Screens/CompletedOrdersScreen';
import SellerWeeklyActivityScreen from '../Screens/SellerWeeklyActivityScreen';
import TrackPackageScreen from '../Screens/TrackPackageScreen';
import PurchaseAndReviewScreen from '../Screens/PurchaseAndReviewScreen';
import ProductReviewScreen from '../Screens/ProductReviewScreen';
import VideoAdScreen from '../Screens/VideoAdScreen';
import ChangeShopLogoScreen from '../Screens/ChangeShopLogoScreen';
import ShippingPromoScreen from '../Screens/ShippingPromoScreen';
import DiscountPromoScreen from '../Screens/DiscountPromoScreen';
import WebViewScreen from '../Screens/WebViewScreen';
import Test from '../Screens/Test';
import AdminScreen from '../Screens/AdminScreen';
import SellerShippingLocationScreen from '../Screens/SellerShippingLocationScreen';
import ShopsFilterScreen from '../Screens/ShopsFilterScreen';

const TabScreens = createBottomTabNavigator({
  Home: {screen: HomeScreen, navigationOptions: {tabBarVisible: false}},
  Favorite: {screen: FavoriteScreen, navigationOptions: {tabBarVisible: false}},
  VideoAd: {screen: VideoAdScreen, navigationOptions: {tabBarVisible: false}},
  Cart: {screen: CartScreen, navigationOptions: {tabBarVisible: false}},
  Profile: {screen: ProfileScreen, navigationOptions: {tabBarVisible: false}},
});

const AppNavigator = createStackNavigator(
  {
    Tabs: TabScreens,
    SingleProduct: SingleProductScreen,
    Product: ProductScreen,
    Search: SearchScreen,
    Deals: DealsScreen,
    Shops: ShopsScreen,
    SearchShop: SearchShopScreen,
    MyShop: MyShopScreen,
    NewProduct: NewProductScreen,
    EditShopProduct: EditShopProductScreen,
    MyShopSearch: MyShopSearchScreen,
    RecentlyViewed: RecentlyViewedScreen,
    ProductCategory: ProductCategoryScreen,
    MyShopOrders: MyShopOrdersScreen,
    CompletedOrders: CompletedOrdersScreen,
    SellerWeeklyActivity: SellerWeeklyActivityScreen,
    TrackPackage: TrackPackageScreen,
    PurchaseAndReview: PurchaseAndReviewScreen,
    ProductReview: ProductReviewScreen,
    ChangeShopLogo: ChangeShopLogoScreen,
    ShippingPromo: ShippingPromoScreen,
    DiscountPromo: DiscountPromoScreen,
    WebViewScreen: WebViewScreen,
    Admin: AdminScreen,
    SellerShippingLocation: SellerShippingLocationScreen,
    ShopsFilterScreen: ShopsFilterScreen,
  },
  {headerMode: 'none'},
);

const MainNavigator = createSwitchNavigator({
 // Test: Test,
  StartUpScreen: StartUpScreen,
  App: AppNavigator,
});

export default createAppContainer(MainNavigator);
