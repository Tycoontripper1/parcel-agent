import { DriverStackList } from './navigationType';
import { useNavigationState } from '@react-navigation/native';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@/hooks/useTheme';
import DriversHistory from '@/screens/drivers/DriversHistory';
import DriversDetails from '@/screens/drivers/driversDetails';
import DriversScreen from '@/screens/DriversScreen';
import NotificationsScreen from '@/screens/home/NotificationScreen';

const Driver = createStackNavigator<DriverStackList>();

interface Props {
  navigation: any;
}

const DriverStack = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const state = useNavigationState((s) => s);

  useEffect(() => {
    const isNestedRoute = state?.index && state.index > 0;

    navigation?.setOptions({
      tabBarStyle: isNestedRoute
        ? { display: 'none', backgroundColor: theme.background }
        : {
            height: 75,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: RFValue(10),
          },
    });
  }, [state, navigation]);

  return (
    <Driver.Navigator
      initialRouteName="DriversScreen"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Driver.Screen name="DriversScreen" component={DriversScreen} />
      <Driver.Screen name="DriversHistory" component={DriversHistory} />
      <Driver.Screen name="DriversDetails" component={DriversDetails} />
      <Driver.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Driver.Navigator>
  );
};

export default DriverStack;
