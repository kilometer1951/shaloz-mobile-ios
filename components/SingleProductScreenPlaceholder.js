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

const SingleProductScreenPlaceholder = (props) => {
  const dataN = [
    {ne: '1'},
    {ne: '2'},
    {ne: '3'},
    {ne: '4'},
    {ne: '5'},
    {ne: '6'},
  ];

  const placeholderData = dataN.map((result, index, array) => {
    return (
      <View style={{padding: 5, flexDirection: 'row'}} key={index}>
        <View style={{width: 80, height: 80}}>
          <PlaceholderMedia
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      </View>
    );
  });

  return (
    <View style={{flex: 1}}>
      <Placeholder Animation={Fade}>
        <View style={styles.topHeader}>
          <View style={styles.topHeaderRow_1}>
            <View>
              <PlaceholderMedia
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
              />
            </View>
            <View style={{marginLeft: 5}}>
              <PlaceholderLine style={styles.bottomPlaceholder} />
              <View style={{flexDirection: 'row'}}>
                <PlaceholderLine style={styles.bottomPlaceholder} />
              </View>
            </View>
          </View>
          <View style={styles.topHeaderRow_2}>
            <View style={{flexDirection: 'row', marginTop: 14, padding: 10}}>
              <View>
                <PlaceholderLine style={styles.bottomPlaceholder} />
              </View>
              <View style={{marginLeft: 3}}>
                <PlaceholderLine style={styles.bottomPlaceholder} />
              </View>
            </View>
          </View>
        </View>
        <View>
          <View key="2">
            <PlaceholderMedia
              style={{
                width: '100%',
                height: 300,
              }}
            />
          </View>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {placeholderData}
        </ScrollView>
        <View style={{marginTop: 10}}>
          <PlaceholderLine style={styles.placeholderLineStyle} />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
          <PlaceholderLine
            style={[{...styles.placeholderLineStyle}, {width: '80%'}]}
          />
        </View>
      </Placeholder>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '29%',
  },
  bottomPlaceholder: {
    padding: 10,
    marginHorizontal: 10,
    width: '70%',
  },
  placeholderLineStyle: {
    marginHorizontal: 5,
    padding: 10,
    width: '60%',
  },
});

export default SingleProductScreenPlaceholder;
