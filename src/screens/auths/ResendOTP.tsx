import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface ResendOTPProps {
  onResend: () => void;
}

const ResendOTP = ({onResend}: ResendOTPProps) => {
  const [timer, setTimer] = useState(120); // Initial time in seconds (2 minutes)
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend = () => {
    setIsResendDisabled(true);
    setTimer(120); // Restart the timer
    onResend(); // Trigger the resend OTP function
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      {isResendDisabled ? (
        <Text style={styles.timerText}>
          Resend OTP in:{' '}
          <Text style={styles.timerCountdown}>{formatTime(timer)}</Text>
        </Text>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <Text style={styles.resendText}>Didn't get OTP?</Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Click here to resend</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ResendOTP;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#555',
  },
  timerCountdown: {
    fontWeight: 'bold',
    color: '#FF6347', // Tomato color for the timer
  },
  resendText: {
    fontSize: 14,
    color: '#555',
  },
  resendLink: {
    fontWeight: 'bold',
    color: '#007BFF', // Blue link color
  },
});
