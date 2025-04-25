import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export interface IFinanceButton {
  label: string;
  amount: string;
}

interface FinanceButtonsProps {
  buttons: IFinanceButton[];
}


const FinanceButton = ({buttons}: FinanceButtonsProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.parcelButtonsContainer}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.parcelButton,
          ]}>
          <View
            style={{flexDirection: 'column', gap:16 }}>
            <Text style={styles.parcelText} color='#A4A7AE'>
              {button.label}
            </Text>
            <Text style={styles.parcelLabel} font='Regular' size={12}>
              {button.amount}
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
    backgroundColor: "#F7FFF4",
    borderRadius:RFValue(16),
    padding:RFValue(8)
  },
  parcelButton: {
    width: width / 2 - RFValue(30),

    backgroundColor: '#FFFFFF',
    padding: RFValue(8),
    borderRadius: RFValue(12),
    borderWidth: 1,
    borderColor:"#E9EAEB",
    marginVertical: RFValue(10),
    
  },
  parcelText: {
    fontSize: RFValue(10),
  },
  parcelLabel: {
    fontSize: RFValue(12),
    color:"#252B37"
  },
});

export default FinanceButton;
