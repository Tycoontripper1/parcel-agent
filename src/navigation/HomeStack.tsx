import {HomeStackList} from './navigationType';
import {useNavigationState} from '@react-navigation/native';
import {useEffect} from 'react';
import {color} from '@/constants/Colors';
import {createStackNavigator} from '@react-navigation/stack';
import DashboardScreen from '@/screens/DashboardScreen';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from '@/hooks/useTheme';
import ShipmentHistory from '@/screens/home/ShipmentHistory';
import NotificationsScreen from '@/screens/home/NotificationScreen';
import NotificationDetails from '@/screens/home/NotificationDetails';

const Home = createStackNavigator<HomeStackList>();

interface Props {
  navigation: any;
}
const HomeStack = ({navigation}: Props) => {
  const {theme} = useTheme();
  const state = useNavigationState((s) => s);

  useEffect(() => {
    if (state?.routes[0].state?.index && state.routes[0].state.index > 0) {
      navigation?.setOptions({
        tabBarStyle: {
          display: 'none',
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
  return (
    <Home.Navigator
      initialRouteName='Dashboard'
      screenOptions={{
        headerMode: 'float',
        headerShown: false,
        headerBackgroundContainerStyle: {backgroundColor: theme.background},
        gestureEnabled: true,
      }}>
      <Home.Screen
        name='Dashboard'
        component={DashboardScreen}
        options={{headerShown: false}}
      />
      <Home.Screen
        name='Shipments'
        component={ShipmentHistory}
        options={{headerShown: false}}
      />
      <Home.Screen
        name='NotificationScreen'
        component={NotificationsScreen}
        options={{headerShown: false}}
      />
      <Home.Screen
        name='NotificationDetails'
        component={NotificationDetails}
        options={{headerShown: false}}
      />
    </Home.Navigator>
  );
};

export default HomeStack;
