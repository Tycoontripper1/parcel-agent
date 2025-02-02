import React, {useCallback, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackList} from '@/navigation/navigationType';
import {CustomView, Text} from '@/components';
import HomeHeader from '@/components/share/HomeHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import {ArrowRight2} from 'iconsax-react-native';
import {color} from '@/constants/Colors';
import NotificationIcon from '@/components/svg/NotificationIcon';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

type Props = NativeStackScreenProps<HomeStackList>;

const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Parcel Assigned to Driver',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '2',
    title: 'Wallet Credited',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '3',
    title: 'Wallet Debited',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '4',
    title: 'Parcel Assigned to Driver',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '5',
    title: 'Wallet Credited',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '01-10-2024',
    time: '01:30 PM',
  },
  {
    id: '6',
    title: 'Wallet Debited',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '01-10-2024',
    time: '01:30 PM',
  },
];

const NotificationsScreen = ({navigation}: Props) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false); // End the refreshing state
    }, 1500);
  }, []);
  const renderNotification = ({item}: {item: NotificationItem}) => (
    <View style={styles.notificationCard}>
      <View>
        <NotificationIcon />
      </View>
      <View style={{flexBasis: '90%'}}>
        <View
          style={{
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#E9EAEB',
          }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 10,
            paddingHorizontal: 10,
          }}>
          <Text style={styles.timestamp}>
            {item.date} • {item.time}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NotificationDetails', {id: item.id})
            }
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.viewText} size={12} font='SemiBold'>
              View
            </Text>
            <ArrowRight2 size={16} color={color.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <CustomView style={{flex: 1}}>
      {/* Header */}
      <View style={{padding: RFValue(16)}}>
        <HomeHeader type='Stack' title='Notifications' />
      </View>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={
                Platform.OS === 'android'
                  ? [color.primary, color.inputColor, 'blue']
                  : undefined
              } // Android spinner colors
              tintColor={Platform.OS === 'ios' ? color.primary : undefined} // iOS spinner color
            />
          }
        />
      </View>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9', marginVertical: 10},

  list: {paddingHorizontal: 16, paddingVertical: 16},
  notificationCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  title: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  description: {fontSize: 14, color: '#666', marginVertical: 8},
  timestamp: {fontSize: 12, color: '#999'},
  viewText: {color: color.secondary},
});

export default NotificationsScreen;
