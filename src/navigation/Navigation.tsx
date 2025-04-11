import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '@/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList, RootTabParamList} from './navigationType';
import AuthStack from './AuthStack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Activity,
  Add,
  Chart,
  EmptyWallet,
  Home2,
  Profile,
  ProfileCircle,
  UserAdd,
  Wallet,
} from 'iconsax-react-native';
import {color} from '@/constants/Colors';
import {Feather} from '@expo/vector-icons';
import HomeStack from './HomeStack';
import WalletStack from './WalletStack';
import ReportStack from './ReportStack';
import DriverStack from './DriverStack';
import AccountStack from './AccountStack';
import {StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from '@/hooks/useTheme';

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
          <Stack.Screen name='RootTabStack' component={RootTabStack} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='AuthStacks' component={AuthStack} />
          <Stack.Screen name='RootTabStack' component={RootTabStack} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default Navigation;

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const RootTabStack = () => {
  const {theme} = useTheme();
  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        title: '',
        headerShown: false,
        tabBarActiveTintColor: theme.secondary,
        tabBarInactiveTintColor: theme.text,
        tabBarIcon: ({focused, color}) => {
          if (route.name === 'HomeStack') {
            return focused ? (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <Home2 size={24} color={color} variant='Bulk' />
              </View>
            ) : (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <Home2 size={24} color={color} variant='Outline' />
              </View>
            );
          }
          if (route.name === 'DriverStack') {
            return focused ? (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <UserAdd size={24} color={color} variant='Bulk' />
              </View>
            ) : (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <UserAdd size={24} color={color} variant='Outline' />
              </View>
            );
          }
          if (route.name === 'WalletStack') {
            return focused ? (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <EmptyWallet size={24} color={color} variant='Bulk' />
              </View>
            ) : (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <EmptyWallet size={24} color={color} variant='Outline' />
              </View>
            );
          }
          if (route.name === 'AccountStack') {
            return focused ? (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <ProfileCircle size={24} color={color} variant='Bulk' />
              </View>
            ) : (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <ProfileCircle size={24} color={color} variant='Outline' />
              </View>
            );
          }
          if (route.name === 'ReportStack') {
            return focused ? (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <Activity size={24} color={color} variant='Bulk' />
              </View>
            ) : (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <Activity size={24} color={color} variant='Outline' />
              </View>
            );
          }
        },
      })}>
      <BottomTab.Screen
        name='HomeStack'
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <BottomTab.Screen
        name='WalletStack'
        component={WalletStack}
        options={{
          tabBarLabel: 'Wallet',
        }}
      />

      <BottomTab.Screen
        name='ReportStack'
        component={ReportStack}
        options={{
          tabBarLabel: 'Reports',
        }}
      />
      <BottomTab.Screen
        name='DriverStack'
        component={DriverStack}
        options={{
          tabBarLabel: 'Add Driver',
        }}
      />

      <BottomTab.Screen
        name='AccountStack'
        component={AccountStack}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activeTab: {
    borderTopWidth: 2, // Active border
    borderTopColor: color.secondaryColor,
    position: 'absolute',
    top: -5, // Aligns over the global border
    left: 0,
    right: 0,
    height: '100%',
    paddingTop: 10,
  },
});
