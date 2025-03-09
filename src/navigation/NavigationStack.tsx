import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './Navigation';
// import {StatusBar} from 'expo-status-bar';
import { StatusBar } from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import {Provider} from 'react-redux';
import {store} from '@/redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const NavigationStack = () => {
  const {theme} = useTheme();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
          <Navigation />
          <StatusBar  barStyle="dark-content" backgroundColor={theme.background} />
        </GestureHandlerRootView>
      </NavigationContainer>
    </Provider>
  );
};

export default NavigationStack;
