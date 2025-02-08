import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Text from './Text';
import {useTheme} from '@/hooks/useTheme';
import {Ionicons} from '@expo/vector-icons';
import {color} from '@/constants/Colors';

interface InputProps extends TextInputProps {
  /** Placeholder for the input */
  placeholder?: string;

  /** Keyboard Type for the input */
  keyboardType?: TIKeyboardType;

  /** Label for the input */
  label?: string;

  /** Type for the input */
  type?: TInputType;

  /** Error message */
  errorMessage?: string;

  /** Left icon (e.g., email or lock icon) */
  LeftIcon?: React.ReactNode;

  /** Right icon (e.g., password eye toggle) */
  RightIcon?: React.ReactNode;
}

type IIconType = 'password' | 'email' | 'calendar';
type TInputType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'password'
  | 'date'
  | 'time';
type TIKeyboardType =
  | 'default'
  | 'numeric'
  | 'email-address'
  | 'ascii-capable'
  | 'numbers-and-punctuation'
  | 'url'
  | 'number-pad'
  | 'phone-pad'
  | 'name-phone-pad'
  | 'decimal-pad'
  | 'twitter'
  | 'web-search'
  | 'visible-password';

const TextAreaInput = ({
  placeholder,
  label,
  errorMessage,
  LeftIcon,
  RightIcon,
  type,
  keyboardType,
  ...props
}: InputProps) => {
  const {theme} = useTheme(); // Access the theme
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Password visibility state

  // Handle password eye icon toggle
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          {borderColor: errorMessage ? color.errorColor : color.allWhite},
        ]}>
        {/* Left Icon */}
        {LeftIcon && <View style={styles.iconLeft}>{LeftIcon}</View>}

        {/* Input Field */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              color: theme.text,
            },
          ]}
          numberOfLines={10}
          multiline={true}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={theme.secondary}
          secureTextEntry={
            type === 'password' ? (isPasswordVisible ? false : true) : false
          } // Toggle password visibility
          {...props}
        />

        {/* Right Icon */}
        {type === 'password' ? (
          <TouchableOpacity
            onPress={handleTogglePasswordVisibility}
            style={styles.iconRight}>
            {RightIcon ? (
              RightIcon
            ) : errorMessage ? (
              <View>
                <Ionicons
                  name='information-circle-outline'
                  size={18}
                  color={color.errorColor}
                />
                {/* Default icons */}
              </View>
            ) : (
              <View>
                {isPasswordVisible ? (
                  <Ionicons name='eye-outline' size={18} color={color.gray} />
                ) : (
                  <Ionicons
                    name='eye-off-outline'
                    size={18}
                    color={color.gray}
                  />
                )}
                {/* Default icons */}
              </View>
            )}
          </TouchableOpacity>
        ) : errorMessage ? (
          <View>
            <Ionicons
              name='information-circle-outline'
              size={18}
              color={color.errorColor}
            />
            {/* Default icons */}
          </View>
        ) : (
          RightIcon && <View style={styles.iconRight}>{RightIcon}</View>
        )}
      </View>

      {/* Error Message */}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: RFValue(14),
    marginBottom: 5,
    color: '#7B8794',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 3,
    height: RFValue(200),
    textAlignVertical: 'top',
    fontSize: RFValue(14),
    fontFamily: 'Outfit',
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  error: {
    fontSize: RFValue(12),
    marginTop: 5,
    color: 'red', // Error message color
  },
});

export default TextAreaInput;
