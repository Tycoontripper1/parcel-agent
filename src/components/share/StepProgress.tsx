// components/StepProgress.tsx
import {color} from '@/constants/Colors';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface StepProgressProps {
  step: number; // Current step
  totalSteps: number; // Total steps
}

const StepProgress = ({step, totalSteps}: StepProgressProps) => {
  return (
    <View style={styles.container}>
      {/* Step Text */}
      <Text style={styles.stepText}>
        {step} of {totalSteps} steps
      </Text>

      {/* Step Indicators */}
      <View style={styles.stepsContainer}>
        {Array.from({length: totalSteps}, (_, index) => (
          <View key={index} style={styles.stepItem}>
            {/* Line Before Step */}
            {index > 0 && (
              <>
                {step >= index + 1 ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.lineActive} />
                    <View style={styles.lineActive} />
                    <View style={styles.lineActive} />
                  </View>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.line} />
                    <View style={styles.line} />
                    <View style={styles.line} />
                  </View>
                )}
              </>
            )}
            {/* Circle */}
            {step >= index + 1 ? (
              <View
                style={[
                  styles.circle,
                  styles.activeCircle, // Highlight the current step
                ]}>
                <Feather name='check' size={14} color={'#fff'} />
              </View>
            ) : (
              <View style={[styles.circle]}>
                <Text style={{fontSize: 12, fontWeight: 400}}>{index + 1}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E9EAEB',
    marginHorizontal: 4,
  },
  lineActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#12B76A',
    opacity: 0.4,
    marginHorizontal: 4,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E9EAEB',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    borderColor: '#32CD32',
    backgroundColor: '#32CD32',
  },
});

export default StepProgress;
