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
import {RootStackParamList} from './navigationType';
import AuthStack from './AuthStack';

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
          <Stack.Screen name='AuthStacks' component={AuthStack} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='AuthStacks' component={AuthStack} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default Navigation;
