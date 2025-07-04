import { color } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Text from './Text';

type BottomSheetDatePickerProps = {
  label: string;
  placeholder: string;
  errorMessage?: string;
  onSelect: (date: Date) => void;
   formatDate?: (date: Date) => string; // <-- new prop
};

const BottomSheetDatePicker = ({
  label,
  placeholder,
  errorMessage,
  onSelect,
  formatDate,
}: BottomSheetDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();

  const handleChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') setIsModalVisible(false);
    if (date) {
      setSelectedDate(date);
      onSelect(date);
    }
  };

  const inputContainer: ViewStyle = {
    height: RFValue(45),
    borderWidth: 1,
    borderColor: errorMessage ? color.errorColor : "#D5D7DA",
    borderRadius: RFValue(8),
    gap: RFValue(2),
    paddingHorizontal: RFValue(10),
    backgroundColor: theme.background,
    flexDirection: 'row',
    alignItems: 'center',
  };

  return (
    <View style={{ marginVertical: RFValue(10) }}>
      <Text style={styles.label}>{label}</Text>
   <TouchableOpacity style={inputContainer} onPress={() => setIsModalVisible(true)}>
  <Ionicons name='calendar' size={20} color={color.inputColor} style={{ marginRight: RFValue(8) }} />
  <Text style={styles.placeholder}>
    {selectedDate
      ? formatDate
        ? formatDate(selectedDate)
        : selectedDate.toDateString()
      : placeholder}
  </Text>
</TouchableOpacity>


      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.bottomSheet, { backgroundColor: theme.background }]}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color={color.black} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            style={{ backgroundColor: theme.background }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default BottomSheetDatePicker;

const styles = StyleSheet.create({
  label: {
    fontSize: RFValue(14),
    color: '#131927',
    marginBottom: RFValue(5),
  },
  placeholder: {
    fontSize: RFValue(14),
    color: '#A0AEC0',
  },
  error: {
    fontSize: RFValue(12),
    color: color.errorColor,
    marginTop: RFValue(5),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: RFValue(16),
    borderTopRightRadius: RFValue(16),
    padding: RFValue(16),
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: color.allWhite,
    borderRadius: 5, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});
