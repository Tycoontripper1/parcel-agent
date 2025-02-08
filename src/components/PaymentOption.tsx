import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Ionicons} from '@expo/vector-icons';
import {color} from '@/constants/Colors';

interface IPaymentOption {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  onPress: () => void;
}
const PaymentOption = ({
  selectedOption,
  setSelectedOption,
  onPress,
}: IPaymentOption) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Select Payment Option</Text>

      {/* Online Option */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSelectedOption('Online')}>
        <View style={styles.row}>
          <Text style={styles.optionText}>Online (Bank Transfer)</Text>
          <Ionicons
            name={
              selectedOption === 'Online'
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={RFValue(20)}
            color={selectedOption === 'Online' ? '#9EE87F' : '#9EE87F'}
          />
        </View>
        {selectedOption === 'Online' && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <Text style={styles.detailValue}>7065738250</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank</Text>
              <Text style={styles.detailValue}>Seerbit</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Name</Text>
              <Text style={styles.detailValue}>Chimark Logistics</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Cash/Card Option */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSelectedOption('Cash')}>
        <View style={styles.row}>
          <Text style={styles.optionText}>Cash/Card (POS) Payment</Text>
          <Ionicons
            name={
              selectedOption === 'Cash' ? 'radio-button-on' : 'radio-button-off'
            }
            size={RFValue(20)}
            color={selectedOption === 'Cash' ? '#9EE87F' : '#9EE87F'}
          />
        </View>
      </TouchableOpacity>

      {/* Confirm Button */}
      <TouchableOpacity onPress={onPress} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: RFValue(14),
    color: '#7B8794',
    marginBottom: RFValue(6),
  },
  optionContainer: {
    backgroundColor: '#F7F9FC',
    borderRadius: RFValue(8),
    padding: RFValue(12),
    marginBottom: RFValue(16),
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: '#000',
  },
  detailsContainer: {
    marginTop: RFValue(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(8),
  },
  detailLabel: {
    fontSize: RFValue(12),
    color: '#717680',
  },
  detailValue: {
    fontSize: RFValue(12),
    fontWeight: '600',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: color.primary,
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: RFValue(14),
    fontWeight: '400',
    color: '#000',
  },
});

export default PaymentOption;
