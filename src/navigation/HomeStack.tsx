import { HomeStackList } from "./navigationType";
import { useNavigationState } from "@react-navigation/native";
import { useEffect } from "react";
import { color } from "@/constants/Colors";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "@/screens/DashboardScreen";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/hooks/useTheme";
import ShipmentHistory from "@/screens/home/ShipmentHistory";
import NotificationsScreen from "@/screens/home/NotificationScreen";
import NotificationDetails from "@/screens/home/NotificationDetails";
import ScreenOne from "@/screens/home/parcel/parcel-in-sender/ScreenOne";
import ScreenTwo from "@/screens/home/parcel/parcel-in-sender/ScreenTwo";
import ParcelPreviewScreen from "@/screens/home/parcel/parcel-in-sender/ParcelPreviewScreen";
import ParcelType from "@/screens/home/parcel/parcel-in-driver/ParcelType";
import SearchParcel from "@/screens/home/parcel/parcel-in-driver/SearchParcel";
import ParcelDriverPreviewScreen from "@/screens/home/parcel/parcel-in-driver/ParcelDriverPreview";
import ParcelCongratulation from "@/screens/home/parcel/ParcelCongratulation";
import ParcelInDriverUnRegistered from "@/screens/home/parcel/parcel-in-driver/parcel-in-driver-un-registered/ParcelInDriverUnRegistered";
import ParcelInDriverUnRegisteredPreviewScreen from "@/screens/home/parcel/parcel-in-driver/parcel-in-driver-un-registered/ParcelInDriverUnRegisteredPreviewScreen";
import ParcelDriverOutPreviewScreen from "@/screens/home/parcel/parcel-out-driver/ParcelDriverOutPreviewScreen";
import SearchParcelOut from "@/screens/home/parcel/parcel-out-driver/SearchParcelOut";
import SearchParcelOutDriverId from "@/screens/home/parcel/parcel-out-driver/SearchParcelOutDriverId";
import SearchParcelOutReceiver from "@/screens/home/parcel/parcel-out-receiver/SearchParcelOutReceiver";
import ReceiverType from "@/screens/home/parcel/parcel-out-receiver/ReceiverType";
import ParcelReceiverOutPreviewScreen from "@/screens/home/parcel/parcel-out-receiver/ParcelReceiverOutPreviewScreen";
import ParcelOtpVerificationReceiver from "@/screens/home/parcel/parcel-out-receiver/receiver/ParcelOtpVerificationReceiver";
import ParcerOutReceiver from "@/screens/home/parcel/parcel-out-receiver/receiver/ParcelOutReceiver";
import ParcelOutReceiver from "@/screens/home/parcel/parcel-out-receiver/receiver/ParcelOutReceiver";
import PrintParcel from "@/components/PrintParcel";
import PrintParcelItem from "@/components/printParcelItem";
import BarcodeScannerScreen from "@/components/BarcodeScannerScreen";
import ComfirmationDriver from "@/components/confirmationDriver";
import TransactionHistory from "@/components/TransactionHistory";
import DriversScreen from "@/screens/DriversScreen";
const Home = createStackNavigator<HomeStackList>();

interface Props {
  navigation: any;
}
const HomeStack = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const state = useNavigationState((s) => s);

  useEffect(() => {
    if (state?.routes[0].state?.index && state.routes[0].state.index > 0) {
      navigation?.setOptions({
        tabBarStyle: {
          // display: "none",
          backgroundColor: theme.background,
        },
      });
    } else {
      navigation?.setOptions({
        tabBarStyle: {
          height: 75,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          paddingBottom: RFValue(10),
        },
      });
    }
  }, [state, navigation]);
  return (
    <Home.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerMode: "float",
        headerShown: false,
        headerBackgroundContainerStyle: { backgroundColor: theme.background },
        gestureEnabled: true,
      }}
    >
      <Home.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="Shipments"
        component={ShipmentHistory}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="NotificationScreen"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="NotificationDetails"
        component={NotificationDetails}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelInSender"
        component={ScreenOne}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelInSenderTwo"
        component={ScreenTwo}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelInSenderPreview"
        component={ParcelPreviewScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelInDriver"
        component={ParcelType}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelInDriverSearchParcel"
        component={SearchParcel}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelInDriverPreview"
        component={ParcelDriverPreviewScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelInDriverUnRegistered"
        component={ParcelInDriverUnRegistered}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelInDriverUnRegisteredPreview"
        component={ParcelInDriverUnRegisteredPreviewScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ScreenOneParcelOutDriver"
        component={SearchParcelOut}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="SearchParcelOutDriverId"
        component={SearchParcelOutDriverId}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelDriverOutPreviewScreen"
        component={ParcelDriverOutPreviewScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelOtpVerificationReceiver"
        component={ParcelOtpVerificationReceiver}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="SearchParcelOutReceiver"
        component={SearchParcelOutReceiver}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ReceiverType"
        component={ReceiverType}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelReceiverOutPreviewScreen"
        component={ParcelReceiverOutPreviewScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelOutReceiver"
        component={ParcelOutReceiver}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ParcelCongratulation"
        component={ParcelCongratulation}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="PrintParcel"
        component={PrintParcel}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="PrintParcelItem"
        component={PrintParcelItem}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="BarcodeScannerScreen"
        component={BarcodeScannerScreen}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="ComfirmationDriver"
        component={ComfirmationDriver}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{ headerShown: false }}
      />
      <Home.Screen
        name="DriversScreen"
        component={DriversScreen}
        options={{ headerShown: false }}
      />
    </Home.Navigator>
  );
};

export default HomeStack;
