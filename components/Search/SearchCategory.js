import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
//import ProductCategory from './ProductCategory';
import ProductPlaceholderLoader from '../ProductPlaceholderLoader';

const SearchCategory = (props) => {
  const dispatch = useDispatch();
  const [categoryTitle1, setCategoryTitle1] = useState('All Categories');
  const [categoryTitle2, setCategoryTitle2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    main_cat,
    sub_cat_1,
    sub_cat_2,
    categoryView,
    setCategoryaView,
    newSubCatOne,
    setNewSubCatOne,
    newSubCatTwo,
    setNewSubCatTwo,
    main_cat_name,
    sub_cat_one_name,
    setMain_cat_name,
    setSub_cat_one_name,
  } = props;

  const filterSubCategoryOne = (main_cat_id, name) => {
    const data = sub_cat_1.filter((value) => value.mainCategory == main_cat_id);
    setCategoryaView('sub_cat_one_view');
    setNewSubCatOne(data);
    setMain_cat_name(name);
  };

  const filterSubCategoryTwo = (sub_cat_one_id, name) => {
    const data = sub_cat_2.filter(
      (value) => value.subCategoryOne == sub_cat_one_id,
    );
    setCategoryaView('sub_cat_two_view');
    setSub_cat_one_name(name);
    setNewSubCatTwo(data);
  };

  const renderMainCategory = main_cat.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={result._id}
        onPress={filterSubCategoryOne.bind(this, result._id, result.name)}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              {result.name}
            </Text>
          </View>
          <View style={{marginRight: 10}}>
            <Icon name="ios-arrow-forward" size={25} />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderSubCatOne = newSubCatOne.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={filterSubCategoryTwo.bind(this, result._id, result.name)}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              {result.name}
            </Text>
          </View>
          <View style={{marginRight: 10}}>
            <Icon name="ios-arrow-forward" size={25} />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderSubCatTwo = newSubCatTwo.map((result, index, array) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          // console.log(main_cat_name,sub_cat_one_name,result.name);
          props.navigation.push('ProductCategory', {
            main_cat: main_cat_name,
            sub_cat_one: sub_cat_one_name,
            sub_cat_two: result.name,
            backTitle: 'Back',
            headerTile: main_cat_name,
          });
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              {result.name}
            </Text>
          </View>
          <View style={{marginRight: 10}}>
            <Icon name="ios-arrow-forward" size={25} />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  let viewtoRender;

  if (categoryView === 'all_category') {
    viewtoRender = renderMainCategory;
  } else if (categoryView === 'sub_cat_one_view') {
    viewtoRender = renderSubCatOne;
  } else {
    viewtoRender = renderSubCatTwo;
  }
  return <View style={{marginBottom: 30}}>{viewtoRender}</View>;
};

const styles = StyleSheet.create({});

export default SearchCategory;
