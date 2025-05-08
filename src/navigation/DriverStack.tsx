import { DriverStackList } from "./navigationType";
import { useNavigationState } from "@react-navigation/native";
import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/hooks/useTheme";
import DriversHistory from "@/screens/drivers/DriversHistory";
import DriversDetails from "@/screens/drivers/driversDetails";
import DriversScreen from "@/screens/DriversScreen";
import NotificationsScreen from "@/screens/home/NotificationScreen";
import ScreenOne from "@/screens/drivers/add-drivers/ScreenOne";
import FacialVerification from "@/screens/drivers/add-drivers/ScreenTwo";
import FrontImageScreenDriver from "@/screens/drivers/add-drivers/FrontImageScreen";
import BackImageScreenDriver from "@/screens/drivers/add-drivers/BackImageScreen";
import PreviewScreenDriver from "@/screens/drivers/add-drivers/PreviewScreenDriver";

const Driver = createStackNavigator<DriverStackList>();

interface Props {
  navigation: any;
}

const DriverStack = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const state = useNavigationState((s) => s);
  useEffect(() => {
    if (state?.routes[0].state?.index && state.routes[0].state.index > 0) {
      navigation?.setOptions({
        tabBarStyle: {
          
          backgroundColor: theme.background,
        },
      });
    } else {
      navigation?.setOptions({
        tabBarStyle: {
          height: 75,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: RFValue(10),
        },
      });
    }
  }, [state, navigation]);

  // useEffect(() => {
  //   const currentRoute = state?.routes.find((r) => r.name === "DriverStack")?.state?.routes?.at(-2)?.name; 
  //   console.log(currentRoute, "route"); // Now this should log the actual active screen inside DriverStack
  
  //   if (currentRoute === "DriversScreen") {
  //     navigation?.setOptions({
  //       tabBarStyle: {
  //         height: 75,
  //         backgroundColor: theme.background,
  //         borderTopWidth: 1,
  //         borderTopColor: "#e0e0e0",
  //         paddingBottom: RFValue(10),
  //       },
  //     });
  //   } else {
  //     navigation?.setOptions({
  //       tabBarStyle: { display: "none" },
  //     });
  //   }
  // }, [state, navigation]);
  
  

  return (
    <Driver.Navigator
      initialRouteName="DriversScreen"
      screenOptions={{
        headerShown: false,
        headerMode: "float",
        headerBackgroundContainerStyle: { backgroundColor: theme.background },
        gestureEnabled: true,
      }}
    >
      <Driver.Screen options={{headerShown: false}} name="DriversScreen" component={DriversScreen}  />
      <Driver.Screen options={{headerShown: false}} name="DriversHistory" component={DriversHistory} />
      <Driver.Screen options={{headerShown: false}} name="DriversDetails" component={DriversDetails} />
      <Driver.Screen
        options={{headerShown: false}} name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Driver.Screen
        options={{headerShown: false}} name="ScreenOne"
        component={ScreenOne}
      />
      <Driver.Screen
        options={{headerShown: false}} name="FacialVerification"
        component={FacialVerification}
      />
      <Driver.Screen
        name="FrontImageScreenDriver"
        component={FrontImageScreenDriver}
      />
      <Driver.Screen
        name="BackImageScreenDriver"
        component={BackImageScreenDriver}
      />
      <Driver.Screen
        name="PreviewScreenDriver"
        component={PreviewScreenDriver}
      />
    </Driver.Navigator>
  );
};

export default DriverStack;
