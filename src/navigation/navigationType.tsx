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
  HomeStack: NavigatorScreenParams<HomeStackList>;
  WalletStack: NavigatorScreenParams<WalletStackList>;
  AccountStack: NavigatorScreenParams<AccountStackList>;
  DriverStack: NavigatorScreenParams<DriverStackList>;
  ReportStack: NavigatorScreenParams<ReportStackList>;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AuthStackParamList = {
  Login: undefined;
  Settings: undefined;
  ResetMethod: undefined;
  ResetPasswordWithEmail: undefined;
  ResetPasswordWithPhone: undefined;
  ResetPasswordWithEmailConfirm: {email: string};
  ResetPasswordWithPhoneConfirm: {phone: string};
  ResetPasswordComplete: {otp: string};
  CreateAccountScreen: undefined;
  OTPVerificationScreen: {phone: string};
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
  DriversScreen: undefined;
  ComingSoon: undefined;
  TransactionHistory: undefined;
  PrintParcel: undefined;
  PrintParcelItem: undefined;
  ComfirmationDriver: undefined;
  Shipments: undefined;
  NotificationScreen: undefined;
  NotificationDetails: {id: any};
  ScreenOneParcelInSender: undefined;
  ScreenOneParcelInSenderTwo: undefined;
  ScreenOneParcelInSenderPreview: undefined;
  ScreenOneParcelInSenderThree: undefined;
  ScreenOneParcelInDriver: undefined;
  ScreenOneParcelInDriverSearchParcel: undefined;
  ScreenOneParcelInDriverPreview: undefined;
  ParcelInDriverUnRegistered: undefined;
  ParcelInDriverUnRegisteredPreview: undefined;
  ScreenOneParcelOutReceiver: undefined;
  ScreenOneParcelOutDriver: undefined;
  SearchParcelOutDriverId: undefined;
  ParcelDriverOutPreviewScreen: undefined;
  SearchParcelOutReceiver: undefined;
  ReceiverType: undefined;
  ParcelReceiverOutPreviewScreen: undefined;
  ParcelOutReceiver: {readOnly:boolean};
  ParcelOtpVerificationReceiver: {readonly:boolean};
  ParcelCongratulation: {message: string, note: string};
  BarcodeScannerScreen: undefined;
  UnAssignParcelDetails: {item: any};
};
export type WalletStackList = {
  Wallet: undefined;
  WalletScreen: undefined;
  TransactionHistory: undefined;
  NotificationsScreen: undefined;
  WalletEarnings: undefined;
  WalletToWallet: undefined;
  WithdrawToBankScreen: undefined;
  InputWithdrawAmountScreen:{
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };
  ComingSoon: undefined;
};
export type AccountStackList = {
  Account: undefined;
  ComingSoon: undefined;
  NotificationsScreen: undefined;
  AccountInformation: undefined;
  AccountEditProfile: undefined;
  AccountChangePassword: undefined;
  HomeAndSupport: undefined;
  OverdueParcel: undefined;
  ParcelUpdates: undefined;
  Settings: undefined;
  RaiseDispute: undefined;
  Support: undefined;
  Feedback: undefined;
};
export type ReportStackList = {
  Reports: undefined;
  ComingSoon: undefined;
  Reportscreen: undefined;
  Shipments: undefined;
  AssignParcelHistory: undefined;
  AssignParcelDetails: {id: any};
  OverdueParcelHistory: undefined;
  OverdueParcelDetails: {id: any};
  ParcelcollectedDetails: {id:any};
  ParcelCollectedHistory: undefined;
  UnAssignParcelHistory: {data: any, label:string};
  UnAssignParcelDetails: {item: any};
  UnpaidParcelHistory: undefined;
  UnPaidParcelDetails: {id: any};
  ReceivedParcelHistory: undefined;
  PrintParcel: undefined;
  PrintParcelItem: undefined;
  ReceiverType: undefined;
ParcelOutReceiver: {readOnly:boolean};
ParcelOtpVerificationReceiver: {readonly:boolean};
  ParcelCongratulation: {message: string, note: string};
    HomeShipmentHistory: {
    searchQuery: string;
    onViewAll: () => void;
    limit?: number;
  };
};
export type DriverStackList = {
  Drivers: undefined;
  ComingSoon: undefined;
  DriversHistory: undefined;
  DriversScreen: undefined;
  NotificationsScreen: undefined;
  ScreenOne: undefined;
  FacialVerification: undefined;
  FrontImageScreenDriver: undefined;
  BackImageScreenDriver: undefined;
  PreviewScreenDriver: undefined;
  DriversDetails: {id: any};
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
