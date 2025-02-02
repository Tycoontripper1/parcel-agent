import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  RootTabStack: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  Onboarding: undefined;
  AuthStacks: NavigatorScreenParams<AuthStackParamList>;
  HomeStacks: NavigatorScreenParams<HomeStackList>;
  WalletStack: NavigatorScreenParams<WalletStackList>;
  AccountStack: NavigatorScreenParams<AccountStackList>;
  DriverStack: NavigatorScreenParams<DriverStackList>;
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
export type HomeStackList = {
  Dashboard: undefined;
  ComingSoon: undefined;
  Shipments: undefined;
  NotificationScreen: undefined;
  NotificationDetails: {id: any};
};
export type WalletStackList = {
  Wallet: undefined;
  ComingSoon: undefined;
};
export type AccountStackList = {
  Account: undefined;
  ComingSoon: undefined;
  Settings: undefined;
};
export type ReportStackList = {
  Reports: undefined;
  ComingSoon: undefined;
};
export type DriverStackList = {
  Drivers: undefined;
  ComingSoon: undefined;
};

export type RootTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackList>;
  WalletStack: NavigatorScreenParams<WalletStackList>;
  ReportStack: NavigatorScreenParams<ReportStackList>;
  AccountStack: NavigatorScreenParams<AccountStackList>;
  DriverStack: NavigatorScreenParams<DriverStackList>;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
