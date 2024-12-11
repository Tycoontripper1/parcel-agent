import {Button, Spinner, Text} from '@/components';
import KeyBoardView from '@/components/KeyBoardView';
import OTPInput from '@/components/OTPInput';
import Header from '@/components/share/Header';
import {color} from '@/constants/Colors';
import {useTheme} from '@/hooks/useTheme';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, Alert, ViewStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import ResendOTP from './ResendOTP';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '@/navigation/navigationType';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList>;
  route: RouteProp<AuthStackParamList, 'ResetPasswordWithPhoneConfirm'>;
}

const ResetPasswordWithPhoneConfirm = ({navigation, route}: Props) => {
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp);
  };

  const handleSentOTP = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP sent successfully',
      });
    }, 2000);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `OTP confirm successfully, ${otp}`,
      });
      navigation.replace('ResetPasswordComplete', {
        otp: otp,
      });
    }, 2000);
  };
  const {theme} = useTheme();
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
            Enter the 4-digit code we sent to {route.params?.phone}
          </Text>
        </View>
        <View style={$cardHeader}>
          {/* Reusable OTP Input */}
          <OTPInput value={otp} onChange={handleOtpChange} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingBottom: 20,
          }}>
          <ResendOTP onResend={handleSentOTP} />
        </View>
        <View style={$buttonsContainer}>
          <Button
            title='Confirm'
            onPress={handleConfirm}
            style={{height: 50}}
          />
        </View>
      </KeyBoardView>
    </View>
  );
};

export default ResetPasswordWithPhoneConfirm;
