import {Button, CustomView, Spinner, Text} from '@/components';
import KeyBoardView from '@/components/KeyBoardView';
import OTPInput from '@/components/OTPInput';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {color} from '@/constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import ResendOTP from './ResendOTP';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {updateField} from '@/redux/slices/formSlice';
import {AuthStackParamList} from '@/navigation/navigationType';
import { getUser, resendOtp, verifyOtpAccount } from '../../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp,useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<AuthStackParamList>;
type RootStackParamList = {
  OTPVerificationScreen: {
    phone: string;
  };
};

type OTPRouteProp = RouteProp<RootStackParamList, 'OTPVerificationScreen'>;

const OTPVerificationScreen = ({navigation}: Props) => {
  const route = useRoute<OTPRouteProp>();
  const { phone } = route.params;
  const [email, setEmail] = useState('');
  const otp = useSelector((state: RootState) => state.form.otp);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await getUser();
      const email = userDetails?.email;
      setEmail(email)
      console.log(email, 'email');
    };
  
    fetchUser();
  }, []);

  const handleOtpChange = (newOtp: string) => {
    const updatedOtp = newOtp;
    dispatch(updateField({key: 'otp', value: updatedOtp}));
  };
  const [loading, setLoading] = useState(false);



  const handleTokenVerification = async () => {
    if (!otp || otp.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid 4-digit code.',
      });
      return;
    }
  
    setLoading(true);
        const userDetails =  await getUser();
        const email = userDetails?.email;
        const phone = userDetails?.phone;
        console.log(email, 'email');
  
    try {
      const payload = {
        otp,
        emailPhone: phone || email, 
        
        
        
      };
      console.log(payload, 'payload');
  
      const result = await verifyOtpAccount(payload);
      console.log('OTP verification result:', result);
  
      // Extract and store token and user details
      const token = result?.data?.token;
  
      if (token) {
        await AsyncStorage.setItem('token', token);
      }
  
      Toast.show({
        type: 'success',
        text1: 'Verified',
        text2: result?.data?.message || 'OTP verified successfully',
      });
      dispatch(updateField({key: 'otp', value: ""}));
  
      navigation.navigate('BusinessInfoScreen');
    } catch (error: any) {
      console.error('OTP verify error:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.message || 'Invalid or expired OTP',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSentOTP = async () => {
    setLoading(true);
    const userDetails =  await getUser();
    const email = userDetails?.email;
    const phone = userDetails?.phone;
 
    try {
      const payload = {
        emailPhone: phone || email, // Use phone or email based on your requirement
      };
  
      const result = await resendOtp(payload);
      console.log('OTP sent result:', result);
  
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: result?.message || 'OTP sent successfully',
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Failed to Send OTP',
        text2: error.message || 'Something went wrong while sending OTP',
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Styles
  const $bodyHeader: ViewStyle = {
    paddingVertical: RFValue(20),
    flexDirection: 'column',
    gap: 20,
  };
  const $cardHeader: ViewStyle = {
    paddingVertical: RFValue(10),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={2} totalSteps={5} />
      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Verify your number
          </Text>
          <Text size={14} color={color.textGray}>
            Enter the 4-digit code we sent to {email} and
            {phone}
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
            onPress={handleTokenVerification}
            title='Confirm'
            style={{height: 55}}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default OTPVerificationScreen;
