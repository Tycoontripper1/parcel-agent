// screens/NotificationDetails.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HomeStackList} from '@/navigation/navigationType';
import {NotificationItem} from './NotificationScreen';
import {CustomView} from '@/components';
import HomeHeader from '@/components/share/HomeHeader';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackList>;
  route: RouteProp<HomeStackList, 'NotificationDetails'>;
}

const notificationsData: NotificationItem[] = [
  {
    id: '1',
    title: 'Parcel Assigned to Driver',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,

    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '2',
    title: 'Wallet Credited',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '3',
    title: 'Wallet Debited',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,

    date: '01-10-2024',
    time: '01:30 PM',
  },
];

const NotificationDetails = ({route}: Props) => {
  const {id} = route.params;
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
            <Text style={styles.description}>{notification?.description}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9', padding: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16},
  description: {fontSize: 16, color: '#666'},
});

export default NotificationDetails;
