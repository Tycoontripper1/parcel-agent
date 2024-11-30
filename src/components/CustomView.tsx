import {useTheme} from '@/hooks/useTheme';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context'; // Make sure to install react-native-safe-area-context

interface ViewProps {
  /** Content inside the container */
  children: React.ReactNode;

  /** Additional styles for the container */
  style?: ViewStyle;

  /** Should the container be padded? */
  padded?: boolean;

  /** Optionally override the background color */
  backgroundColor?: string;
}

const CustomView = ({
  children,
  style,
  padded = false,
  backgroundColor,
}: ViewProps) => {
  const {theme} = useTheme(); // Access the current theme

  return (
    <SafeAreaView
      style={[
        styles.container,
        padded && styles.padded,
        {backgroundColor: backgroundColor || theme.background}, // Use theme background or override
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    padding: RFValue(10),
  },
});

export default CustomView;
