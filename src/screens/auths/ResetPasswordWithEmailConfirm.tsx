import {TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@/hooks/useTheme';
import Header from '@/components/share/Header';
import KeyBoardView from '@/components/KeyBoardView';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Input, Spinner, Text} from '@/components';
import {color} from '@/constants/Colors';
import {MaterialIcons} from '@expo/vector-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {Helper} from '@/helper/helper';
import {AuthStackParamList} from '@/navigation/navigationType';

type Props = NativeStackScreenProps<AuthStackParamList>;

const ResetPasswordWithEmailConfirm = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);

  const {theme} = useTheme();
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // 6-digit numeric OTP
  const handleValidation = () => {
    let isValid = true;

    // Email validation
    if (!otp) {
      setOtpError('OTP is required.');
      isValid = false;
    } else if (otp.length < 4) {
      setOtpError('Please enter a valid OTP.');
      isValid = false;
    } else {
      setOtpError('');
    }

    return isValid;
  };

  const handleSentOTP = () => {
    if (!handleValidation()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Helper.vibrate();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP Successfully',
      });
      navigation.replace('ResetPasswordComplete', {
        otp: otp,
      });
    }, 2000);
  };
  // Styles
  const $container: ViewStyle = {
    flex: 1,
    backgroundColor: theme.background,
  };
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(20),
    flexDirection: 'column',
    gap: 6,
  };
  const $cardHeader: ViewStyle = {
    paddingVertical: RFValue(10),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
  };

  return (
    <View style={$container}>
      {loading && <Spinner />}

      {/* Top Section */}
      <Header title='Password Recovery' />

      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Reset your Password
          </Text>
          <Text size={14} color={color.textGray}>
            Confirm your One Time Password
          </Text>
        </View>
        <View style={$cardHeader}>
          {/* Email Input */}
          <Input
            label='OTP'
            placeholder='Enter OTP'
            placeholderTextColor='#B8C2CC'
            value={otp}
            onChangeText={setOtp}
            LeftIcon={
              <MaterialIcons name='mail-outline' size={18} color={color.gray} />
            }
            errorMessage={otpError}
            onChange={handleValidation}
            keyboardType='numeric'
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingBottom: 20,
          }}>
          <Text size={12}>Didn’t get an email?</Text>
          <TouchableOpacity>
            <Text size={12} color={theme.secondary}>
              Resend OTP
            </Text>
          </TouchableOpacity>
          <Text>CountDown</Text>
        </View>
        <View style={$buttonsContainer}>
          <Button
            title='Confirm'
            onPress={handleSentOTP}
            style={{height: 50}}
          />
        </View>
      </KeyBoardView>
    </View>
  );
};

export default ResetPasswordWithEmailConfirm;
