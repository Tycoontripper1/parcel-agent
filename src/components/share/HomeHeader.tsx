import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { use, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import Text from '../Text';
import { color } from '@/constants/Colors';
import { Avatar } from '../../../assets/images';
import NotificationIcon from '../svg/NotificationIcon';
import { getUser } from '../../../services/auth';
import { UserDetails } from '@/utils/interface';
import { getImage } from '../../../services/upload';
import { set } from 'date-fns';
export const apiKey = Constants.expoConfig?.extra?.apiKey;


interface IHeader {
  title?: string;
  type?: 'Stack' | 'Home';
  children?: React.ReactNode;
  OnNotificationClick?: () => void;
}
const HomeHeader = ({ title, type, children, OnNotificationClick }: IHeader) => {
  const [userDetail, setUserDetails] = useState<UserDetails | null>(null);
const [userImage, setUserImage] = useState({
    uri: '',
    mimetype: ''
})

  const BASEURL = "http://45.9.191.184:8001/parcel/v1.0/api/files/"
  useEffect(() => {
  const fetchUser = async () => {
    const userDetails = await getUser();
    console.log(userDetails, 'userDetails');
    setUserDetails(userDetails);
  };

  fetchUser();
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
                  // source={{ uri: "http://45.9.191.184:8001/parcel/v1.0/api/files?slugs=1748597450257-635253387-my-pic.png"}}
                  source={{ uri: userDetail?.userImage}}
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
            <NotificationIcon />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default HomeHeader;
