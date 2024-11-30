import {TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '@/hooks/useTheme';
import Header from '@/components/share/Header';
import KeyBoardView from '@/components/KeyBoardView';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Input, Spinner, Text} from '@/components';
import {color} from '@/constants/Colors';
import {MaterialIcons} from '@expo/vector-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/Navigation';
import {Helper} from '@/helper/helper';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList>;

const ResetPasswordWithEmail = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);

  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleValidation = () => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
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
        text2: 'Successfully sent OTP',
      });
      navigation.replace('ResetPasswordWithEmailConfirm');
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
    paddingVertical: RFValue(20),
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
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
            Password Reset
          </Text>
          <Text size={14} color={color.textGray}>
            Enter the email address associated with your account to receive the
            One Time Password.
          </Text>
        </View>
        <View style={$cardHeader}>
          {/* Email Input */}
          <Input
            label='Email Address'
            placeholder='Enter email'
            placeholderTextColor='#B8C2CC'
            value={email}
            onChangeText={setEmail}
            LeftIcon={
              <MaterialIcons name='mail-outline' size={18} color={color.gray} />
            }
            errorMessage={emailError}
            type='email'
            keyboardType='email-address'
            onChange={handleValidation}
          />
        </View>

        {/* Buttons */}
        <View style={$buttonsContainer}>
          <Button
            title='Request OTP'
            onPress={handleSentOTP}
            style={{height: 50}}
          />
          <Button
            title='Back to Login'
            onPress={() => navigation.goBack()}
            backgroundColor='#E6FFDB'
            textColor='#000'
            style={{height: 50}}
          />
        </View>
      </KeyBoardView>
    </View>
  );
};

export default ResetPasswordWithEmail;
