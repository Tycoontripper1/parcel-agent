import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@/screens/auths/LoginScreen';
import SettingsPage from '@/screens/SettingsScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export type RootStackParamList = {
  Login: undefined;
  Settings: undefined;
  Onboarding: undefined;
  ResetMethod: undefined;
  ResetPasswordWithEmail: undefined;
  ResetPasswordWithPhone: undefined;
  ResetPasswordWithEmailConfirm: undefined;
  ResetPasswordWithPhoneConfirm: {phone: string};
  ResetPasswordComplete: {otp: string};
  CreateAccountScreen: undefined;
  OTPVerificationScreen: undefined;
  BusinessInfoScreen: undefined;
  IdentityVerificationScreen: undefined;
  FrontImageScreen: undefined;
  BackImageScreen: undefined;
  PreviewScreen: undefined;
  FacialVerification: undefined;
  CongratulationScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(value === 'true');
      setIsLoading(false);
    };

    checkOnboarding();
  }, []);

  if (isLoading) return null; // Render a loading screen if necessary

  return (
    <>
      {!hasSeenOnboarding ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='Onboarding' component={OnboardingScreen} />
        </Stack.Navigator>
      ) : (
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
      )}
    </>
  );
};

export default Navigation;
