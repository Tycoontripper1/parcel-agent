import {WalletStackList} from './navigationType';
import {useNavigationState} from '@react-navigation/native';
import {useEffect} from 'react';
import {color} from '@/constants/Colors';
import {createStackNavigator} from '@react-navigation/stack';
import ComingSoon from '@/screens/ComingSoon';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from '@/hooks/useTheme';
import WalletScreen from '@/screens/Wallet';
import TransactionHistory from '@/components/TransactionHistory';
import WalletEarnings from '@/screens/wallets/Earnings';
import NotificationsScreen from '@/screens/home/NotificationScreen';
import WithdrawToBankScreen from '@/screens/wallets/payment/wallet-bank/WithdrawToBankScreen';
import InputWithdrawAmountScreen from '@/screens/wallets/payment/wallet-bank/WithdrawAmount';

const Wallet = createStackNavigator<WalletStackList>();

interface Props {
  navigation: any;
}
const WalletStack = ({navigation}: Props) => {
  const {theme} = useTheme();

  const state = useNavigationState((s) => s);

  useEffect(() => {
    if (state?.routes[1].state?.index && state.routes[1].state.index > 0) {
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
    <Wallet.Navigator
      initialRouteName='WalletScreen'
      screenOptions={{
        headerMode: 'float',
        headerShown: false,
        headerBackgroundContainerStyle: {backgroundColor: theme.background},
        gestureEnabled: true,
      }}>
      <Wallet.Screen
        name='WalletScreen'
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Wallet.Screen
        name='ComingSoon'
        component={ComingSoon}
        options={{headerShown: false}}
      />
      <Wallet.Screen
        name='TransactionHistory'
        component={TransactionHistory}
        options={{headerShown: false}}
      />
      <Wallet.Screen
        name='WalletEarnings'
        component={WalletEarnings}
        options={{headerShown: false}}
      />
      <Wallet.Screen
        name='NotificationsScreen'
        component={NotificationsScreen}
        options={{headerShown: false}}
      />
      <Wallet.Screen
        name='WithdrawToBankScreen'
        component={WithdrawToBankScreen}
        options={{headerShown: false}}
      />
      <Wallet.Screen
        name='InputWithdrawAmountScreen'
        component={InputWithdrawAmountScreen}
        options={{headerShown: false}}
      />
    </Wallet.Navigator>
  );
};

export default WalletStack;
