import React from 'react';
import {Button, Text, TouchableOpacity} from 'react-native';
import {View} from '@/components/Themed';

export const ProfileScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 10,
          marginTop: 10,
        }}>
        <Text style={{fontSize: 18, color: 'white'}}>Logout with Azure</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
