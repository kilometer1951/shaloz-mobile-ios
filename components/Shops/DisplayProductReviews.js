import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
 
} from 'react-native';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import StarRating from 'react-native-star-rating';

const DisplayProductReviews = (props) => {
  const dataN = [{ne: '1'}, {ne: '2'}, {ne: '3'}, {ne: '4'}];
  const [rateNumber, setRateNumber] = useState(5);

  const reviewsData = dataN.map((result, index, array) => {
    return (
      <View key={index}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: 14, fontFamily: Fonts.poppins_semibold}}>
                Name
              </Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 14, fontFamily: Fonts.poppins_light}}>
              Jul 26, 2019
            </Text>
          </View>
        </View>
       
          <View style={{}}>
            <View style={{width: 80}}>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={rateNumber}
                fullStarColor="#000"
                starSize={14}
                starStyle={{marginTop: 5, marginRight: 1}}
              />
            </View>
            <Text style={{fontSize: 14, fontFamily: Fonts.poppins_regular}}>
              Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
              Lorem Lorem Lorem
            </Text>
          </View>
      
      </View>
    );
  });

  return (
    <View>
      {reviewsData}

     
    </View>
  );
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
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginRight: 10,
  },
});

export default DisplayProductReviews;
