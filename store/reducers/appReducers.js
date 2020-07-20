import AsyncStorage from '@react-native-community/async-storage';

import {
  VARIANT,
  DELETE_VARIANT,
  GET_MY_SHOP_PRODUCTS,
  HANDLE_LOAD_MORE_SHOP_PRODUCT,
  FETCH_HOME_DATA,
  CART_DATA,
  HANDLE_LOAD_MORE_FAV_PRODUCTS,
  HANDLE_LOAD_MORE__FAV_SHOP,
  FETCH_FAV_PRODUCTS,
  FETCH_FAV_SHOP,
  SELECTED_CART,
  CHECK_OUT_INFO,
  CARDS,
  SELECTED_CARD,
  HANDLE_LOAD_MORE_CART_DATA,
  HANDLE_LOAD_MORE_SHOP_ORDER_DATA,
  SHOP_ORDER_DATA,
  GET_EARNINGS,
  COMPLETED_ORDER_HISTORY_DATA,
  HANDLE_LOAD_MORE_COMPLETED_ORDER_HISTORY_DATA,
  SELLER_WEEKLY_ACTIVITY,
  HANDLE_LOAD_MORE_SELLER_WEEKLY_ACTIVITY,
  FETCH_PURCAHSED_PACKAGE,
  HANDLE_LOAD_MORE_FETCH_PURCAHSED_PACKAGE,
  OPEN_MESSAGE_MODAL,
  SELECTED_FOOTER_TAB,
  ADMIN_FETCH_PURCHASE_PACKAGE,
  LOAD_MORE_ADMIN_FETCH_PURCHASE_PACKAGE,
  HANDLE_UPDATE_CART_AFTER_PURCHASE,
  
} from '../actions/appActions';

const initialState = {
  variants: [],
  myShopProducts: [],
  fetched_home_data: [],
  endOfFile_shop_product: false,
  endOfFile_fav_product: false,
  endOfFile_fav_shop: false,
  endOfFile_cart_data: false,
  endOfFile_shop_orders: false,
  endOfFile_completed_orders: false,
  endOfFile_seller_weekly_activity: false,
  endOfFile_purchase_package: false,
  endOfFile_admin_purchased_packages: false,
  // open_message_modal: false,
  cart_data: [],
  fav_products_data: [],
  fav_shop_data: [],
  selected_cart: {},
  check_out_info: {},
  cards: [],
  card_id: '',
  shop_orders: [],
  earnings: {},
  completed_orders: [],
  seller_weekly_activity: [],
  purchased_orders: [],
  admin_purchase_packages: [],
  //   message_shop_name:"",
  // message_seller_id:""
  selected_footer_tab: 'home',
};
export default (state = initialState, action) => {
  switch (action.type) {
   

    case HANDLE_UPDATE_CART_AFTER_PURCHASE:
      const updated = state.cart_data.filter(
        (value) => value._id != action.payload,
      );

      return {
        ...state,
        cart_data: updated,
      };

    case LOAD_MORE_ADMIN_FETCH_PURCHASE_PACKAGE:
      return {
        ...state,
        admin_purchase_packages: [
          ...state.admin_purchase_packages,
          ...action.admin_purchase_packages,
        ],
        endOfFile_admin_purchased_packages:
          action.endOfFile_admin_purchased_packages,
      };
    case ADMIN_FETCH_PURCHASE_PACKAGE:
      return {
        ...state,
        admin_purchase_packages: action.admin_purchase_packages,
        endOfFile_admin_purchased_packages: false,
      };
    case SELECTED_FOOTER_TAB:
      return {
        ...state,
        selected_footer_tab: action.selected_footer_tab,
      };
    // case OPEN_MESSAGE_MODAL:
    //   return {
    //     ...state,
    //     open_message_modal: action.open_message_modal,
    //     message_seller_id: action.message_seller_id,
    //     message_shop_name: action.message_shop_name,
    //   };
    case HANDLE_LOAD_MORE_FETCH_PURCAHSED_PACKAGE:
      return {
        ...state,
        purchased_orders: [
          ...state.purchased_orders,
          ...action.purchased_orders,
        ],
        endOfFile_purchase_package: action.endOfFile_purchase_package,
      };
    case FETCH_PURCAHSED_PACKAGE:
      return {
        ...state,
        purchased_orders: action.purchased_orders,
        endOfFile_purchase_package: false,
      };
    case HANDLE_LOAD_MORE_SELLER_WEEKLY_ACTIVITY:
      return {
        ...state,
        seller_weekly_activity: [
          ...state.seller_weekly_activity,
          ...action.seller_weekly_activity,
        ],
        endOfFile_seller_weekly_activity:
          action.endOfFile_seller_weekly_activity,
      };
    case SELLER_WEEKLY_ACTIVITY:
      return {
        ...state,
        seller_weekly_activity: action.seller_weekly_activity,
        endOfFile_seller_weekly_activity: false,
      };
    case HANDLE_LOAD_MORE_COMPLETED_ORDER_HISTORY_DATA:
      return {
        ...state,
        completed_orders: [
          ...state.completed_orders,
          ...action.completed_orders,
        ],
        endOfFile_completed_orders: action.endOfFile_completed_orders,
      };
    case COMPLETED_ORDER_HISTORY_DATA:
      return {
        ...state,
        completed_orders: action.completed_orders,
        endOfFile_completed_orders: false,
      };
    case GET_EARNINGS:
      return {
        ...state,
        earnings: action.earnings,
      };
    case HANDLE_LOAD_MORE_SHOP_ORDER_DATA:
      return {
        ...state,
        shop_orders: [...state.shop_orders, ...action.shop_orders],
        endOfFile_shop_orders: action.endOfFile_shop_orders,
      };
    case SHOP_ORDER_DATA:
      return {
        ...state,
        shop_orders: action.shop_orders,
        endOfFile_shop_orders: false,
      };
    case SELECTED_CARD:
      return {
        ...state,
        card_id: action.card_id,
      };
    case CARDS:
      return {
        ...state,
        cards: action.cards,
      };
    case CHECK_OUT_INFO:
      return {
        ...state,
        check_out_info: action.check_out_info,
      };
    case SELECTED_CART:
      return {
        ...state,
        selected_cart: action.selected_cart,
      };
    case HANDLE_LOAD_MORE_CART_DATA:
      return {
        ...state,
        cart_data: [...state.cart_data, ...action.cart_data],
        endOfFile_cart_data: action.endOfFile_cart_data,
      };
    case HANDLE_LOAD_MORE__FAV_SHOP:
      return {
        ...state,
        fav_shop_data: [...state.fav_shop_data, ...action.fav_shop_data],
        endOfFile_fav_shop: action.endOfFile_fav_shop,
      };
    case HANDLE_LOAD_MORE_FAV_PRODUCTS:
      return {
        ...state,
        fav_products_data: [
          ...state.fav_products_data,
          ...action.fav_products_data,
        ],
        endOfFile_fav_product: action.endOfFile_fav_product,
      };
    case FETCH_FAV_PRODUCTS:
      return {
        ...state,
        fav_products_data: action.fav_products_data,
        endOfFile_fav_product: false,
      };
    case FETCH_FAV_SHOP:
      return {
        ...state,
        fav_shop_data: action.fav_shop_data,
        endOfFile_fav_shop: false,
      };
    case CART_DATA:
      return {
        ...state,
        cart_data: action.cart_data,
        endOfFile_cart_data: false,
      };
    case VARIANT:
      return {
        ...state,
        variants: action.variants,
      };
    case DELETE_VARIANT:
      const newData = state.variants.filter(
        (value) => value._id !== action.variant_id,
      );
      return {
        ...state,
        variants: newData,
      };

    case GET_MY_SHOP_PRODUCTS:
      return {
        ...state,
        myShopProducts: action.myShopProducts,
        endOfFile_shop_product: false,
      };
    case HANDLE_LOAD_MORE_SHOP_PRODUCT:
      return {
        ...state,
        endOfFile_shop_product: action.endOfFile_shop_product,
        myShopProducts: [...state.myShopProducts, ...action.myShopProducts],
      };

    case FETCH_HOME_DATA:
      return {
        ...state,
        fetched_home_data: action.fetched_home_data,
      };

    default:
      return state;
  }
  return state;
};
