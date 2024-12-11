import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Settings: undefined;
  Onboarding: undefined;
  AuthStacks: NavigatorScreenParams<AuthStackParamList>;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AuthStackParamList = {
  Login: undefined;
  Settings: undefined;
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
