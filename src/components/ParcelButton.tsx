import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export interface IParcelButton {
  label: string;
  type: string;
  icon?: React.ReactNode;
  url?: string;
}

interface ParcelButtonsProps {
  buttons: IParcelButton[];
}

const buttonColors = ['#F7F9FC', '#F7FFF4', '#F4F3FF', '#FFF6ED']; // Example colors

const ParcelButton = ({buttons}: ParcelButtonsProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.parcelButtonsContainer}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          onPress={() => {
            if (button.url) {
              navigation.navigate('HomeStack', {screen: button.url as never}); // Ensure correct typing
            }
          }}
          key={index}
          style={[
            styles.parcelButton,
            {backgroundColor: buttonColors[index % buttonColors.length]}, // Assign dynamic color
          ]}>
          <View
            style={{flexDirection: 'column', gap: 10, alignItems: 'center'}}>
            <Text style={styles.parcelText} color='#717680'>
              Parcel-{button.type}
            </Text>
            <View>{button.icon}</View>
            <Text style={styles.parcelLabel} font='SemiBold'>
              {button.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  parcelButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  parcelButton: {
    width: width / 2 - RFValue(24),
    backgroundColor: '#f0f0f0',
    padding: RFValue(16),
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    alignItems: 'center',
  },
  parcelText: {
    fontSize: RFValue(14),
  },
  parcelLabel: {
    fontSize: RFValue(14),
  },
});

export default ParcelButton;
