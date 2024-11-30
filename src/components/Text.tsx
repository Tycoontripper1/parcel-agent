import {useTheme} from '@/hooks/useTheme';
import React from 'react';
import {Text as RNText, StyleSheet, TextStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

interface TextProps {
  /** The text content */
  children: React.ReactNode;

  /** Additional styles for the text */
  style?: TextStyle;

  /** Font size multiplier (default: 14) */
  size?: number;

  /** Color of the text (default: theme.text) */
  color?: string;

  /** Is the text bold? */
  bold?: boolean;

  /** Font type (e.g., 'Regular', 'Bold', 'Medium', etc.) */
  font?: 'Regular' | 'Bold' | 'Medium' | 'SemiBold';
}

const Text = ({
  children,
  style,
  size = 14,
  color,
  bold = false,
  font = 'Regular', // Default font is Regular
}: TextProps) => {
  const {theme} = useTheme(); // Get the current theme

  // Use theme.text as default color if none is provided
  const textColor = color || theme.text;

  // Map font types to the corresponding font family
  const fontFamilyMap = {
    Regular: 'Outfit',
    Bold: 'OutfitBold',
    Medium: 'OutfitMedium',
    SemiBold: 'OutfitSemiBold',
  };

  return (
    <RNText
      style={[
        styles.text,
        {
          fontSize: RFValue(size),
          color: textColor,
          fontWeight: bold ? 'bold' : 'normal',
          fontFamily: fontFamilyMap[font], // Dynamically apply the font
        },
        style,
      ]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(14),
    color: '#000', // Fallback color
  },
});

export default Text;
