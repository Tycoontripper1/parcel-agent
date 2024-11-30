import {Button, CustomView, Input, Text} from '@/components';
import SelectInput from '@/components/SelectInput';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {RootStackParamList} from '@/navigation/Navigation';
import {updateField} from '@/redux/slices/formSlice';
import {RootState} from '@/redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';

type Props = NativeStackScreenProps<RootStackParamList>;

const IdentityVerificationScreen = ({navigation}: Props) => {
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const [idNumberError, setIdNumberError] = useState('');

  const handleValidation = () => {
    let isValid = true;

    if (!formData.idNumber) {
      setIdNumberError('ID Number is required.');
      isValid = false;
    } else if (formData.idType === 'NIN' && formData.idNumber.length < 11) {
      setIdNumberError('Please enter valid ID Number.');
      isValid = false;
    } else {
      setIdNumberError('');
    }

    return isValid;
  };

  const handleCreateAccount = () => {
    if (!handleValidation()) {
      return;
    }
    navigation.navigate('FrontImageScreen');
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

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={4} totalSteps={5} />
      {/* Body */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          keyboardShouldPersistTaps='handled'>
          <View style={$bodyHeader}>
            <Text font='SemiBold' size={18}>
              Identity Verification
            </Text>
          </View>
          <View style={$cardHeader}>
            <SelectInput
              label='ID type'
              data={['NIN', 'Voters card', `Drivers's License`, 'NURTW ID']}
              placeholder='Select ID type'
              onSelect={(value) =>
                dispatch(updateField({key: 'idType', value}))
              }
            />
            <Input
              label='ID Number'
              placeholder='Enter ID number'
              placeholderTextColor='#B8C2CC'
              value={formData.idNumber}
              onChangeText={(value) =>
                dispatch(updateField({key: 'idNumber', value}))
              }
              errorMessage={idNumberError}
              keyboardType='number-pad'
            />

            <Text style={{paddingVertical: 10}}>
              Continue to upload or scan copy of ID
            </Text>

            <Button
              onPress={handleCreateAccount}
              title='Continue'
              style={{height: 55, marginVertical: RFValue(16)}}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default IdentityVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(16),
  },
});
