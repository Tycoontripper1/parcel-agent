import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

interface IBackButton {
  onClick?: () => void;
}
const BackButton = (p: IBackButton) => {
  return (
    <TouchableOpacity
      onPress={p.onClick}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        width: 38,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginHorizontal: RFValue(10),
      }}>
      <Ionicons name='arrow-back-outline' size={16} />
    </TouchableOpacity>
  );
};

export default BackButton;
