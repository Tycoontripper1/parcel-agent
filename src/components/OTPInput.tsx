import React, {useState, useEffect, useRef} from 'react';
import {View, TextInput, StyleSheet, Keyboard} from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
}

const OTPInput = ({value, onChange}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Sync external `value` prop with OTP state
  useEffect(() => {
    if (value.length === otp.length) {
      setOtp(value.split(''));
    }
  }, [value]);

  // Poll clipboard for changes
  useEffect(() => {
    const checkClipboard = async () => {
      const content = await Clipboard.getStringAsync();
      if (/^\d{4}$/.test(content)) {
        setOtp(content.split(''));
        onChange(content);
        Keyboard.dismiss(); // Dismiss keyboard after pasting
      }
    };

    const interval = setInterval(checkClipboard, 1000);
    return () => clearInterval(interval);
  }, [onChange]);

  const handleChange = (input: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = input;

    // Move focus to the next input if typing
    if (input && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    // Update OTP state and trigger callback
    setOtp(updatedOtp);
    onChange(updatedOtp.join(''));
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus(); // Move focus to previous input if backspacing
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            keyboardType='numeric'
            maxLength={1}
            style={styles.otpInput}
            onChangeText={(input) => handleChange(input, index)}
            ref={(ref) => (otpRefs.current[index] = ref)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#22215B',
    backgroundColor: '#FFFFFF',
  },
});

export default OTPInput;
