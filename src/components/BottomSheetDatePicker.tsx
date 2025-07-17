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
  formatDate?: (date: Date) => string;
  initialDate?: Date;
};

const BottomSheetDatePicker = ({
  label,
  placeholder,
  errorMessage,
  onSelect,
  formatDate,
  initialDate,
}: BottomSheetDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // Added missing state declaration
  const { theme } = useTheme();

  const handleChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false); // Hide the Android picker after selection
    }
    setIsModalVisible(false); // Hide iOS modal after selection
    if (date) {
      setSelectedDate(date);
      onSelect(date);
    }
  };

  const showDatePicker = () => {
    if (Platform.OS === 'android') {
      setShowPicker(true); // Show Android system picker
    } else {
      setIsModalVisible(true); // Show iOS custom modal
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
      <TouchableOpacity 
        style={inputContainer} 
        onPress={showDatePicker}
      >
        <Ionicons 
          name='calendar' 
          size={20} 
          color={color.inputColor} 
          style={{ marginRight: RFValue(8) }} 
        />
        <Text style={styles.placeholder}>
          {selectedDate
            ? formatDate
              ? formatDate(selectedDate)
              : selectedDate.toLocaleDateString()
            : placeholder}
        </Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {/* Android Date Picker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}

      {/* iOS Custom Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={[styles.bottomSheet, { backgroundColor: theme.background }]}>
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>
            <View style={styles.header}>
              <Text font="SemiBold" size={16}>
                Select Date
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={color.black} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="spinner"
              onChange={handleChange}
              textColor={theme.text}
              // themeVariant={theme.mode === 'dark' ? 'dark' : 'light'}
            />
          </View>
        </Modal>
      )}
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
});