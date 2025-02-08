import {TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import {CustomView, Spinner, Text} from '@/components';
import BackButton from '@/components/share/BackButton';
import KeyBoardView from '@/components/KeyBoardView';
import {RFValue} from 'react-native-responsive-fontsize';
import {HomeStackList} from '@/navigation/navigationType';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';

type Props = NativeStackScreenProps<HomeStackList>;
const ParcelType = ({navigation}: Props) => {
  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: 'column',
    gap: 6,
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}} padded>
      <BackButton onClick={() => navigation.goBack()} />
      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Parcel In-Driver
          </Text>
        </View>
        <View style={$bodyHeader}>
          <Text font='Medium' size={18}>
            What kind of Parcel are you receiving?
          </Text>
        </View>
        <View style={{flexDirection: 'column', gap: 20, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ParcelInDriverUnRegistered')}
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FDFDFD',
              borderWidth: 1,
              borderColor: '#D5D7DA',
              borderRadius: 10,
            }}>
            <Text size={14} font='Medium'>
              New/Unregistered Parcel
            </Text>
            <Ionicons name='arrow-forward' size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ScreenOneParcelInDriverSearchParcel')
            }
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FDFDFD',
              borderWidth: 1,
              borderColor: '#D5D7DA',
              borderRadius: 10,
            }}>
            <Text size={14} font='Medium'>
              Existing/Registered Parcel
            </Text>
            <Ionicons name='arrow-forward' size={20} />
          </TouchableOpacity>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ParcelType;
