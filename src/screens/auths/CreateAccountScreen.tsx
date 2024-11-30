import {Button, CustomView, Input, Spinner, Text} from '@/components';
import KeyBoardView from '@/components/KeyBoardView';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {color} from '@/constants/Colors';
import {Helper} from '@/helper/helper';
import {RootStackParamList} from '@/navigation/Navigation';
import {updateField} from '@/redux/slices/formSlice';
import {RootState} from '@/redux/store';
import {Feather, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';

type Props = NativeStackScreenProps<RootStackParamList>;

const CreateAccountScreen = ({navigation}: Props) => {
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidation = () => {
    let isValid = true;

    if (!formData.fullName) {
      setFullNameError('Name is required.');
      isValid = false;
    } else if (formData.fullName.length < 2) {
      setFullNameError('Please enter full name.');
      isValid = false;
    } else {
      setFullNameError('');
    }
    if (!formData.phoneNumber) {
      setPhoneError('Phone Number is required.');
      isValid = false;
    } else if (formData.phoneNumber.length < 11) {
      setPhoneError('Please enter a valid mobile number.');
      isValid = false;
    } else {
      setPhoneError('');
    }

    if (!formData.password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleCreateAccount = () => {
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
        text2: 'OTP sent Successfully',
      });
      navigation.navigate('OTPVerificationScreen');
    }, 2000);
    console.log({formData});
  };

  // Styles
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
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={5} />
      {/* Body */}
      <KeyBoardView>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Create Account
          </Text>
        </View>
        <View style={$cardHeader}>
          <Input
            label='Full Name'
            placeholder='Enter full name'
            placeholderTextColor='#B8C2CC'
            value={formData.fullName}
            onChangeText={(value) =>
              dispatch(updateField({key: 'fullName', value}))
            }
            LeftIcon={<Feather name='user' size={18} color={color.gray} />}
            errorMessage={fullNameError}
            keyboardType='default'
          />
          <Input
            label='Phone Number'
            placeholder='Enter phone number'
            placeholderTextColor='#B8C2CC'
            value={formData.phoneNumber}
            onChangeText={(value) =>
              dispatch(updateField({key: 'phoneNumber', value}))
            }
            LeftIcon={
              <SimpleLineIcons name='phone' size={18} color={color.gray} />
            }
            errorMessage={phoneError}
            keyboardType='number-pad'
          />

          <Input
            label='Email Address (Optional)'
            placeholder='Enter email'
            placeholderTextColor='#B8C2CC'
            value={formData.email}
            onChangeText={(value) =>
              dispatch(updateField({key: 'email', value}))
            }
            LeftIcon={
              <MaterialIcons name='mail-outline' size={18} color={color.gray} />
            }
            errorMessage={passwordError}
            keyboardType='email-address'
          />
          <Input
            label='Password'
            placeholder='Enter password'
            placeholderTextColor='#B8C2CC'
            value={formData.password}
            onChangeText={(value) =>
              dispatch(updateField({key: 'password', value}))
            }
            LeftIcon={
              <MaterialIcons name='lock-outline' size={18} color={color.gray} />
            }
            errorMessage={passwordError}
            keyboardType='default'
            type='password'
          />
          <View style={$buttonsContainer}>
            <Button
              onPress={handleCreateAccount}
              title='Create Account'
              style={{height: 55}}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default CreateAccountScreen;
