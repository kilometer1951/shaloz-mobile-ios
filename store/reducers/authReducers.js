import AsyncStorage from '@react-native-community/async-storage';

import {
  USER_INFO,
  CHANGE_SHOP_LOGO,
  LOGOUT,
  HANDLE_SHOP_NAME_SHOP_LOCATION_CAHNGE_SETTINGS,UPDATE_SHOP_CATEGORY
} from '../actions/authActions';

const initialState = {
  user: {},
};
export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SHOP_CATEGORY:
      state.user.store_categories = action.payload;

      return {
        ...state,
        user: {...state.user},
      };
    case HANDLE_SHOP_NAME_SHOP_LOCATION_CAHNGE_SETTINGS:
      state.user.shop_address = action.payload.address;
      state.user.shop_location_city = action.payload.locationCity;
      state.user.shop_location_state = action.payload.locationState;
      state.user.shop_postal_code = action.payload.postalCode;
      state.user.shop_name = action.payload.shopName;

      return {
        ...state,
        user:{...state.user}
      };
    case CHANGE_SHOP_LOGO:
      state.user.shop_logo = action.source;
      return {
        ...state,
      };
    case USER_INFO:
      return {
        ...state,
        user: action.user,
      };
    case LOGOUT:
      return {
        ...state,
        user: {},
      };
    default:
      return state;
  }
  return state;
};
