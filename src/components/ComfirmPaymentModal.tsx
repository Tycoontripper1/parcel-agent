import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Ionicons} from '@expo/vector-icons';

interface IConfirm {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalVisible: boolean;
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
}
const ConfirmPaymentModal = ({
  setModalVisible,
  selectedOption,
  setSelectedOption,
  modalVisible,
}: IConfirm) => {
  return (
    <Modal transparent visible={modalVisible} animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <Text style={styles.title}>Confirm Payment</Text>

          {/* Question */}
          <Text style={styles.question}>
            Have you received payment to your wallet?
          </Text>

          {/* Yes Option */}
          <TouchableOpacity
            style={[
              styles.optionContainer,
              selectedOption === 'Yes' && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption('Yes')}>
            <Text style={styles.optionText}>Yes</Text>
            <Ionicons
              name={
                selectedOption === 'Yes'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={RFValue(20)}
              color={selectedOption === 'Yes' ? '#9EE87F' : '#9EE87F'}
            />
          </TouchableOpacity>

          {/* No Option */}
          <TouchableOpacity
            style={[
              styles.optionContainer,
              selectedOption === 'No' && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption('No')}>
            <Text style={styles.optionText}>No</Text>
            <Ionicons
              name={
                selectedOption === 'No' ? 'radio-button-on' : 'radio-button-off'
              }
              size={RFValue(20)}
              color={selectedOption === 'No' ? '#9EE87F' : '#9EE87F'}
            />
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedOption && styles.disabledButton,
            ]}
            disabled={!selectedOption}
            onPress={() => {
              setModalVisible(false);
              console.log('Selected option:', selectedOption);
            }}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: RFValue(12),
    padding: RFValue(28),
  },
  title: {
    fontSize: RFValue(16),
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: RFValue(8),
  },
  question: {
    fontSize: RFValue(14),
    color: '#717680',
    marginBottom: RFValue(16),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: RFValue(8),
    padding: RFValue(12),
    marginBottom: RFValue(12),
    width: '100%',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  selectedOption: {
    borderColor: '#38D178',
  },
  optionText: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: '#1A1A1A',
  },
  confirmButton: {
    backgroundColor: '#9EE87F',
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#C4C4C4',
  },
  confirmButtonText: {
    fontSize: RFValue(14),
    fontWeight: '400',
    color: '#000',
  },
});

export default ConfirmPaymentModal;
