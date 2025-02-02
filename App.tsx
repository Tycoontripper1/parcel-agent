import React, {useEffect} from 'react';
import {useFonts} from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import {ThemeProvider} from '@/hooks/useTheme';
import NavigationStack from '@/navigation/NavigationStack';
import Toast from 'react-native-toast-message';
import {toastConfig} from '@/helper/toastConfig';

export default function App() {
  const [loaded, error] = useFonts({
    Outfit: require('./assets/fonts/PublicSans-Regular.ttf'),
    OutfitMedium: require('./assets/fonts/PublicSans-Medium.ttf'),
    OutfitSemiBold: require('./assets/fonts/PublicSans-SemiBold.ttf'),
    OutfitBold: require('./assets/fonts/PublicSans-Bold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider>
      <NavigationStack />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
