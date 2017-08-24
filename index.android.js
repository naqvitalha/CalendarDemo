/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import OutlookRoot from './src/OutlookRoot';

//Everything starts from here, registering app component which'll launch initially
AppRegistry.registerComponent('CalenderDemo', () => OutlookRoot);
