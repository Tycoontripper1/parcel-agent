import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export interface IStoreButton {
  label: string;
  count: number;
  icon?: React.ReactNode;
  url?: string;
}

interface StoreButtonsProps {
  buttons: IStoreButton[];
}

const buttonColors = ['#F7FFF4', '#FFF6ED', '#F7F9FC', '#E8FDEF', "#F8F9FC","#FEE8E6"]; // Example colors

const StoreButton = ({buttons}: StoreButtonsProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.parcelButtonsContainer}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          onPress={() => {
            if (button.url) {
              navigation.navigate('ReportStack', {screen: button.url as never}); // Ensure correct typing
            }
          }}
          key={index}
          style={[
            styles.parcelButton,
            {backgroundColor: buttonColors[index % buttonColors.length]}, // Assign dynamic color
          ]}>
          <View
            style={{flexDirection: 'column', gap: RFValue(20), }}>
            <Text style={styles.parcelText} color='#252B37'>
              {button.count}
            </Text>
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
    width: width / 3 - RFValue(16),
    backgroundColor: '#f0f0f0',
    padding: RFValue(8),
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    
  },
  parcelText: {
    fontSize: RFValue(24),
    fontWeight: 500
  },
  parcelLabel: {
    fontSize: RFValue(10),
    color:"#A4A7AE"
  },
});

export default StoreButton;
