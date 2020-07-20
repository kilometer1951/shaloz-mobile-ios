import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Colors from '../contants/Colors';

const VideoAdPlaceHolder = (props) => {

//   const placeholderData = dataN.map((result, index, array) => {
//     return (
//       <View style={styles.placeholderContainer} key={index}>
//         <Placeholder Animation={Fade}>
//           <PlaceholderMedia style={styles.topPlaceholder} />
//           <PlaceholderLine style={styles.bottomPlaceholder} />
//           <PlaceholderLine style={styles.bottomPlaceholder} />
//           <PlaceholderLine style={styles.bottomPlaceholder} />
//         </Placeholder>
//       </View>
//     );
//   });

  return (
    <View style={{flex:1}}>
     <View style={{marginTop:"50%"}}>
     <ActivityIndicator size="large"/>
     </View>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <View style={styles.buttons}>

          </View>
          <View style={styles.buttons}>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: '100%',
      },
      buttons: {
        borderRadius: 100,
        shadowRadius: 1,
        marginTop: 10,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        height: 65,
        width: 65,
        marginBottom: 5,
        shadowColor: Colors.grey_darken,
        marginBottom: 30,
        marginLeft: 10,
      },
});

export default VideoAdPlaceHolder;
