import React, {useEffect} from 'react';
import {useFonts} from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import {ThemeProvider} from '@/hooks/useTheme';
import NavigationStack from '@/navigation/NavigationStack';
import Toast from 'react-native-toast-message';
import {toastConfig} from '@/helper/toastConfig';
import { Buffer } from 'buffer';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/helper/notification';
import { pushNotification } from './services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {
  const [loaded, error] = useFonts({
    Outfit: require('./assets/fonts/PublicSans-Regular.ttf'),
    OutfitMedium: require('./assets/fonts/PublicSans-Medium.ttf'),
    OutfitSemiBold: require('./assets/fonts/PublicSans-SemiBold.ttf'),
    OutfitBold: require('./assets/fonts/PublicSans-Bold.ttf'),
    ...FontAwesome.font,
  });
global.Buffer = Buffer;
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }
  Notifications.setNotificationHandler({
  handleNotification: async () => ({
       shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
 useEffect(() => {
    registerForPushNotificationsAsync().then(async token => {
      if (token) {
        await AsyncStorage.setItem('notificationToken', token);
      }
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);


  return ( 
    <ThemeProvider>
      <NavigationStack />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
