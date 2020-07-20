import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  
  TouchableOpacity,
  
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

import * as appActions from '../../store/actions/appActions';
import NetworkError from '../NetworkError';

import {MaterialIndicator} from 'react-native-indicators';

const CategoryModal = (props) => {
  const {
    setCategoryModal,
    categoryModal,
    categoryModalView,
    setCategoryModalView,
    setMainCategory_id,
    setMainCategory,
    main_category,
    main_category_id,
    setSubCategory1_id,
    setSubCategory1,sub_category1,setSubCategory2,sub_category1_id
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [networkError, setNetworkError] = useState(false);
  const [done, setDone] = useState(false);
  const [checkBox, setCheckbox] = useState();

  const getMainCategory = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.getMainCategory();
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setCategoryData(response.data);
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const getSubCategoryOne = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.getSubCategoryOne(main_category_id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setCategoryData(response.data);
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  const getSubCategoryTwo = async () => {
    try {
      setIsLoading(true);
      const response = await appActions.getSubCategoryTwo(sub_category1_id);
      setIsLoading(false);
      if (!response.status) {
        setIsLoading(false);
        setNetworkError(true);
        return;
      }
      setCategoryData(response.data);
    } catch (e) {
      setIsLoading(false);
      setNetworkError(true);
    }
  };

  useEffect(() => {
    if (categoryModalView === 'main_category_view') {
      getMainCategory();
    } else if (categoryModalView === 'sub_category_view') {
      getSubCategoryOne();
    } else {
      getSubCategoryTwo()
    }
  }, []);

  const closeModal = () => {
    setCategoryModal(false);
  };

  const _done = () => {
    closeModal();
  };

  const selectCategory = (name, _id, index) => {
    if (categoryModalView === 'main_category_view') {
      setCheckbox(index);
      setMainCategory_id(_id);
      setMainCategory(name);
      setDone(true);
    } else if (categoryModalView === 'sub_category_view') {
      setCheckbox(index);
      setSubCategory1_id(_id);
      setSubCategory1(name);
      setDone(true);
    } else {
      setCheckbox(index);
      setSubCategory2(name);
      setDone(true);
    }
  };

  let view;
  if (categoryModalView === 'main_category_view') {
    view = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={categoryData}
        renderItem={({item, index}) => (
          <View
            style={{
              padding: 10,
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <TouchableOpacity
              onPress={selectCategory.bind(this, item.name, item._id, index)}>
              <View style={{flexDirection: 'row'}}>
                {checkBox === index && (
                  <Icon name="ios-checkmark" size={25} color="blue" />
                )}
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: checkBox === index ? 'blue' : '#000',
                  }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom: 100}}
      />
    );
  } else if (categoryModalView === 'sub_category_view') {
    view = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={categoryData}
        renderItem={({item, index}) => (
          <View
            style={{
              padding: 10,
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <TouchableOpacity
              onPress={selectCategory.bind(this, item.name, item._id, index)}>
              <View style={{flexDirection: 'row'}}>
                {checkBox === index && (
                  <Icon name="ios-checkmark" size={25} color="blue" />
                )}
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: checkBox === index ? 'blue' : '#000',
                  }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom: 100}}
      />
    );
  } else {
    view = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={categoryData}
        renderItem={({item, index}) => (
          <View
            style={{
              padding: 10,
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 0.5,
            }}>
            <TouchableOpacity
              onPress={selectCategory.bind(this, item.name, item._id, index)}>
              <View style={{flexDirection: 'row'}}>
                {checkBox === index && (
                  <Icon name="ios-checkmark" size={25} color="blue" />
                )}
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: checkBox === index ? 'blue' : '#000',
                  }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        style={{marginTop: 2, marginBottom: 100}}
      />
    );
  }

  let headerTile;
  if (categoryModalView === 'main_category_view') {
    headerTile = 'Main Category';
  } else if (categoryModalView === 'sub_category_view') {
    headerTile = main_category;
  } else {
    headerTile = sub_category1
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={categoryModal}
      style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableOpacity onPress={closeModal}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 10,
                    fontFamily: Fonts.poppins_regular,
                    color: 'red',
                  }}>
                  Cancel
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
                textAlign:'center'
              }}>
              {headerTile}
            </Text>
          </View>
          <View style={{width: '20%'}}>
            {done && (
              <TouchableOpacity onPress={_done}>
                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontSize: 17,
                      marginRight: 10,
                      fontFamily: Fonts.poppins_regular,
                      color: 'blue',
                    }}>
                    Done
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
      {isLoading ? (
        <View style={{marginTop: '50%'}}>
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{
              paddingHorizontal: 10,
            }}
          />
        </View>
      ) : (
        <View style={{padding: 10}}>{view}</View>
      )}

      {networkError && (
        <NetworkError
          networkError={networkError}
          setNetworkError={setNetworkError}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
    backgroundColor: '#fff',
  },
  headerRow: {
    width: '60%',
  },
});

export default CategoryModal;
