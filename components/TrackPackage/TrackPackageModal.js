import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import * as appActions from '../../store/actions/appActions';
import Timeline from 'react-native-timeline-flatlist';
import Moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import NetworkError from '../NetworkError';
import {MaterialIndicator} from 'react-native-indicators';

const TrackPackageModal = (props) => {
  const dispatch = useDispatch();
  const {tracking_number, openTrackingModal, setOpenTrackingModal} = props;
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [trackProgress, setTrackProgress] = useState([]);


  useEffect(() => {
    const trackPackage = async () => {
      try {
        setIsLoading(true);
        const response = await appActions.trackPackage(tracking_number);
        setIsLoading(false);
        const array = []
        for(let i = 0; i < response.data.length ; i++) {
          let newData = {time: Moment(response.data[i].occurred_at).format("HH:HH") ,title: response.data[i].description,description: response.data[i].city_locality } 
          array.push(newData)
        }
       
        setTrackProgress(array)

      } catch (e) {
        setIsLoading(false);
        setNetworkError(true);
      }
    };
    trackPackage();
  }, []);

 



  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={openTrackingModal}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '25%'}}>
            <TouchableWithoutFeedback
              onPress={() => setOpenTrackingModal(false)}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 17,
                  fontFamily: Fonts.poppins_regular,
                }}>
                Close
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View>
            <Text style={{fontSize:20, fontFamily:Fonts.poppins_semibold, marginLeft:25}}>Track Package</Text>
          </View>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={{marginTop: 40}}>
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        </View>
      ) : (
        <Timeline
          data={trackProgress}
          circleSize={20}
          circleColor={Colors.purple_darken}
          lineColor={Colors.purple_darken}
          timeContainerStyle={{minWidth: 52, marginTop: -5}}
          timeStyle={{
            textAlign: 'center',
            backgroundColor: Colors.blue,
            color: 'white',
            padding: 5,
            borderRadius: 13,
            fontFamily:Fonts.poppins_regular,
          }}

          titleStyle={{fontSize:20, fontFamily:Fonts.poppins_regular}}
          descriptionStyle={{color: 'gray', fontSize:18,fontFamily:Fonts.poppins_regular}}
          options={{
            style: {paddingTop: 5, marginLeft:30,marginTop:20, marginBottom:20},
          }}
          innerCircle={'dot'}
        />
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
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light_grey,
    flexDirection: 'row',
  },
  card: {
    marginBottom: 15,
    padding: 10,
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: '#fff',
    marginRight: 1,
    shadowColor: Colors.grey_darken,
    marginTop: 5,
    borderRadius: 5,
  },
});

export default TrackPackageModal;
