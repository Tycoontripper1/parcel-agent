import {Button, CustomView, Spinner, Text} from '@/components';
import KeyBoardView from '@/components/KeyBoardView';
import OTPInput from '@/components/OTPInput';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {color} from '@/constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { HomeStackList } from '@/navigation/navigationType';
import React, {useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import ResendOTP from '@/screens/auths/ResendOTP';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {updateField} from '@/redux/slices/formSlice';
import {AuthStackParamList} from '@/navigation/navigationType';

// type Props = NativeStackScreenProps<AuthStackParamList>;
type Props = NativeStackScreenProps<HomeStackList>;

const ParcelOtpVerificationReceiver = ({navigation}: Props) => {
  const otp = useSelector((state: RootState) => state.form.otp);
    const formData = useSelector((state: RootState) => state.parcel);
  const dispatch = useDispatch();

  const handleOtpChange = (newOtp: string) => {
    const updatedOtp = newOtp;
    dispatch(updateField({key: 'otp', value: updatedOtp}));
  };
  const [loading, setLoading] = useState(false);

  // Function to handle parcel search
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Parcel loaded!',
      });
      navigation.navigate('ParcelCongratulation', {
        message: 'Parcel released successfully',
      });
    }, 3000);
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
      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font='SemiBold' color='#414651' size={18}>
          Parcel Out - Receiver
          </Text>
          <Text font='SemiBold' size={18}>
            Verify Parcel
          </Text>
          <Text size={14} color={color.textGray}>
          Enter the 4-digit code sent to the receiver
            {formData.receiverPhoneNumber}
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
            onPress={handleSubmit}
            title='Continue'
            style={{height: 55}}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ParcelOtpVerificationReceiver;
