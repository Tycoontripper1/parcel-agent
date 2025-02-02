import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Text from '../Text';
import {color} from '@/constants/Colors';
import {Avatar} from '../../../assets/images';
import NotificationIcon from '../svg/NotificationIcon';

interface IHeader {
  title?: string;
  type?: 'Stack' | 'Home';
  children?: React.ReactNode;
  OnNotificationClick?: () => void;
}
const HomeHeader = ({title, type, children, OnNotificationClick}: IHeader) => {
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
          <View style={{width: 24}}>
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
              }}>
              <Image
                source={Avatar}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                  borderRadius: 20,
                }}
              />
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
