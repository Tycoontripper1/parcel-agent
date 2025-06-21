// components/AnimatedModal.tsx
import React, { ReactNode, useEffect, useRef } from 'react';
import { Modal, Animated, TouchableWithoutFeedback, View, StyleSheet, Easing } from 'react-native';

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: 'scale' | 'fade' | 'slide';
  backdropOpacity?: number;
}

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: 'scale' | 'fade' | 'slide';
  backdropOpacity?: number;
  animationDuration?: number; // New prop for duration control
}

const AnimatedModal = ({
  visible,
  onClose,
  children,
  animationType = 'scale',
  backdropOpacity = 0.5,
  animationDuration = 400, // Default duration (ms)
}: AnimatedModalProps) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset values when becoming visible
      scaleValue.setValue(animationType === 'scale' ? 0.7 : 1);
      fadeValue.setValue(0);
      
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          damping: 15, // Increased damping for slower bounce
          mass: 0.8, // Added mass for more natural movement
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: animationDuration,
          easing: Easing.out(Easing.cubic), // Smoother easing
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: animationType === 'scale' ? 0.7 : 1,
          duration: animationDuration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: animationDuration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animationType, animationDuration]);

  const getAnimationStyle = () => {
    const styles = {
      opacity: fadeValue,
    };

    if (animationType === 'scale') {
      return {
        ...styles,
        transform: [{ scale: scaleValue }],
      };
    }

    if (animationType === 'slide') {
      return {
        ...styles,
        transform: [{
          translateY: fadeValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }],
      };
    }

    return styles;
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[
          styles.backdrop,
          { opacity: fadeValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, backdropOpacity]
          })}
        ]} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, getAnimationStyle()]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none', // Allows taps to pass through to backdrop
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AnimatedModal;