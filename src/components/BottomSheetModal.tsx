import { color } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Text from './Text';

type BottomSheetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const BottomSheetModal = ({ isVisible, onClose, title, children }: BottomSheetModalProps) => {
  const { theme } = useTheme();

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.bottomSheet, { backgroundColor: theme.background }]}>
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.header}>
          <Text style={styles.modalTitle}>{title || ''}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={color.black} />
          </TouchableOpacity>
        </View>

        {children}
      </View>
    </Modal>
  );
};

export default BottomSheetModal;

const styles = StyleSheet.create({
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
