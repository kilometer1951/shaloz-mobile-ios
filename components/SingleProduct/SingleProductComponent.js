import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Keyboard,
  Linking,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-view';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import StarRating from 'react-native-star-rating';
import ViewPager from '@react-native-community/viewpager';
import DisplayReviews from '../DisplayReviews';
import HorizontalProductSection from './HorizontalProductSection';
import OtherItems from './OtherItems';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import OptionModal from './OptionModal';
import * as appActions from '../../store/actions/appActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SingleProductComponent = (props) => {
  const dispatch = useDispatch();

  const {
    addToCart,
    isAddedToCard,
    animatedPress,
    animateOut,
    productData,
    productReviews,
    navigation,
    recentViewed,
    otherProducts,
    rateNumber,
    setRateNumber,
    initialPage,
    setInitialPage,
    itemDetails,
    setItemDetails,
    shippingPolicies,
    setShippingPolicies,
    bounces,
    setBounces,
    isVisible,
    setIsVisible,
    previewData,
    setPreviewData,
    previewModal,
    setPreviewModal,
    qty,
    setQty,
    optionModalView,
    setOptionModalView,
    variant,
    setVariant,
    openOptionModal,
    setOpenOptionModal,
    selectedVariantContent,
    setSelectedVariantContent,
    customization_note,
    setCustomization_note,
    moreItemsFromShop,
    variantsBorderColor,
    _price,
    addingToCart,
    pressAction,
    setNewQty,
    newQty,
    reviewCount,setVariantsBorderColor
  } = props;

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + ' . . .' : this;
    };

  const handleImagePreivew = (path) => {
    const img = [
      {
        source: {
          uri: path,
        },
      },
    ];
    setPreviewData((prev) => [...img]);
    setPreviewModal(true);
  };

  const youSave = (product_price, discount) => {
    let price = parseFloat(product_price);
    let _discount = parseInt(discount);

    let total_d = _discount / 100;
    let total_p = (price * total_d).toFixed(2);

    return `You save $${total_p} (${discount}%)`;
  };

  const displaySelected = (variant, name) => {
    for (let i = 0; i < selectedVariantContent.length; i++) {
      if (name === selectedVariantContent[i].name) {
        return `${selectedVariantContent[i].content} (+$${selectedVariantContent[i].price})`;
      }
    }
  };

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  const saleEnds = (sale_end_date) => {
    const date_is_same = Moment(
      new Date(sale_end_date.split(/\s+/).join('')),
    ).isSame(new Date(), 'd');
    const new_date = Moment(
      new Date(sale_end_date.split(/\s+/).join('')),
    ).format('MMM DD, YYYY');

    if (date_is_same) {
      return 'sale ends today';
    } else {
      return 'sale ends ' + new_date;
    }
  };

  const renderDisplayOutOfStockMessage = () => {
    if (productData.inStock) {
      if (parseInt(productData.product_qty) <= 0) {
        return (
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.push('Shops', {
                headerTile: 'Shop',
                backTitle: 'Back',
                seller_id: productData.user._id,
              })
            }>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 17,
                color: 'red',
              }}>
              Out of stock: but you can still add to cart.
            </Text>
          </TouchableWithoutFeedback>
        );
      }
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.push('Shops', {
              headerTile: 'Shop',
              backTitle: 'Back',
              seller_id: productData.user._id,
            })
          }>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 17,
              color: 'red',
            }}>
            Out of stock. We do not advise
            buying items that are out of stock to prevent shipping delays.
          </Text>
        </TouchableWithoutFeedback>
      );
    }
  };

  const renderVariants = productData.variants.map((result, index) => {
    // Keyboard.dismiss()
    return (
      <TouchableWithoutFeedback
        key={result._id}
        onPress={() => {
          Keyboard.dismiss();
          setOpenOptionModal(true);
          setVariant(result);
          setOptionModalView('variant');
        }}>
        <View
          style={[
            {...styles.option},
            {backgroundColor: variantsBorderColor ? '#fbe9e7' : '#fff'},
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 16,
                marginRight: 5,
                color: Colors.grey_darken,
              }}>
              Select {result.name}*:
            </Text>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
              {displaySelected(productData.variants, result.name)}
            </Text>
          </View>
          <View>
            <Icon
              name="md-arrow-dropdown"
              size={22}
              style={{marginRight: 5}}
              color={Colors.grey_darken}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  const renderReviews = productReviews.map((result, index, array) => {
    return (
      <View key={index}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: 14, fontFamily: Fonts.poppins_semibold}}>
                {result.user.first_name}
              </Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 14, fontFamily: Fonts.poppins_light}}>
              {Moment(new Date(result.dateReviewed)).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>

        <View style={{}}>
          <View style={{width: 80}}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={result.rateNumber}
              fullStarColor="#000"
              starSize={14}
              starStyle={{marginTop: 5, marginRight: 1}}
            />
          </View>
          <Text style={{fontSize: 14, fontFamily: Fonts.poppins_regular}}>
            {result.comment.trunc(100)}
          </Text>
        </View>
      </View>
    );
  });

  const renderItem_more_items_from_shop = moreItemsFromShop.map(
    (result, index, array) => {
      return (
        <TouchableWithoutFeedback
          onPress={pressAction.bind(this, result._id)}
          key={index}>
          <View style={styles.productCard}>
            <View style={{backgroundColor:"#e1e4e8", borderTopLeftRadius: 5,borderTopRightRadius: 5}}>
              {result.discount !== '' && (
                <View style={styles.discountContainer}>
                  <Text style={{fontFamily: Fonts.poppins_regular, padding: 1}}>
                    {result.discount}% OFF
                  </Text>
                </View>
              )}

              <Image
                source={{uri: result.main_image}}
                style={{
                  width: '100%',
                  height: 150,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}
                resizeMode="cover"
              />
            </View>
            <View style={{padding: 10}}>
              <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 15}}>
                {result.product_name.trunc(18)}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  alignSelf: 'flex-end',
                  fontSize: 18,
                }}>
                ${result.product_price}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    },
  );

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() =>
          props.navigation.push('Shops', {
            headerTile: 'Shop',
            backTitle: 'Back',
            seller_id: productData.user._id,
          })
        }>
        <View style={styles.topHeader}>
          <View style={styles.topHeaderRow_1}>
            <View>
              <Image
                source={{
                  uri: productData.user.shop_logo,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
                resizeMode="cover"
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Text style={{fontFamily: Fonts.poppins_semibold}}>
                {productData.user.shop_name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-pin" size={18} style={{marginRight: 5}} />
                <Text style={{fontFamily: Fonts.poppins_regular}}>
                  {productData.user.shop_location_city +
                    ', ' +
                    productData.user.shop_location_state}
                </Text>
              </View>
            </View>
          </View>
          {!isVisible && (
            <View style={styles.topHeaderRow_2}>
              <View style={{flexDirection: 'row', marginTop: 14, padding: 10}}>
                <View>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={rateNumber}
                    fullStarColor="#000"
                    starSize={14}
                    starStyle={{marginTop: 2, marginRight: 1}}
                  />
                </View>
                <View style={{marginLeft: 3}}>
                  <Text style={{fontFamily: Fonts.poppins_regular}}>
                    (number)
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <ViewPager
        style={{height: 400, backgroundColor: "#e1e4e8"}}
        initialPage={0}
        showPageIndicator="true"
        scrollEnabled={true}
        onPageSelected={(e) => console.log(e.nativeEvent.position)}
        initialPage={initialPage}>
        <View key="1">
          <TouchableWithoutFeedback
            onPress={handleImagePreivew.bind(this, productData.main_image)}>
            <Image
              source={{uri: productData.main_image}}
              style={{
                width: '100%',
                height: 400,
              }}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        </View>

        {productData.sub_image_1 !== '' && (
          <View key="2">
            <TouchableWithoutFeedback
              onPress={handleImagePreivew.bind(this, productData.sub_image_1)}>
              <Image
                source={{uri: productData.sub_image_1}}
                style={{
                  width: '100%',
                  height: 400,
                }}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          </View>
        )}

        {productData.sub_image_2 !== '' && (
          <View key="3">
            <TouchableWithoutFeedback
              onPress={handleImagePreivew.bind(this, productData.sub_image_2)}>
              <Image
                source={{uri: productData.sub_image_2}}
                style={{
                  width: '100%',
                  height: 400,
                }}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          </View>
        )}

        {productData.sub_image_3 !== '' && (
          <View key="4">
            <TouchableWithoutFeedback
              onPress={handleImagePreivew.bind(this, productData.sub_image_3)}>
              <Image
                source={{uri: productData.sub_image_3}}
                style={{
                  width: '100%',
                  height: 300,
                }}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          </View>
        )}
      </ViewPager>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{padding: 10, flexDirection: 'row'}}>
          <TouchableOpacity>
            <View style={{width: 80, height: 80, marginRight: 10}}>
              <TouchableWithoutFeedback
                onPress={handleImagePreivew.bind(this, productData.main_image)}>
                <Image
                  source={{uri: productData.main_image}}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
          {productData.sub_image_1 !== '' && (
            <TouchableOpacity>
              <View style={{width: 80, height: 80, marginRight: 10}}>
                <TouchableWithoutFeedback
                  onPress={handleImagePreivew.bind(
                    this,
                    productData.sub_image_1,
                  )}>
                  <Image
                    source={{uri: productData.sub_image_1}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          )}

          {productData.sub_image_2 !== '' && (
            <TouchableOpacity>
              <View style={{width: 80, height: 80, marginRight: 10}}>
                <TouchableWithoutFeedback
                  onPress={handleImagePreivew.bind(
                    this,
                    productData.sub_image_2,
                  )}>
                  <Image
                    source={{uri: productData.sub_image_2}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          )}

          {productData.sub_image_3 !== '' && (
            <TouchableOpacity>
              <View style={{width: 80, height: 80, marginRight: 10}}>
                <TouchableWithoutFeedback
                  onPress={handleImagePreivew.bind(
                    this,
                    productData.sub_image_3,
                  )}>
                  <Image
                    source={{uri: productData.sub_image_3}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.section_1}>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
          {productData.product_name}
        </Text>

        {renderDisplayOutOfStockMessage()}

        <View style={{marginTop: 5, flexDirection: 'row', marginTop: 5}}>
          <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 17}}>
            ${_price}
          </Text>
          {productData.discount !== '' && (
            <Text style={styles.previousPrice}>
              ${productData.product_price}
            </Text>
          )}
        </View>

        {productData.discount !== '' && (
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 13,
              color: Colors.green,
            }}>
            {youSave(productData.product_price, productData.discount) +
              ' ' +
              saleEnds(productData.discount_end_date)}
          </Text>
        )}
        {productData.user.offers_free_shipping && (
          <View style={{marginTop: 15}}>
            <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 17}}>
              Free Shipping
            </Text>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 14}}>
              with ${productData.user.price_threshold} purchase from{' '}
              {productData.user.shop_name}
            </Text>
          </View>
        )}

        <View style={styles.productOptions}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setNewQty(productData.product_qty);
              setOpenOptionModal(true);
              setOptionModalView('qty');
            }}>
            <View
              style={[
                {...styles.option},
                {borderBottomWidth: 1, borderColor: Colors.light_grey},
              ]}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 16,
                    marginRight: 5,
                    color: Colors.grey_darken,
                  }}>
                  Qty:
                </Text>
                <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
                  {qty}
                </Text>
              </View>
              <View>
                <Icon
                  name="md-arrow-dropdown"
                  size={22}
                  style={{marginRight: 5}}
                  color={Colors.grey_darken}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {renderVariants}
        </View>
        {productData.product_can_be_customized && (
          <TouchableWithoutFeedback>
            <View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                {!productData.product_can_be_customized_is_optional ? (
                  <Icon
                    name="md-checkbox-outline"
                    size={35}
                    color={Colors.grey_darken}
                  />
                ) : (
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 2,
                      borderColor: Colors.grey_darken,
                      borderRadius: 2,
                      marginBottom: 10,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontSize: 20,
                    marginLeft: 10,
                  }}>
                  Add personalization{' '}
                  {productData.product_can_be_customized_is_optional &&
                    '(Optional)'}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  color: '#9e9e9e',
                }}>
                {productData.product_personilization_note}
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  fontSize: 20,
                  fontFamily: Fonts.poppins_regular,
                  padding: 10,
                  borderColor: Colors.light_grey,
                  borderRadius: 5,
                  maxHeight: 200,
                  color:"#000"
                }}
                value={customization_note}
                onChangeText={(value) => setCustomization_note(value)}
                multiline={true}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        {addingToCart ? (
          <TouchableOpacity>
            <View
              style={[
                {...styles.button},
                {
                  backgroundColor: Colors.blue,
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
              ]}>
              <View>
                <MaterialIndicator
                  color="#fff"
                  style={{
                    marginRight: 14,
                  }}
                />
              </View>
              <Text style={[{...styles.buttonText}]}>Adding to cart</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressIn={addToCart.bind(this)}
            onPressOut={animateOut.bind(this)}>
            <Animated.View
              style={[
                {...styles.button},
                {
                  backgroundColor: !isAddedToCard
                    ? Colors.purple_darken
                    : Colors.blue,
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
                {
                  transform: [
                    {
                      scale: animatedPress,
                    },
                  ],
                },
              ]}>
              {isAddedToCard && (
                <View style={{marginRight: 10}}>
                  <Icon name="ios-checkmark" size={30} color="#fff" />
                </View>
              )}
              <Text style={[{...styles.buttonText}]}>
                {!isAddedToCard ? 'Add to cart' : 'Go to cart'}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section_2}>
        <TouchableOpacity
          onPress={() => {
            setItemDetails((prev) => {
              const previous = !prev;
              return !!previous;
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 17, fontFamily: Fonts.poppins_semibold}}>
              Item details
            </Text>
            {itemDetails ? (
              <Icon
                name="ios-arrow-up"
                size={22}
                style={{marginRight: 5}}
                color={Colors.light_grey}
              />
            ) : (
              <Icon
                name="ios-arrow-down"
                size={22}
                style={{marginRight: 5}}
                color={Colors.light_grey}
              />
            )}
          </View>
        </TouchableOpacity>
        {itemDetails && (
          <View style={{padding: 5}}>
            <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
              {productData.product_details}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.section_2}>
        <TouchableOpacity
          onPress={() => {
            setShippingPolicies((prev) => {
              const previous = !prev;
              return !!previous;
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 17, fontFamily: Fonts.poppins_semibold}}>
              Shipping & policies
            </Text>
            {shippingPolicies ? (
              <Icon
                name="ios-arrow-up"
                size={22}
                style={{marginRight: 5}}
                color={Colors.light_grey}
              />
            ) : (
              <Icon
                name="ios-arrow-down"
                size={22}
                style={{marginRight: 5}}
                color={Colors.light_grey}
              />
            )}
          </View>
        </TouchableOpacity>
        {shippingPolicies && (
          <View>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.light_grey,
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  marginTop: 20,
                  marginLeft: 10,
                  fontFamily: Fonts.poppins_light,
                  fontSize: 25,
                }}>
                Shop policies
              </Text>
            </View>

            <View style={{paddingHorizontal: 5, marginTop: 15}}>
              <Text
                style={{
                  marginLeft: 11,
                  fontFamily: Fonts.poppins_semibold,
                }}>
                Shipping
              </Text>

              <Text
                style={{
                  marginLeft: 11,
                  fontFamily: Fonts.poppins_semibold,
                  marginTop: 17,
                }}>
                Processing time
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                The time I need to prepare an order for shipping varies.
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 5,
                marginTop: 15,
                borderTopWidth: 0.5,
                borderTopColor: Colors.light_grey,
                paddingTop: 10,
              }}>
              <Text
                style={{
                  marginLeft: 11,
                  fontFamily: Fonts.poppins_semibold,
                }}>
                Payment
              </Text>

              <Text
                style={{
                  marginLeft: 11,
                  fontFamily: Fonts.poppins_semibold,
                  marginTop: 17,
                }}>
                Secure Payment
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                All payments are processed through Shaloz app using your debit
                or credit card. Merchants on Shaloz never receive your credit
                card information. For your security, all payments should be
                processed through the app to avoid fraudulent activity.
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 5,
                marginTop: 15,
                borderTopWidth: 0.5,
                borderTopColor: Colors.light_grey,
                paddingTop: 10,
              }}>
              <Text
                style={{
                  marginLeft: 11,
                  fontFamily: Fonts.poppins_semibold,
                  marginTop: 10,
                }}>
                Returns and exchanges
              </Text>

              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                All merchants on Shaloz gladly accept returns, exchanges, and
                cancellations. Just contact the Shaloz within 7 days of
                delivery.
              </Text>

              <Text
                style={{
                  marginLeft: 11,
                  fontFamily: Fonts.poppins_semibold,
                  marginTop: 17,
                }}>
                Conditions of return
              </Text>

              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Buyers are responsible for return shipping costs. If the item is
                not returned in its original condition, the buyer is responsible
                for any loss in value
              </Text>
            </View>
          </View>
        )}
      </View>
      {reviewCount !== 0 && (
        <View style={styles.reviewSection}>
          <View style={{padding: 15}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{marginRight: 10}}>
                <Text
                  style={{fontSize: 18, fontFamily: Fonts.poppins_semibold}}>
                  Reviews
                </Text>
              </View>
              <View>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={rateNumber}
                  fullStarColor="#000"
                  starSize={14}
                  starStyle={{marginTop: 5, marginRight: 1}}
                />
              </View>

              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 18, fontFamily: Fonts.poppins_regular}}>
                  ({reviewCount})
                </Text>
              </View>
            </View>
            <View>
              <View>{renderReviews}</View>
              {reviewCount > 5 && (
                <TouchableOpacity
                  style={styles.button_review}
                  onPress={() =>
                    props.navigation.push('ProductReview', {
                      product_id: productData._id,
                    })
                  }>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: Fonts.poppins_regular,
                    }}>
                    see all reviews
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      <TouchableWithoutFeedback
        onPress={() =>
          props.navigation.push('Shops', {
            headerTile: 'Shop',
            backTitle: 'Back',
            seller_id: productData.user._id,
          })
        }>
        <View style={styles.sellerInfo}>
          <View style={{marginRight: 15, width: '20%'}}>
            <Image
              source={{
                uri: productData.user.shop_logo,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{marginTop: 10, width: '70%'}}>
            <Text style={{fontSize: 18, fontFamily: Fonts.poppins_regular}}>
              {productData.user.first_name}
            </Text>
            <Text style={{fontSize: 15, fontFamily: Fonts.poppins_semibold}}>
              Owner of {productData.user.shop_name}
            </Text>
            {!isVisible && (
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => {
                  Alert.alert(
                    'To avoid fraudulent activity do not pay for any product out of the platform',
                    '',
                    [
                      {
                        text: 'Ok',
                        onPress: async () => {
                          Linking.openURL(
                            'mailto:' +
                              productData.user.email +
                              '?cc=&subject=theShop message' +
                              productData.user.shop_name +
                              '&body=body',
                          );
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  Message Seller
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.moreItemsFromShop}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 1,
            marginTop: 20,
            width: '100%',
          }}>
          <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
            More items from this shop
          </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.push('Shops', {
                headerTile: 'Shop',
                backTitle: 'Back',
                seller_id: productData.user._id,
              })
            }>
            <Text
              style={{
                color: Colors.blue,
                marginTop: 1,
                fontFamily: Fonts.poppins_regular,
                fontSize: 15,
              }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        {renderItem_more_items_from_shop}
      </View>

      <View
        style={{
          marginTop: 10,
          paddingBottom: 25,
        }}>
        <TouchableOpacity
          style={[
            {...styles.customButton},
            {width: '50%', alignSelf: 'center'},
          ]}
          onPress={() =>
            props.navigation.push('Shops', {
              headerTile: 'Shop',
              backTitle: 'Back',
              seller_id: productData.user._id,
            })
          }>
          <Text
            style={{
              alignSelf: 'center',
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
            }}>
            Shop all items
          </Text>
        </TouchableOpacity>

        {productData.user.offers_discount_on_price_threshold && (
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.push('Shops', {
                headerTile: 'Shop',
                backTitle: 'Back',
                seller_id: productData.user._id,
              })
            }>
            <View style={{padding: 10, marginTop: 15}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '10%'}}>
                  <View style={styles.priceTag}>
                    <Icon
                      name="md-pricetags"
                      size={20}
                      style={{alignSelf: 'center'}}
                      color="#fff"
                    />
                  </View>
                </View>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 14,
                    }}>
                    Buy {productData.user.max_items_to_get_discount} item(s)
                    from {productData.user.shop_name} and get{' '}
                    {productData.user.discount_amount_for_threshold}% off your
                    order
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 13,
                  color: Colors.grey_darken,
                  marginTop: 4,
                }}>
                Discount shown at checkout. See item details for sale
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      <OtherItems
        pressAction={pressAction}
        title="Other items on Shaloz"
        dataN={otherProducts}
        navigation={props.navigation}
      />

      <HorizontalProductSection
        pressAction={pressAction}
        navigation={props.navigation}
        title="Recently viewed"
        dataN={recentViewed}
      />
      <ImageView
        images={previewData}
        imageIndex={0}
        isVisible={previewModal}
        onClose={() => setPreviewModal(false)}
        glideAlways
        animationType="fade"
      />

      {openOptionModal && (
        <OptionModal
          optionModalView={optionModalView}
          variant={variant}
          openOptionModal={openOptionModal}
          setOpenOptionModal={setOpenOptionModal}
          selectedVariantContent={selectedVariantContent}
          setSelectedVariantContent={setSelectedVariantContent}
          qty={qty}
          setQty={setQty}
          newQty={newQty}
          productData={productData}
          setVariantsBorderColor={setVariantsBorderColor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  priceTag: {
    backgroundColor: Colors.green,
    width: 30,
    height: 30,
    borderRadius: 50,
    padding: 5,
  },

  moreItemsFromShop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    flexWrap: 'wrap',
  },
  customButton: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    padding: 8,
    borderWidth: 1.6,
    borderRadius: 50,
  },

  sellerInfo: {
    borderTopWidth: 0.4,
    borderTopColor: Colors.light_grey,
    marginTop: 10,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reviewSection: {
    borderTopWidth: 0.4,
    borderTopColor: Colors.light_grey,
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section_1: {padding: 10},
  section_2: {
    marginTop: 10,
    borderTopWidth: 0.4,
    borderTopColor: Colors.light_grey,
    padding: 10,
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
  previousPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: Colors.grey_darken,
    marginLeft: 5,
    fontFamily: Fonts.poppins_light,
    fontSize: 17,
  },
  productOptions: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.light_grey,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light_grey,
  },
  button: {
    backgroundColor: Colors.purple_darken,
    marginTop: 20,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontFamily: Fonts.poppins_semibold,
    fontSize: 20,
    color: '#fff',
  },
  productCard: {
    width: '48%',
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    height: 225,
    marginRight: 1,
    marginBottom: 5,
    shadowColor: Colors.grey_darken,
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
  button_review: {
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
});

export default SingleProductComponent;
