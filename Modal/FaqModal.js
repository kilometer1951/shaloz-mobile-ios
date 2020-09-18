import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../store/actions/appActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating';
import {Toast} from 'native-base';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import NetworkError from '../components/NetworkError';
import {Container, Header, Content, Icon, Accordion} from 'native-base';

const FaqModal = (props) => {
  const dispatch = useDispatch();
  const {openFaqModal, setOpenFaqModal} = props;
  const dataArray = [
    {
      title: 'Does Shaloz do a verification check on all stores?',
      content:
        'Yes. Shaloz first priority is security. We verify all stores on the platform.',
    },
    {
      title: 'Does Shaloz review products?',
      content:
        'Yes. We review all products on the platform. When you upload a product, you will see a message on the product saying under-review. When we are done reviewing the product, the message under-review will go away meaning your product has been posted for sale.',
    },
    {
      title: 'How long does product review take?',
      content:
        'It usually takes between thirty to fifty seconds from the time of uploading.',
    },
    {
      title: 'How do buyers earn points?',
      content:
        'Our loyalty point system is one of the best out there. As you buy, you earn points on every dollar. Every dollar you spend through the Shaloz platform is equivalent to one point.  One point is equivalent to 0.002 cents.',
    },
    {
      title: 'Who pays for Shaloz loyalty program?',
      content:
        'Shaloz pays for the loyalty program. Sellers are not affected by our loyalty program.',
    },

    {
      title: 'Does Shaloz issue refunds?',
      content:
        'Shaloz happily accepts refunds on all items sold through the platform.',
    },
    {
      title: 'Are all payments secure through the Shaloz app?',
      content:
        'Shaloz does not share your payment details with sellers. We use best in-class technology to secure your transactions.',
    },
    {
      title: 'Does Shaloz offer customer support?',
      content:
        'Yes Shaloz does. Our customer support is open 24/7 for any questions or product related issues you might have. You can reach us at support@shaloz.com.',
    },
    {
      title: 'Can I track my products after shipment?',
      content:
        "Yes you can track all products bought through the Shaloz platform. To track your package, click on the person icon at the bottom of the screen > then click on purchase and review. All packages can be tracked as long as they haven't arrived.",
    },
    {
      title: 'How can I sell on Shaloz?',
      content:
        'Anyone can sell on Shaloz. It takes one minute to setup your store and start selling. Click on the "Create your online store button" to get started.',
    },
    {
      title: 'Is there any subscription fee for selling?',
      content:
        'We charge no subscription fee. However, Shaloz charges a 5% transaction fee on every successful purchase.',
    },
    {
      title: 'Does Shaloz charge any fee to enlist products?',
      content: 'We charge no fee to enlist your products.',
    },

    {
      title: 'Can sellers issue refunds?',
      content: 'Yes, All sellers can issue refunds.',
    },
    {
      title: 'How do you get paid after fulfilling a package?',
      content:
        'After fulfilling a package, we review the transaction and send all payment to your account within two days of the package arriving.',
    },
    {
      title: 'How long does deposit take to post to my account?',
      content:
        'It takes two business days to post all earnings to your bank account. Your first deposit takes seven days, the rest take two business days. Deposits may take three to seven business days on holidays.',
    },
    {
      title: 'How does Shaloz promote your product?',
      content:
        'Shaloz offers free promotion on all products within the app. We promote your product within and out of the app through our promotion program.',
    },
  ];

  const _renderHeader = (item, expanded) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}>
        <Text style={{fontWeight: '600', fontFamily: Fonts.poppins_regular}}>
          {item.title}
        </Text>
        {expanded ? (
          <Icon style={{fontSize: 18}} name="remove-circle" />
        ) : (
          <Icon style={{fontSize: 18}} name="add-circle" />
        )}
      </View>
    );
  };
  const _renderContent = (item) => {
    return (
      <Text
        style={{
          backgroundColor: '#fff',
          padding: 10,
          fontFamily: Fonts.poppins_regular,
        }}>
        {item.content}
      </Text>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={openFaqModal}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={{width: '20%'}}>
            <TouchableWithoutFeedback onPress={() => setOpenFaqModal(false)}>
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
        </View>
      </SafeAreaView>
      <View style={styles.screen}>
        <Accordion
          dataArray={dataArray}
          animation={true}
          expanded={true}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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

export default FaqModal;
