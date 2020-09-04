import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {Segment, Button, Body} from 'native-base';
import ShopReviews from './ShopReviews';
import {useSelector, useDispatch} from 'react-redux';

import {MaterialIndicator} from 'react-native-indicators';

const Reviews = (props) => {
  const [active, setActive] = useState('items');
  const user = useSelector((state) => state.authReducer.user);

  let view;
  if (active === 'items') {
    view = <ShopReviews seller_id={user._id} />;
  } else {
    view = <Text>Services</Text>;
  }

  return <View style={{flex: 1}}>{view}</View>;
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    padding: 10,
    borderWidth: 1.6,
    borderRadius: 50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    padding: 10,
    borderBottomColor: Colors.light_grey,
  },
  headerRow: {
    width: '50%',
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
});

export default Reviews;

// <View
//         style={{
//           marginTop: 10,
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignSelf: 'center',
//         }}>
//         <TouchableOpacity
//           disabled={active === 'items' ? true : false}
//           onPress={() => {
//             setActive('items');
//           }}>
//           <View
//             style={{
//               borderColor: Colors.pink,
//               borderWidth: 1,
//               width: 100,
//               alignItems: 'center',
//               padding: 5,
//               borderTopLeftRadius: 5,
//               borderBottomLeftRadius: 5,
//               backgroundColor: active === 'items' ? Colors.pink : '#fff',
//             }}>
//             <Text
//               style={{
//                 fontFamily: Fonts.poppins_regular,
//                 color: active === 'items' ? '#fff' : 'blue',
//                 borderRightColor: '#000',
//               }}>
//               Items
//             </Text>
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity
//           disabled={active === 'services' ? true : false}
//           onPress={() => {
//             setActive('services');
//           }}>
//           <View
//             style={{
//               borderColor: Colors.pink,
//               borderTopWidth: 1,
//               borderRightWidth: 1,
//               borderBottomWidth: 1,
//               width: 100,
//               alignItems: 'center',
//               padding: 5,
//               borderTopRightRadius: 5,
//               borderBottomRightRadius: 5,
//               backgroundColor: active === 'services' ? Colors.pink : '#fff',
//             }}>
//             <Text
//               style={{
//                 fontFamily: Fonts.poppins_regular,
//                 color: active === 'services' ? '#fff' : 'blue',
//               }}>
//               Services
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
