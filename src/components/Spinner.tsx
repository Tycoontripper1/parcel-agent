import {useTheme} from '@/hooks/useTheme';
import React from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

interface SpinnerProps {
  /** Spinner size (default: 'large') */
  size?: 'small' | 'large';

  /** Custom color for the spinner (optional) */
  color?: string;

  /** Optional message to display alongside the spinner */
  message?: string;
  width?: any;
  height?: any;
}

const Spinner = ({
  size = 'large',
  color,
  message,
  width,
  height,
}: SpinnerProps) => {
  const {theme} = useTheme(); // Access the theme context

  // If a custom color is provided, use it. Otherwise, use the color from the theme.
  const spinnerColor = color || theme.primary || '#007bff'; // Default to theme color or fallback to blue

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.card,
          {width: width ? width : 100, height: height ? height : 'auto'},
        ]}>
        <ActivityIndicator size={size} color={spinnerColor} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
    zIndex: 1000, // Ensure overlay is above other content
  },
  card: {
    backgroundColor: '#fff',
    padding: RFValue(22),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  message: {
    marginTop: 10,
    fontSize: RFValue(12),
    color: '#333',
    textAlign: 'center',
  },
});

export default Spinner;
