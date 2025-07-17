import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialStartDate = new Date(),
  initialEndDate = new Date(),
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const [startDate, setStartDate] = React.useState<Date>(initialStartDate);
  const [endDate, setEndDate] = React.useState<Date>(initialEndDate);
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);

  const renderBackdrop = useCallback(
    (props:any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(startDate, endDate);
    onClose();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>Select Date Range</Text>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateInput}>
            <Text style={styles.label}>From</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateText}>
                {format(startDate, 'MMM d, yyyy')}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={endDate}
                onChange={handleStartDateChange}
                style={styles.dateTimePicker}
              />
            )}
          </View>

          <View style={styles.dateInput}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateText}>
                {format(endDate, 'MMM d, yyyy')}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                minimumDate={startDate}
                maximumDate={new Date()}
                onChange={handleEndDateChange}
                style={styles.dateTimePicker}
              />
            )}
          </View>
        </View>

        <View style={styles.presetContainer}>
          <Text style={styles.presetTitle}>Quick Select</Text>
          <View style={styles.presetRow}>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                setStartDate(sevenDaysAgo);
                setEndDate(today);
              }}
            >
              <Text style={styles.presetText}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                const today = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(today.getDate() - 30);
                setStartDate(thirtyDaysAgo);
                setEndDate(today);
              }}
            >
              <Text style={styles.presetText}>Last 30 Days</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.presetRow}>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                const today = new Date();
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                setStartDate(threeMonthsAgo);
                setEndDate(today);
              }}
            >
              <Text style={styles.presetText}>Last 3 Months</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.presetButton}
              onPress={() => {
                const today = new Date();
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                setStartDate(oneYearAgo);
                setEndDate(today);
              }}
            >
              <Text style={styles.presetText}>Last Year</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton]} 
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
  container: {
    padding: 20,
    zIndex: 9999,
    elevation:9999,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  dateTimePicker: {
    height: Platform.OS === 'ios' ? 200 : undefined,
  },
  presetContainer: {
    marginBottom: 20,
  },
  presetTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  presetButton: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#213264',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DateRangePicker;