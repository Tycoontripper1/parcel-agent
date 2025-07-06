import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type TransferErrorModalProps = {
  visible: boolean;
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
  amount: number | string;
  recipient: string;
};

const TransferErrorModal: React.FC<TransferErrorModalProps> = ({ 
  visible,
  errorMessage,
  onRetry,
  onCancel,
  amount,
  recipient
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <View style={styles.modalOverlay}>
      <Animated.View style={[styles.modalContainer, {
        transform: [{ scale: scaleValue }]
      }]}>
        {/* Error Icon */}
        <View style={styles.errorIconContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
        </View>

        {/* Title */}
        <Text style={styles.modalTitle}>Transfer Failed</Text>

        {/* Error Message */}
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>₦{amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To:</Text>
            <Text style={styles.detailValue}>{recipient}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.retryButton]}
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  errorIconContainer: {
    backgroundColor: '#FFEBEE',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF3B30',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontSize: 16,
  },
  detailsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#888',
    fontSize: 16,
  },
  detailValue: {
    fontWeight: '500',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  retryButton: {
    backgroundColor: '#47104C',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TransferErrorModal;
// Usage in your component
