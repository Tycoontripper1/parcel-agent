import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@/screens/auths/LoginScreen';
import SettingsPage from '@/screens/SettingsScreen';
import ResetPasswordMethod from '@/screens/auths/ResetPasswordMethod';
import ResetPasswordWithEmail from '@/screens/auths/RestPasswordWithEmail';
import ResetPasswordWithEmailConfirm from '@/screens/auths/ResetPasswordWithEmailConfirm';
import ResetPasswordComplete from '@/screens/auths/ResetPasswordComplete';
import ResetPasswordWithPhone from '@/screens/auths/ResetPasswordWithPhone';
import ResetPasswordWithPhoneConfirm from '@/screens/auths/ResetPasswordWithPhoneConfirm';
import CreateAccountScreen from '@/screens/auths/CreateAccountScreen';
import OTPVerificationScreen from '@/screens/auths/OTPVerificatiionScreen';
import BusinessInfoScreen from '@/screens/auths/BusinessInfoScreen';
import IdentityVerificationScreen from '@/screens/auths/IdentityVerificationScreen';
import PreviewScreen from '@/screens/auths/PreviewScreen';
import BackImageScreen from '@/screens/auths/BackImageScreen';
import FrontImageScreen from '@/screens/auths/FrontImageSCreen';
import FacialVerification from '@/screens/auths/FacialVerification';
import CongratulationScreen from '@/screens/auths/CongratulationScreen';
import {AuthStackParamList} from './navigationType';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen
          name='CreateAccountScreen'
          component={CreateAccountScreen}
        />
        <Stack.Screen
          name='OTPVerificationScreen'
          component={OTPVerificationScreen}
        />
        <Stack.Screen
          name='BusinessInfoScreen'
          component={BusinessInfoScreen}
        />
        <Stack.Screen
          name='IdentityVerificationScreen'
          component={IdentityVerificationScreen}
        />
        <Stack.Screen name='FrontImageScreen' component={FrontImageScreen} />
        <Stack.Screen name='BackImageScreen' component={BackImageScreen} />
        <Stack.Screen name='PreviewScreen' component={PreviewScreen} />
        <Stack.Screen
          name='FacialVerification'
          component={FacialVerification}
        />
        <Stack.Screen
          name='CongratulationScreen'
          component={CongratulationScreen}
        />
        <Stack.Screen name='ResetMethod' component={ResetPasswordMethod} />
        <Stack.Screen
          name='ResetPasswordWithEmail'
          component={ResetPasswordWithEmail}
        />
        <Stack.Screen
          name='ResetPasswordWithPhone'
          component={ResetPasswordWithPhone}
        />
        <Stack.Screen
          name='ResetPasswordWithEmailConfirm'
          component={ResetPasswordWithEmailConfirm}
        />
        <Stack.Screen
          name='ResetPasswordWithPhoneConfirm'
          component={ResetPasswordWithPhoneConfirm}
        />
        <Stack.Screen
          name='ResetPasswordComplete'
          component={ResetPasswordComplete}
        />
        <Stack.Screen name='Settings' component={SettingsPage} />
      </Stack.Navigator>
    </>
  );
};

export default AuthStack;
