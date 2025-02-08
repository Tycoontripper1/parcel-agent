import React from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '@/hooks/useTheme'; // Adjust path as needed
import Text from './Text'; // Use your custom Text component for consistency

interface ButtonProps {
  /** Button text */
  title: string;

  /** Is the button disabled? */
  disabled?: boolean;

  /** Callback when the button is pressed */
  onPress: () => void;

  /** Background color (overrides theme primary color) */
  backgroundColor?: string;

  /** Text color (overrides theme text color) */
  textColor?: string;

  /** Additional styles for the button */
  style?: ViewStyle;
  /** Additional styles for the button */
  buttonIcon?: React.ReactNode;
}

const ButtonHome = ({
  title,
  disabled,
  onPress,
  backgroundColor,
  textColor,
  style,
  buttonIcon,
}: ButtonProps) => {
  const {theme} = useTheme(); // Access the theme

  // Fallback to theme colors if not provided
  const buttonBackgroundColor = backgroundColor || theme.primary;
  const buttonTextColor = textColor || theme.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {backgroundColor: disabled ? '#F5F5F5' : buttonBackgroundColor},
        style,
      ]}
      disabled={disabled}>
      {buttonIcon}
      <Text style={{color: buttonTextColor}} bold>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});

export default ButtonHome;
