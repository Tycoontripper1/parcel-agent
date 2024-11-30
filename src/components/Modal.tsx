import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import {RFValue} from 'react-native-responsive-fontsize';

interface ModalProps {
  /** Determines if the modal is visible */
  visible: boolean;

  /** Function to close the modal */
  onClose: () => void;

  /** Modal content */
  children: React.ReactNode;

  /** Style for the modal container */
  containerStyle?: ViewStyle;
}

const Modal = ({visible, onClose, children, containerStyle}: ModalProps) => {
  const {theme} = useTheme(); // Access the theme

  return (
    <RNModal transparent={true} visible={visible} animationType='fade'>
      <View style={styles.overlay}>
        {/* Close modal when tapping on the backdrop */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.container,
            {backgroundColor: theme.background}, // Apply theme background
            containerStyle,
          ]}>
          {children}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    padding: RFValue(20),
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
  },
});

export default Modal;
