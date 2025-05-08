import {AccountStackList} from './navigationType';
import {useNavigationState} from '@react-navigation/native';
import {useEffect} from 'react';
import {color} from '@/constants/Colors';
import {createStackNavigator} from '@react-navigation/stack';
import ComingSoon from '@/screens/ComingSoon';
import SettingsPage from '@/screens/SettingsScreen';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from '@/hooks/useTheme';
import NotificationsScreen from '@/screens/home/NotificationScreen';
import AccountInformation from '@/screens/account/account-information/AccountInformation';
import AccountEditProfile from '@/screens/account/account-information/account-information-type/Account-EditProfile';
import AccountChangePassword from '@/screens/account/account-information/account-information-type/Account-ChangePassword';
import ParcelUpdates from '@/screens/account/parcel-updates/ParcelUpdates';
import OverdueParcel from '@/screens/account/overdue-parcel/OverdueParcel';
import HomeAndSupport from '@/screens/account/home-support/HomeSupport';
const Account = createStackNavigator<AccountStackList>();

interface Props {
  navigation: any;
}
const AccountStack = ({navigation}: Props) => {
  const {theme} = useTheme();

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
  return (
    <Account.Navigator
      initialRouteName='Settings'
      screenOptions={{
        headerMode: 'float',
        headerShown: false,
        headerBackgroundContainerStyle: {backgroundColor: theme.background},
        gestureEnabled: true,
      }}>
      <Account.Screen
        name='Settings'
        component={SettingsPage}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='NotificationsScreen'
        component={NotificationsScreen}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='AccountInformation'
        component={AccountInformation}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='AccountEditProfile'
        component={AccountEditProfile}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='AccountChangePassword'
        component={AccountChangePassword}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='ParcelUpdates'
        component={ParcelUpdates}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='OverdueParcel'
        component={OverdueParcel}
        options={{headerShown: false}}
      />
      <Account.Screen
        name='HomeAndSupport'
        component={HomeAndSupport}
        options={{headerShown: false}}
      />
    </Account.Navigator>
  );
};

export default AccountStack;
