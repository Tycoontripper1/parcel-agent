import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import {RFValue} from 'react-native-responsive-fontsize';

interface LoaderProps {
  /** Loader size (default: 'large') */
  size?: 'small' | 'large';

  /** Custom loader color (optional) */
  color?: string;
}

const Loader = ({size = 'large', color}: LoaderProps) => {
  const {theme} = useTheme(); // Access theme from the context

  // Use the color from props if provided, otherwise default to theme.primary
  const loaderColor = color || theme.primary;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={loaderColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(20),
  },
});

export default Loader;
