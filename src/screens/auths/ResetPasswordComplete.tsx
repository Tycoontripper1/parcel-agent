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
import {Helper} from '@/helper/helper';
import Toast from 'react-native-toast-message';
import {AuthStackParamList} from '@/navigation/navigationType';
import { changePassword } from '../../../services/auth';

type Props = NativeStackScreenProps<AuthStackParamList>;

const ResetPasswordComplete = ({navigation}: Props) => {
  const [loading, setLoading] = useState(false);

  const {theme} = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleValidation = () => {
    let isValid = true;

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // ConfirmPassword validation
    if (!confirmPassword) {
      setConfirmPasswordError('Password is required.');
      isValid = false;
    } else if (confirmPassword.length < 6) {
      setConfirmPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Password not matched.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    return isValid;
  };

  const handleResetPassword = async () => {
    if (!handleValidation()) {
      return;
    }

    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   Helper.vibrate();
    //   Toast.show({
    //     type: 'success',
    //     text1: 'Success',
    //     text2: 'Reset Password Successfully',
    //   });
    //   navigation.navigate('Login');
    // }, 2000);
      setLoading(true);
        try {
          const payload = {
             password: password,
             confirm: confirmPassword,
          };
    
          const result = await changePassword(payload);
    
          Helper.vibrate();
          Toast.show({
            type: "success",
            text1: "Success",
            text2: result?.message || " Reset Password Successfully",
          });
          navigation.navigate('Login');
        } catch (error: any) {
          console.error("Save Error:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error?.message || "Something went wrong!",
          });
        } finally {
          setLoading(false);
        }
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
            Password Reset
          </Text>
          <Text size={14} color={color.textGray}>
            Enter the email address associated with your account to receive the
            password reset link.
          </Text>
        </View>
        <View style={$cardHeader}>
          {/* Password Input */}
          <Input
            label='Password'
            placeholder='Enter password'
            placeholderTextColor='#B8C2CC'
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            LeftIcon={
              <MaterialIcons name='lock-outline' size={18} color={color.gray} />
            }
            type='password'
            errorMessage={passwordError}
            keyboardType='default'
          />

          {/* Confirm Password Input */}
          <Input
            label='Confirm Password'
            placeholder='Enter password'
            placeholderTextColor='#B8C2CC'
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
            LeftIcon={
              <MaterialIcons name='lock-outline' size={18} color={color.gray} />
            }
            type='password'
            errorMessage={confirmPasswordError}
            keyboardType='default'
          />
        </View>
        <View style={$buttonsContainer}>
          <Button
            title='Reset Password'
            style={{height: 50}}
            onPress={handleResetPassword}
          />
        </View>
      </KeyBoardView>
    </View>
  );
};

export default ResetPasswordComplete;
