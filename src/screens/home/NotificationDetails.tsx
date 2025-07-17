// screens/NotificationDetails.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { format, subDays } from 'date-fns';
import {HomeStackList} from '@/navigation/navigationType';
import {NotificationItem} from './NotificationScreen';
import {CustomView} from '@/components';
import HomeHeader from '@/components/share/HomeHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import { getAllNotification } from '../../../services/auth';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackList>;
  route: RouteProp<HomeStackList, 'NotificationDetails'>;
}



const NotificationDetails = ({route}: Props) => {
  const {id} = route.params;
  const [notificationsData, setNotifications] = useState<NotificationItem[]>([]);


useFocusEffect(
  useCallback(() => {
    const fetchNotification = async () => {
      // Get current date
      const currentDate = new Date();
      
      // Calculate date 7 days ago
      const sevenDaysAgo = subDays(currentDate, 7);
      
      // Format dates as YYYY-MM-DD strings
      const endDate = format(currentDate, 'yyyy-MM-dd');
      const startDate = format(sevenDaysAgo, 'yyyy-MM-dd');

      //('Fetching notifications from', startDate, 'to', endDate);
      
      const notification = await getAllNotification(startDate, endDate);
      setNotifications(notification?.data.details || []);
    };
    
    fetchNotification();
  }, [])
);
  
  const notification = notificationsData.find((x) => x.id === id);

  return (
    <CustomView style={{flex: 1}}>
      {/* Header */}
      <View style={{padding: RFValue(16)}}>
        <HomeHeader type='Stack' title='Notifications Details' />
      </View>
      <KeyboardAvoidingView
        style={{paddingTop: 20}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          keyboardShouldPersistTaps='handled'>
          <View style={styles.container}>
            <Text style={styles.title}>{notification?.title}</Text>
            <Text style={styles.message}>{notification?.content}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9', padding: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16},
  message: {fontSize: 16, color: '#666'},
});

export default NotificationDetails;
