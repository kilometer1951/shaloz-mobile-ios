import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {TabHeading, Tab, Tabs} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import {MaterialIndicator} from 'react-native-indicators';

import * as appActions from '../store/actions/appActions';
import * as authActions from '../store/actions/authActions';

//const {height} = Dimensions.get('window');

const OpenCategorySectionModal = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const {openCategoryModal, setOpenCategoryModal} = props;
  const [selectedCategories, setSelectedCategories] = useState(
    user.store_categories,
  );
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryForSelection = async () => {
      setIsLoading(true);
      const response = await appActions.fetchCategoryForSelection();
      const newArray = [];
      for (i of response.data) {
        newArray.push(i.name);
      }
      setData(newArray);
      setIsLoading(false);
    };
    fetchCategoryForSelection();
  }, []);

  const filterCategory = (name) => {
    //select
    setSelectedCategories((prev) => [...prev, name]);
    //delete from list
    const filtered = data.filter((value) => value !== name);
    setData(filtered);
  };

  const deleteSelected = (name) => {
    const filtered = selectedCategories.filter((value) => value !== name);
    setSelectedCategories(filtered);
    setData((prev) => [...prev, name]);
  };

  const _selectedCat = selectedCategories.reverse().map((result, index) => {
    return (
      <TouchableOpacity key={index} onPress={deleteSelected.bind(this, result)}>
        <View style={styles.selectedCat}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.poppins_regular,
                color: '#fff',
              }}>
              {result}
            </Text>
          </View>
          <View style={{marginLeft: 10}}>
            <Icon name="ios-close" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderMainCategory = data.reverse().map((result, index, array) => {
    return (
      <TouchableOpacity key={index} onPress={filterCategory.bind(this, result)}>
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
              {result}
            </Text>
          </View>
          <View style={{marginRight: 10}}>
            <Icon name="ios-add" size={25} />
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openCategoryModal}
      style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}></View>
          <View style={styles.headerRow}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 17,
                fontFamily: Fonts.poppins_semibold,
                textAlign: 'center',
              }}>
              Select Categories
            </Text>
          </View>
          <View style={{width: '20%'}}>
            {selectedCategories.length !== 0 && (
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    authActions.updateShopCategories(
                      selectedCategories,
                      user._id,
                    ),
                  );
                  setOpenCategoryModal(false);
                }}>
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
            style={{
              marginRight: 14,
              height: 100,
            }}
          />
        </View>
      ) : (
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 20,
              paddingLeft: 10,
            }}>
            <ScrollView
              horizontal={true}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}>
              {_selectedCat}
            </ScrollView>
          </View>
          <View style={{padding: 10}}>{renderMainCategory}</View>
        </ScrollView>
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

  selectedCat: {
    borderWidth: 1,
    padding: 10,
    height: 50,
    marginRight: 5,
    borderRadius: 50,
    borderColor: Colors.purple_darken,
    backgroundColor: Colors.purple_darken,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

export default OpenCategorySectionModal;
