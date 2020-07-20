/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import io from 'socket.io-client';
import {Root} from 'native-base';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  YellowBox,
  AppState,
} from 'react-native';
import authReducers from './store/reducers/authReducers';
import appReducers from './store/reducers/appReducers';
import {URL} from './socketURL';
import Colors from './contants/Colors';
import Fonts from './contants/Fonts';
import AsyncStorage from '@react-native-community/async-storage';
import MessageModal from './Modal/MessageModal'

const rootReducer = combineReducers({
  authReducer: authReducers,
  appReducer: appReducers,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

import AppNavigator from './navigation/AppNavigator';

const App: () => React$Node = () => {

  return (
    <Provider store={store}>
      <Root>
        <AppNavigator />
      </Root>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
