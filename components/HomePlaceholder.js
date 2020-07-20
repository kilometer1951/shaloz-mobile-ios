import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
 
  ScrollView,
} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const HomePlaceholder = (props) => {
  const dataN = [{ne: '1'}, {ne: '2'}, {ne: '3'}, {ne: '4'}];

  const placeholderData = dataN.map((result, index, array) => {
    return (
      <View style={{marginRight: 10}} key={index}>
        <PlaceholderMedia
          style={{
            width: 170,
            height: 120,
            borderRadius: 5,
          }}
        />
      </View>
    );
  });

  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20}}>
      <Placeholder Animation={Fade}>
        <ScrollView
          horizontal={true}
          style={{marginTop: 5}}
          showsHorizontalScrollIndicator={false}>
          {placeholderData}
        </ScrollView>
        <View style={styles.dealProductCard}>
          <PlaceholderMedia
            style={{
              width: '100%',
              height: 270,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          />

          <View style={styles.dealProductsBottomView}>
            <View>
              <PlaceholderLine style={styles.bottomPlaceholder} />
              <PlaceholderLine style={styles.bottomPlaceholder} />
              <PlaceholderLine style={styles.bottomPlaceholder} />
            </View>
          </View>
        </View>
      </Placeholder>
    </View>
  );
};

const styles = StyleSheet.create({
  dealProductCard: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 40,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    marginHorizontal: 10,
    elevation: 5,
    height: 430,
    marginBottom: 20,
  },
  dealProductsBottomView: {
    padding: 20,
  },
  bottomPlaceholder: {
    marginTop: 5,
    padding: 10,
    width: '90%',
  },
});

export default HomePlaceholder;
