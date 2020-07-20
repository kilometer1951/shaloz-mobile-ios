import {URL} from '../../socketURL';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

export const USER_INFO = 'USER_INFO';
export const CHANGE_SHOP_LOGO = 'CHANGE_SHOP_LOGO';
export const HANDLE_SHOP_NAME_SHOP_LOCATION_CAHNGE_SETTINGS = 'HANDLE_SHOP_NAME_SHOP_LOCATION_CAHNGE_SETTINGS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_SHOP_CATEGORY = 'UPDATE_SHOP_CATEGORY';


export const logout = (user) => {
  return async (dispatch) => {
    AsyncStorage.clear();
    dispatch({
      type: LOGOUT,
    });
  };
};



export const updateDetails = async (seller_id, first_name, last_name) => {
  //  return async dispatch => {
  const response = await fetch(`${URL}/api/update/stripe_details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seller_id,
      first_name,
      last_name,
    }),
  });
  const resData = await response.json();
  return resData;
};




export const changeShopLogo =  (photo, source, user_id) => {
  return async (dispatch) => {
    let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(`${URL}/api/upload_shop_image/${user_id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  dispatch({type:CHANGE_SHOP_LOGO,source:source })
  }
};



export const updateShopLocationShopNameSettings =  (data) => {
  return (dispatch) => {
  dispatch({type:HANDLE_SHOP_NAME_SHOP_LOCATION_CAHNGE_SETTINGS,payload:data })
  }
};






export const upload = async (photo) => {
  let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(`${URL}/api/test`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};


export const verifiyPhoneNumber = async (phone) => {
  //  return async dispatch => {
  const response = await fetch(`${URL}/api/verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const createAcctount = (first_name, last_name, phone, email,password) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/signup_buyer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        last_name,
        phone,
        email,
        password
      }),
    });
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    await AsyncStorage.setItem('@userData', JSON.stringify(resData.user));
    dispatch({
      type: USER_INFO,
      user: resData.user,
    });
  };
};

export const verifyUser = async (phone) => {
  const response = await fetch(`${URL}/api/verify_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone
    }),
  });

  const resData = await response.json();
  return resData;
};


export const loginUser = async (email, password) => {
  const response = await fetch(`${URL}/api/login_users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const dispatchUpdatedAccount = (user) => {
  return async (dispatch) => {
    dispatch({
      type: USER_INFO,
      user: user,
    });
  };
};

export const dispatchUser = (user) => {
  return async (dispatch) => {
    
    await AsyncStorage.setItem('@userData', JSON.stringify(user));
    dispatch({
      type: USER_INFO,
      user: user,
    });
  };
};


export const userInfo = (user_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/user_info/${user_id}`);
    const resData = await response.json();

    dispatch({
      type: USER_INFO,
      user: resData.user,
    });
  };
};

export const uploadShopPhoto = async (photo, user_id) => {
  let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(`${URL}/api/upload_shop_image/${user_id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const updateFrontID = async (photo, user_id) => {
  let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(`${URL}/api/upload_front_of_id/${user_id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const updateBackID = async (photo, user_id) => {
  let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(`${URL}/api/upload_back_of_id/${user_id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const updateShopLocation = async (
  locationState,
  locationCity,
  address,
  postalCode,
  user_id,
  shopName,
) => {
  const response = await fetch(`${URL}/api/update_shop_location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationState,
      locationCity,
      address,
      postalCode,
      user_id,
      shopName,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateSSN = async (ssn, user_id) => {
  const response = await fetch(`${URL}/api/update_ssn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ssn,
      user_id,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const createSellerStripeAccount = async (user_id) => {
  const response = await fetch(`${URL}/api/create_stripe_partner_account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const addStripeAccountBankingInfo = async (
  user_id,
  dob,
  bankAccountToken,
) => {
  const response = await fetch(`${URL}/api/add_bank_account_info/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      dob,
      bankAccountToken,
    }),
  });
  const resData = await response.json();
  return resData;
};



export const updateShopCategories = (selectedCategories, shop_id) => {
  return async dispatch => {
   
    const response = await fetch(`${URL}/api/update_shop_category/${shop_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedCategories
      }),
    });

    dispatch({
      type:UPDATE_SHOP_CATEGORY,
      payload:selectedCategories
    })

  }
};