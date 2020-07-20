import {URL} from '../../socketURL';
import Moment from 'moment';

export const VARIANT = 'VARIANT';
export const DELETE_VARIANT = 'DELETE_VARIANT';
export const DELETE_VARIANT_CONTENT = 'DELETE_VARIANT_CONTENT';
export const GET_MY_SHOP_PRODUCTS = 'GET_MY_SHOP_PRODUCTS';
export const HANDLE_LOAD_MORE_SHOP_PRODUCT = 'HANDLE_LOAD_MORE_SHOP_PRODUCT';

export const HANDLE_LOAD_MORE_FAV_PRODUCTS = 'HANDLE_LOAD_MORE_FAV_PRODUCTS';
export const HANDLE_LOAD_MORE__FAV_SHOP = 'HANDLE_LOAD_MORE__FAV_SHOP';
export const HANDLE_LOAD_MORE_CART_DATA = 'HANDLE_LOAD_MORE_CART_DATA';
export const HANDLE_LOAD_MORE_SHOP_ORDER_DATA =
  'HANDLE_LOAD_MORE_SHOP_ORDER_DATA';
export const HANDLE_LOAD_MORE_COMPLETED_ORDER_HISTORY_DATA =
  'HANDLE_LOAD_MORE_COMPLETED_ORDER_HISTORY_DATA';

export const FETCH_FAV_PRODUCTS = 'FETCH_FAV_PRODUCTS';
export const FETCH_FAV_SHOP = 'FETCH_FAV_SHOP';

export const FETCH_HOME_DATA = 'FETCH_HOME_DATA';

export const CART_DATA = 'CART_DATA';
export const SELECTED_CART = 'SELECTED_CART';


export const CHECK_OUT_INFO = 'CHECK_OUT_INFO';
export const CARDS = 'CARDS';
export const SELECTED_CARD = 'SELECTED_CARD';
export const HANDLE_UPDATE_CART_AFTER_PURCHASE =
  'HANDLE_UPDATE_CART_AFTER_PURCHASE';

export const SHOP_ORDER_DATA = 'SHOP_ORDER_DATA';
export const COMPLETED_ORDER_HISTORY_DATA = 'COMPLETED_ORDER_HISTORY_DATA';

export const SELLER_WEEKLY_ACTIVITY = 'SELLER_WEEKLY_ACTIVITY';
export const HANDLE_LOAD_MORE_SELLER_WEEKLY_ACTIVITY =
  'HANDLE_LOAD_MORE_SELLER_WEEKLY_ACTIVITY';

export const FETCH_PURCAHSED_PACKAGE = 'FECH_PURCAHSED_PACKAGE';
export const HANDLE_LOAD_MORE_FETCH_PURCAHSED_PACKAGE =
  'HANDLE_LOAD_MORE_FETCH_PURCAHSED_PACKAGE';

export const GET_EARNINGS = 'GET_EARNINGS';
export const OPEN_MESSAGE_MODAL = 'OPEN_MESSAGE_MODAL';

export const SELECTED_FOOTER_TAB = 'SELECTED_FOOTER_TAB';

export const ADMIN_FETCH_PURCHASE_PACKAGE = 'ADMIN_FETCH_PURCHASE_PACKAGE';
export const LOAD_MORE_ADMIN_FETCH_PURCHASE_PACKAGE =
  'LOAD_MORE_ADMIN_FETCH_PURCHASE_PACKAGE';

export const updateCartItemPrice = async (cart_id, user_id, item_id) => {
  const response = await fetch(`${URL}/api/update_cart_item_price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cart_id,
      user_id,
      item_id,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const handleAddToStockWithQty = async (product_id, product_qty) => {
  const response = await fetch(`${URL}/api/edit/add_to_stock_with_qty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id,
      product_qty,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const handleAddToStockWithOutQty = async (product_id) => {
  const response = await fetch(`${URL}/api/edit/add_to_stock_without_qty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const removeFromStock = async (product_id) => {
  const response = await fetch(`${URL}/api/edit/remove_from_stock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const adminPaySeller = async (cart_id) => {
  const response = await fetch(`${URL}/api/add/pay_seller`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cart_id,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const adminFetchPurchasedPackages = (page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/admin/fetch_purcahsed_package?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: ADMIN_FETCH_PURCHASE_PACKAGE,
      admin_purchase_packages: resData.data,
    });
  };
};

export const handleLoadMoreAdminFetchPurchasedPackages = (page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/admin/fetch_purcahsed_package?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: LOAD_MORE_ADMIN_FETCH_PURCHASE_PACKAGE,
      admin_purchase_packages: resData.data,
      endOfFile_admin_purchased_packages: resData.endOfFile ? true : false,
    });
  };
};

export const checkStripeDocuments = async (seller_id) => {
  const response = await fetch(
    `${URL}/api/view/check_stripe_document/${seller_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const SelectedFooterTab = (selected_footer_tab) => {
  return async (dispatch) => {
    dispatch({
      type: SELECTED_FOOTER_TAB,
      selected_footer_tab: selected_footer_tab,
    });
  };
};

export const fetchPromo = async (shop_id) => {
  const response = await fetch(`${URL}/api/view/fetch_promo/${shop_id}`);
  const resData = await response.json();
  return resData;
};

export const updateDiscountPromo = async (
  shop_id,
  offers_discount_on_price_threshold,
  max_items_to_get_discount,
  discount_amount_for_threshold,
) => {
  const response = await fetch(`${URL}/api/add/discount_promo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shop_id,
      offers_discount_on_price_threshold,
      max_items_to_get_discount,
      discount_amount_for_threshold,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateShippingPromo = async (
  shop_id,
  offers_free_shipping,
  price_threshold,
) => {
  const response = await fetch(`${URL}/api/add/shipping_promo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shop_id,
      offers_free_shipping,
      price_threshold,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const openMessageModal = (
  boolean,
  message_shop_name,
  message_seller_id,
) => {
  return async (dispatch) => {
    dispatch({
      type: OPEN_MESSAGE_MODAL,
      open_message_modal: boolean,
      message_shop_name: message_shop_name,
      message_seller_id: message_seller_id,
    });
  };
};

export const fetchShopAboutMe = async (seller_id) => {
  const response = await fetch(
    `${URL}/api/view/fetch_shop_about_me/${seller_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchVideoAdPerCategory = async (user_id, main_cat) => {
  const response = await fetch(
    `${URL}/api/view/fetch_video_ad_per_cat/${user_id}/${main_cat}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchShopVideoAd = async (user_id) => {
  const response = await fetch(
    `${URL}/api/view/fetch_user_video_ad/${user_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const uploadVideoAd = async (photo, video_ad_category, user_id) => {
  let formData = new FormData();
  formData.append('photo', photo);
  const response = await fetch(
    `${URL}/api/upload_video_ad/${user_id}/${video_ad_category}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    },
  );
  const resData = await response.json();
  return resData;
};

export const fetchVideoAd = async (user_id) => {
  const response = await fetch(`${URL}/api/view/fetch_video_ad/${user_id}`);
  const resData = await response.json();
  return resData;
};

export const fetchShopReviews = async (shop_id, page) => {
  const response = await fetch(
    `${URL}/api/view/fetch_shop_review/${shop_id}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchProductReviews = async (product_id, page) => {
  const response = await fetch(
    `${URL}/api/view/fetch_product_review/${product_id}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const submitReview_shop = async (
  user_id,
  shop_id,
  comment,
  rateNumber,
) => {
  const response = await fetch(`${URL}/api/add/review_shop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      shop_id,
      comment,
      rateNumber,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const reviewProduct = async (
  user_id,
  product_id,
  comment,
  rateNumber,
) => {
  const response = await fetch(`${URL}/api/add/review_product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      product_id,
      comment,
      rateNumber,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const trackPackage = async (tracking_number) => {
  const response = await fetch(
    `${URL}/api/view/track_package_progress/${tracking_number}`,
  );
  const resData = await response.json();
  return resData;
};

export const handleLoadMorePurchaseOrders = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/fetch_purchased_package/${user_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_FETCH_PURCAHSED_PACKAGE,
      purchased_orders: resData.data,
      endOfFile_purchase_package: resData.endOfFile ? true : false,
    });
  };
};

export const fetchPurchasedPackage = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/fetch_purchased_package/${user_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: FETCH_PURCAHSED_PACKAGE,
      purchased_orders: resData.data,
    });
  };
};

export const handleLoadMoreSellerWeeklyActivity = (
  seller_id,
  page,
  start_of_week,
  end_of_week,
) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/seller_weekly_activity/${seller_id}/${start_of_week}/${end_of_week}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_SELLER_WEEKLY_ACTIVITY,
      seller_weekly_activity: resData.weeklyActivity,
      endOfFile_seller_weekly_activity: resData.endOfFile ? true : false,
    });
  };
};

export const fetchSellerWeeklyActivity = (
  seller_id,
  page,
  start_of_week,
  end_of_week,
) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/seller_weekly_activity/${seller_id}/${start_of_week}/${end_of_week}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: SELLER_WEEKLY_ACTIVITY,
      seller_weekly_activity: resData.weeklyActivity,
    });
  };
};

export const handleLoadMoreCompletedOrderData = (seller_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/completed_orders_history/${seller_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_COMPLETED_ORDER_HISTORY_DATA,
      completed_orders: resData.orders,
      endOfFile_completed_orders: resData.endOfFile ? true : false,
    });
  };
};

export const fetchCompletedOrderData = (seller_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/completed_orders_history/${seller_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: COMPLETED_ORDER_HISTORY_DATA,
      completed_orders: resData.orders,
      endOfFile_completed_orders: false,
    });
  };
};

export const getEarnings = (seller_id, start_of_week, end_of_week) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/get_earnings/${seller_id}/${start_of_week}/${end_of_week}`,
    );
    const resData = await response.json();
    dispatch({type: GET_EARNINGS, earnings: resData.earnings});
  };
};

export const updateTrackingNumber = async (cart_id, tracking_number) => {
  const response = await fetch(`${URL}/api/add/update_tracking_number`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cart_id,
      tracking_number,
    }),
  });
  const resData = await response.json();

  return resData;
};

export const fetchShopOrderData = (seller_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/orders/${seller_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: SHOP_ORDER_DATA,
      shop_orders: resData.orders,
    });
  };
};

export const handleLoadMoreShopOrderData = (seller_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/orders/${seller_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_SHOP_ORDER_DATA,
      shop_orders: resData.orders,
      endOfFile_shop_orders: resData.endOfFile ? true : false,
    });
  };
};

export const addToCart = (data) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/add/to_cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
      }),
    });
    const resData = await response.json();

    // dispatch({
    //   type: CART_DATA,
    //   cart_data: resData.cartData,
    // });
  };
};

export const selectedCart = (selected_cart) => {
  return async (dispatch) => {
    dispatch({
      type: SELECTED_CART,
      selected_cart: selected_cart,
    });
  };
};

export const fetchCartData = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/cart/${user_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: CART_DATA,
      cart_data: resData.cartData,
    });
  };
};

export const handleLoadMoreCartData = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/cart/${user_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_CART_DATA,
      cart_data: resData.cartData,
      endOfFile_cart_data: resData.endOfFile ? true : false,
    });
  };
};

export const getProductOptions = (user_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/view/variant/${user_id}`);
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: VARIANT,
      variants: resData.data,
    });
  };
};

export const getMyShopProducts = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/my_shop_product/${user_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: GET_MY_SHOP_PRODUCTS,
      myShopProducts: resData.my_shop_product,
    });
  };
};

export const handleLoadMoreShopProducts = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/my_shop_product/${user_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_SHOP_PRODUCT,
      myShopProducts: resData.my_shop_product,
      endOfFile_shop_product: resData.endOfFile ? true : false,
    });
  };
};

export const addVariant = async (name, user_id) => {
  const response = await fetch(`${URL}/api/add/variant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      user_id,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const addOptionContent = async (variant_id, content, content_price) => {
  const response = await fetch(`${URL}/api/add/variant_content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant_id,
      content,
      content_price,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const editOptionName = async (variant_id, name) => {
  const response = await fetch(`${URL}/api/edit/variant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant_id,
      name,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const deleteVariant = (variant_id) => {
  return async (dispatch) => {
    fetch(`${URL}/api/delete/variant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id,
      }),
    });
    dispatch({
      type: DELETE_VARIANT,
      variant_id: variant_id,
    });
  };
};

export const deleteVariantContent = async (variant_id, variant_content_id) => {
  const response = await fetch(`${URL}/api/delete/variant_content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant_id,
      variant_content_id,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const editOptionContent = async (
  variant_id,
  variant_content_id,
  content,
  content_price,
) => {
  const response = await fetch(`${URL}/api/edit/variant_content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant_id,
      variant_content_id,
      content,
      content_price,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const getMainCategory = async () => {
  const response = await fetch(`${URL}/api/admin/view/main_category`);
  const resData = await response.json();
  return resData;
};

export const getMainCategoryId = async (main_category_name, sub_category1) => {
  const response = await fetch(
    `${URL}/api/admin/view/main_category/${main_category_name}/${sub_category1}`,
  );
  const resData = await response.json();
  return resData;
};

export const getSubCategoryOne = async (mainCategory_id) => {
  const response = await fetch(
    `${URL}/api/admin/view/sub_category_one/${mainCategory_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const getSubCategoryTwo = async (sub_category1_id) => {
  const response = await fetch(
    `${URL}/api/admin/view/sub_category_two/${sub_category1_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const editUplaodDetails = async (_data) => {
  const response = await fetch(`${URL}/api/edit/product_details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _data,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const saveUplaodDetails = async (_data) => {
  const response = await fetch(`${URL}/api/add/product_details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _data,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const searchShopProduct = (user_id, value) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/search/my_shop_product/${user_id}/${value}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: GET_MY_SHOP_PRODUCTS,
      myShopProducts: resData.my_shop_product,
    });
  };
};

export const saveUplaodMainImage = async (
  main_image_data,
  product_id,
  user_id,
) => {
  let formData = new FormData();
  formData.append('main_image_data', main_image_data);
  const response = await fetch(
    `${URL}/api/add/product_main_image/${product_id}/${user_id}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    },
  );
  const resData = await response.json();
  return resData;
};

export const saveUplaodSubImageOne = async (sub_image_1_data, product_id) => {
  let formData = new FormData();
  formData.append('sub_image_1_data', sub_image_1_data);
  const response = await fetch(
    `${URL}/api/add/product_sub_image_one/${product_id}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    },
  );
  const resData = await response.json();
  return resData;
};

export const saveUplaodSubImageTwo = async (sub_image_2_data, product_id) => {
  let formData = new FormData();
  formData.append('sub_image_2_data', sub_image_2_data);
  const response = await fetch(
    `${URL}/api/add/product_sub_image_two/${product_id}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    },
  );
  const resData = await response.json();
  return resData;
};

export const saveUplaodSubImageThree = async (sub_image_3_data, product_id) => {
  let formData = new FormData();
  formData.append('sub_image_3_data', sub_image_3_data);
  const response = await fetch(
    `${URL}/api/add/product_sub_image_three/${product_id}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    },
  );
  const resData = await response.json();
  return resData;
};

export const fetchHomeProducts = (user_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/view/home_products/${user_id}`);
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({
      type: FETCH_HOME_DATA,
      fetched_home_data: resData.data,
    });
  };
};

export const fetchRecentlyViewed = async (user_id, page) => {
  const response = await fetch(
    `${URL}/api/view/recently_viewed/${user_id}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchDeals = async (user_id, page) => {
  const response = await fetch(`${URL}/api/view/deals/${user_id}?page=${page}`);
  const resData = await response.json();
  return resData;
};

export const fetchProduct_all = async (user_id, page) => {
  const response = await fetch(
    `${URL}/api/view/product_all/${user_id}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchSingleProduct = async (product_id, user_id) => {
  const response = await fetch(
    `${URL}/api/view/fetch_single_product/${product_id}/${user_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchShopsProduct = async (seller_id, page) => {
  const response = await fetch(
    `${URL}/api/view/shops_product/${seller_id}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchShopsDeals = async (seller_id, page) => {
  const response = await fetch(
    `${URL}/api/view/shops_deals/${seller_id}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const checkShopFav = async (user_id, seller_id) => {
  const response = await fetch(
    `${URL}/api/view/check_fav_shop_exist/${user_id}/${seller_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const addFavProduct = (user_id, product_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/add/fav_product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        product_id,
      }),
    });

    const resData = await response.json();
    dispatch({
      type: FETCH_FAV_PRODUCTS,
      fav_products_data: resData.data,
    });
  };
};

export const removeFavProduct = (user_id, product_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/remove/fav_product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        product_id,
      }),
    });

    const resData = await response.json();
    dispatch({
      type: FETCH_FAV_PRODUCTS,
      fav_products_data: resData.data,
    });
  };
};

export const addFavShop = (user_id, seller_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/add/fav_shop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        seller_id,
      }),
    });

    const resData = await response.json();
    dispatch({
      type: FETCH_FAV_SHOP,
      fav_shop_data: resData.data,
    });
  };
};

export const removeFavShop = (user_id, seller_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/remove/fav_shop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        seller_id,
      }),
    });

    const resData = await response.json();
    dispatch({
      type: FETCH_FAV_SHOP,
      fav_shop_data: resData.data,
    });
  };
};

export const fetchFavProducts = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/fav_products/${user_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({
      type: FETCH_FAV_PRODUCTS,
      fav_products_data: resData.data,
    });
  };
};

export const fetchFavShop = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/fav_shop/${user_id}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({
      type: FETCH_FAV_SHOP,
      fav_shop_data: resData.data,
    });
  };
};

export const handleLoadMoreFavProducts = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/fav_products/${user_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({
      type: HANDLE_LOAD_MORE_FAV_PRODUCTS,
      fav_products_data: resData.data,
      endOfFile_fav_product: resData.endOfFile ? true : false,
    });
  };
};

export const handleLoadMoreFavShop = (user_id, page) => {
  return async (dispatch) => {
    const response = await fetch(
      `${URL}/api/view/fav_shop/${user_id}?page=${page}`,
    );
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE__FAV_SHOP,
      fav_shop_data: resData.data,
      endOfFile_fav_shop: resData.endOfFile ? true : false,
    });
  };
};

export const fetchRandomSellerShopProducts = async (seller_id) => {
  const response = await fetch(
    `${URL}/api/view/display_random_cat_seller_shop/${seller_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const dynamicSearchSellerProducts = async (seller_id, value) => {
  const response = await fetch(
    `${URL}/api/search/dynamic_search_seller_shop/${seller_id}/${value}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchRandomCategoryShop = async (user_id) => {
  const response = await fetch(
    `${URL}/api/view/display_random_cat_shop/${user_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const dynamicSearchAllProducts = async (user_id, value) => {
  const response = await fetch(
    `${URL}/api/dynamic_search/product/${user_id}/${value}`,
  );
  const resData = await response.json();
  return resData;
};

export const fechProductByCategory = async (
  user_id,
  main_cat,
  sub_cat_one,
  sub_cat_two,
  page,
) => {
  const response = await fetch(`${URL}/api/view/query_products_by_category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      main_cat,
      sub_cat_one,
      sub_cat_two,
      page,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const cartProductVariant = async (product_id) => {
  const response = await fetch(
    `${URL}/api/view/cart_product_variant/${product_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const updateCartQty = async (user_id, qty, cart_id, item_id) => {
  const response = await fetch(`${URL}/api/update/update_cart_qty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      qty,
      cart_id,
      item_id,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const updateCartVariants = async (
  user_id,
  newVariant,
  cart_id,
  item_id,
) => {
  const response = await fetch(`${URL}/api/update/update_cart_variants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      newVariant,
      cart_id,
      item_id,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const updateCartProductPersonlizationText = async (
  user_id,
  product_personalization_note,
  cart_id,
  item_id,
) => {
  const response = await fetch(
    `${URL}/api/update/update_cart_personilization_note`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        product_personalization_note,
        cart_id,
        item_id,
      }),
    },
  );

  const resData = await response.json();
  return resData;
};

export const removeCartItem = async (user_id, cart_id, item_id) => {
  const response = await fetch(`${URL}/api/delete/delete_cart_item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      cart_id,
      item_id,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const removeCart = async (user_id, cart_id) => {
  const response = await fetch(`${URL}/api/delete/delete_cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      cart_id,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const shippingDetails = async (user_id) => {
  const response = await fetch(`${URL}/api/view/shipping_details/${user_id}`);
  const resData = await response.json();
  return resData;
};

export const validateAddress = async (data) => {
  const response = await fetch(`${URL}/api/validate_address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const updateAddress = (data) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/update_shipping_address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
      }),
    });
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({
      type: CHECK_OUT_INFO,
      check_out_info: resData.data,
    });
  };
};

export const fetchUsersCards = (user_id) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/view/cards/${user_id}`);
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: CARDS,
      cards: resData.cards,
    });
  };
};

export const addCard = (user_id, tokenId) => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/api/add/add_card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        tokenId,
      }),
    });
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({
      type: SELECTED_CARD,
      card_id: resData.card_id,
    });
  };
};

export const selectCard = (card_id) => {
  return async (dispatch) => {
    dispatch({
      type: SELECTED_CARD,
      card_id: card_id,
    });
  };
};

export const getShippingRate = async (user_id, seller_id, total_qty, unit) => {
  const response = await fetch(
    `${URL}/api/view/get_shipping_rate/${user_id}/${seller_id}/${total_qty}/${unit}`,
  );
  const resData = await response.json();
  if (!resData.status) {
    throw new Error(false);
  }
  return resData;
};

export const checkOutAndPay = async (
  user_id,
  cart_id,
  card_id,
  sub_total,
  shippment_price,
  tax,
  processing_fee,
  total,
  discount,
) => {
  const response = await fetch(`${URL}/api/add/checkout_pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      cart_id,
      card_id,
      sub_total,
      shippment_price,
      tax,
      processing_fee,
      total,
      discount,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const fetchSellerWeeklyGraphData = async (
  seller_id,
  start_of_week,
  end_of_week,
) => {
  const response = await fetch(
    `${URL}/api/view/fetchSellerWeeklyGraphData/${seller_id}/${start_of_week}/${end_of_week}`,
  );
  const resData = await response.json();
  return resData;
};

export const fetchShopCategories = async (shop_id) => {
  const response = await fetch(
    `${URL}/api/shop/fetch_shop_categories/${shop_id}`,
  );
  const resData = await response.json();
  return resData;
};

export const applyShopFilter = async (shop_id, main_cat, page) => {
  const response = await fetch(
    `${URL}/api/view/apply_shop_filter/${shop_id}/${main_cat}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};

export const updateCartAfterPurchase = (cart_id) => {
  return async (dispatch) => {
    dispatch({
      type: HANDLE_UPDATE_CART_AFTER_PURCHASE,
      payload: cart_id,
    });
  };
};


export const fetchCategoryForSelection = async () => {
  const response = await fetch(
    `${URL}/api/admin/view/main_category`,
  );
  const resData = await response.json();
  return resData;
};



export const updateLastActivity = (user_id) => {
    fetch(`${URL}/api/update_user_last_activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id
      }),
    });
};