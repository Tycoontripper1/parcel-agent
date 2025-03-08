import { View, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomView, Input, Text } from '@/components';
import StepProgress from '@/components/share/StepProgress';
import KeyBoardView from '@/components/KeyBoardView';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {  DriverStackList } from '@/navigation/navigationType';
import ButtonHome from '@/components/ButtonHome';
import BackButton from '@/components/share/BackButton';
import SelectInput from '@/components/SelectInput';

type Props = NativeStackScreenProps<DriverStackList>;

const ScreenOne = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({
    senderFullName: '',
    senderEmail: '',
    senderPhoneNumber: '',
    senderAddress: '',
    idType: '',
    idNumber: '',
    vehicleType: '',
    vehicleRegistrationNumber: '',
    motorParkLocation: '',
  });

  // Handle input change dynamically
  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleNavigate = () => {
    navigation.navigate('FacialVerification');
    console.log({ formData });
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    padding: RFValue(16),
    flexDirection: 'column',
    gap: 6,
  };
  const $cardHeader: ViewStyle = {
    padding: RFValue(16),
    backgroundColor: '#FDFDFD',
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{ paddingVertical: RFValue(10) }}>
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={3} />

      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$cardHeader}>
          <Text size={18} style={{ paddingTop: 15, paddingBottom: 10 }}>
            Register Driver
          </Text>
          <Input
            label='Full Name'
            placeholder='Enter full name'
            placeholderTextColor='#B8C2CC'
            value={formData.senderFullName}
            onChangeText={(value) => handleChange('senderFullName', value)}
            keyboardType='default'
          />
          <Input
            label='Email Address (Optional)'
            placeholder='Enter email'
            placeholderTextColor='#B8C2CC'
            value={formData.senderEmail}
            onChangeText={(value) => handleChange('senderEmail', value)}
            keyboardType='email-address'
          />
          <Input
            label='Phone Number'
            placeholder='Enter phone number'
            placeholderTextColor='#B8C2CC'
            value={formData.senderPhoneNumber}
            onChangeText={(value) => handleChange('senderPhoneNumber', value)}
            keyboardType='number-pad'
          />
          <Input
            label='Home Address'
            placeholder='Enter address'
            placeholderTextColor='#B8C2CC'
            value={formData.senderAddress}
            onChangeText={(value) => handleChange('senderAddress', value)}
            keyboardType='default'
          />
          <SelectInput
            label='ID type'
            data={['NIN', 'Voters Card', "Driver's License", "NURTW ID"]}
            placeholder='Select ID type'
            onSelect={(value) => handleChange('idType', value)}
          />
          <Input
            label='ID Number'
            placeholder='Enter ID number'
            placeholderTextColor='#B8C2CC'
            value={formData.idNumber}
            onChangeText={(value) => handleChange('idNumber', value)}
            keyboardType='default'
          />
          <Input
            label='ID Number'
            placeholder='e.g. Space Bus'
            placeholderTextColor='#B8C2CC'
            value={formData.vehicleType}
            onChangeText={(value) => handleChange('vehicleType', value)}
            keyboardType='default'
          />
          <Input
            label='Vehicle Registration Number'
            placeholder='Enter vehicle number'
            placeholderTextColor='#B8C2CC'
            value={formData.vehicleRegistrationNumber}
            onChangeText={(value) => handleChange('vehicleRegistrationNumber', value)}
            keyboardType='number-pad'
          />
          <Input
            label='Motor Park Location'
            placeholder='Enter motor park location'
            placeholderTextColor='#B8C2CC'
            value={formData.motorParkLocation}
            onChangeText={(value) => handleChange('motorParkLocation', value)}
            keyboardType='default'
          />

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleNavigate}
              title='Next'
              style={{ height: 55 }}
              disabled={!formData.idType}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ScreenOne;
