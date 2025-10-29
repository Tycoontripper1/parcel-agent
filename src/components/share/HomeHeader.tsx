import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { use, useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import Text from '../Text';
import { color } from '@/constants/Colors';
import { Avatar } from '../../../assets/images';
import NotificationIcon from '../svg/NotificationIcon';
import { getAllNotification, getUser, getUserProfile } from '../../../services/auth';
import { UserDetails } from '@/utils/interface';
import { getImage } from '../../../services/upload';
import { format, set, subDays } from 'date-fns';
export const apiKey = Constants.expoConfig?.extra?.apiKey;


interface IHeader {
  title?: string;
  type?: 'Stack' | 'Home';
  children?: React.ReactNode;
  OnNotificationClick?: () => void;
}
export interface NotificationItem {
  id: string;
  title: string;
  content?: string;
  isRead?: boolean;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
}
const HomeHeader = ({ title, type, children, OnNotificationClick }: IHeader) => {
  const [userDetail, setUserDetails] = useState<UserDetails | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
const [userImage, setUserImage] = useState({
    uri: '',
    mimetype: ''
})

  const BASEURL = "https://api.parcelpointng.com:4001/parcel/v1.0/files"
//   useEffect(() => {
//   const fetchUser = async () => {
//     const userDetails = await getUser();
//     //(userDetails, 'userDetails');
//     setUserDetails(userDetails);
//   };

//   fetchUser();
// }, []);                                                                                                                                                                                                                                                                                                                                                                                                                      
    const fetchUserProfile = async () => {
      try {
        const result = await getUserProfile();
        const rows = result?.data?.details || [];
        setUserDetails(rows);

    console.log(rows)
        //(rows, 'User Profile Data');
      
      } catch (error) {
        // console.error('Failed to fetch user:', error);
      }
    };  
    useEffect(() => {
      fetchUserProfile();
    }, []);

// Run once on mount
useEffect(() => {
  const fetchImage = async () => {
    const userimage = [userDetail?.userImage]
    const response = await getImage([userDetail?.userImage as string]);
    setUserImage(prev => ({
...prev,
uri: response.data.details[0].uri,
mimetype: response.data.details[0].mimetype
}))
  };

  fetchImage();
}, []); // Run once on mount

 useFocusEffect(
    useCallback(() => {
      const fetchNotification = async () => {
        // Get current date
        const currentDate = new Date();

        // Calculate date 7 days ago
        const sevenDaysAgo = subDays(currentDate, 7);

        // Format dates as YYYY-MM-DD strings
        const endDate = format(currentDate, "yyyy-MM-dd");
        const startDate = format(sevenDaysAgo, "yyyy-MM-dd");

        const notification = await getAllNotification(startDate, endDate);
        setNotifications(notification?.data.details || []);
      };

      fetchNotification();
    }, [])
  );


const unreadCount = notifications?.filter((n:any) => !n.isRead).length;




  const navigation = useNavigation();
  return (
    <>
      {type === 'Stack' ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ width: 24 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 38,
                width: 38,
                backgroundColor: '#F5F5F5',
                
                borderRadius: 8,
              }}
              onPress={() => navigation.goBack()}>
              <Ionicons name='arrow-back-outline' size={16} />
            </TouchableOpacity>
          </View>
          <Text size={18} font='Medium'>
            {title}
          </Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 15,
            }}>
            <TouchableOpacity
              onPress={() => ''}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: color.IconNeutral,
              }}
            >
              
              {userDetail?.userImage ? (
                <Image
                 source={{ uri: `https://api.parcelpointng.com:4001/parcel/v1.0/files?slugs=${userDetail?.userImage}`}}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderRadius: 20,
                  }}
                />
              ) : (
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                  {userDetail?.firstName?.[0]?.toUpperCase() || ''}
                  {userDetail?.lastName?.[0]?.toUpperCase() || ''}
                </Text>
              )}
            </TouchableOpacity>

            {children}
          </View>
        <TouchableOpacity onPress={OnNotificationClick}>
 <View style={{ position: 'relative', width: 40, height: 40 }}>
        {/* Black circle with icon */}
        <View
          style={{
            backgroundColor: 'white',
            borderWidth: 1,

            borderColor: '#ccc',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="notifications-outline" size={22} color="black" />
        </View>

        {/* Red badge */}
        {unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: 2,
              backgroundColor: 'red',
              borderRadius: 8,
              width: 16,
              height: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default HomeHeader;
