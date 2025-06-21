import {Button, CustomView, Input, Spinner, Text} from '@/components';
import SelectInput from '@/components/SelectInput';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {AuthStackParamList} from '@/navigation/navigationType';
import {updateField} from '@/redux/slices/formSlice';
import {RootState} from '@/redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
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
import { getLocations } from '../../../services/parcel';

type Props = NativeStackScreenProps<AuthStackParamList>;
  type Location = {
    id: string;
    state_id: string;
    location: string;
    address: string;
    park_type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

const BusinessInfoScreen = ({navigation}: Props) => {
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  const [addressError, setAddressError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
    const [stateRows, setStateRows] = useState<any[]>([]);
    // get all location and convert to array
    useEffect(() => {
      const fetchLocations = async () => {
        try {
          const result = await getLocations();
          setStateRows(result?.data?.details.rows || []);
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };
  
      fetchLocations();
    }, []);
    // Convert into { [stateName]: Location[] }
    const statesWithLocations: Record<string, Location[]> = stateRows.reduce(
      (acc, curr) => {
        acc[curr.name] = curr.locations;
        return acc;
      },
      {} as Record<string, Location[]>
    );
      const [selectedFromState, setSelectedFromState] = useState<
        keyof typeof statesWithLocations | null
      >(null);
      const [fromLocations, setFromLocations] = useState<Location[]>([]);
      const [selectedFromLocation, setSelectedFromLocation] = useState<
        string | null
      >(null);
        useEffect(() => {
          if (selectedFromState && selectedFromLocation) {
            const combined = `${selectedFromState}, ${selectedFromLocation}`;
            dispatch(updateField({ key: "location", value: combined }));
            console.log("agent location:", combined);
          }
        }, [selectedFromState, selectedFromLocation, dispatch]);
      

  const handleValidation = () => {
    let isValid = true;

    if (!formData.businessName) {
      setBusinessNameError('Business is required.');
      isValid = false;
    } else if (formData.businessName.length < 2) {
      setBusinessNameError('Please enter business name.');
      isValid = false;
    } else {
      setBusinessNameError('');
    }
    if (!formData.address) {
      setAddressError('Address is required.');
      isValid = false;
    } else if (formData.address.length < 2) {
      setAddressError('Please enter a address.');
      isValid = false;
    } else {
      setAddressError('');
    }

    return isValid;
  };

  const handleCreateAccount = () => {
    if (!handleValidation()) {
      return;
    }
    navigation.navigate('IdentityVerificationScreen');
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
      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={3} totalSteps={5} />
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
              Business Information
            </Text>
          </View>
          <View style={$cardHeader}>
            <Input
              label='Business Name'
              placeholder='Enter business name'
              placeholderTextColor='#B8C2CC'
              value={formData.businessName}
              onChangeText={(value) =>
                dispatch(updateField({key: 'businessName', value}))
              }
              errorMessage={businessNameError}
              keyboardType='default'
            />
            <SelectInput
              label='State'
              data={['Lagos', 'Oyo', 'Enugu', 'Imo', 'Abuja', 'Kano']}
              placeholder='Select State'
              onSelect={(value) => dispatch(updateField({key: 'state', value}))}
              showSearch={true}
            />
            <Input
              label='Address'
              placeholder='Enter address'
              placeholderTextColor='#B8C2CC'
              value={formData.address}
              onChangeText={(value) =>
                dispatch(updateField({key: 'address', value}))
              }
              errorMessage={addressError}
              keyboardType='default'
            />
            
          <SelectInput
            label="Motor Park Location State"
            data={Object.keys(statesWithLocations)}
            placeholder="Select State"
            onSelect={(state) => {
              setSelectedFromState(state as keyof typeof statesWithLocations);
              const locs =
                statesWithLocations[
                  state as keyof typeof statesWithLocations
                ] || [];
              setFromLocations(locs);
              setSelectedFromLocation(null); // Reset location when state changes
            }}
            
          />

          {/* Location Selector for Sending From */}
          {selectedFromState && (
            <SelectInput
              label="Motor Park Location Park"
              data={fromLocations.map((loc) => loc.location)}
              placeholder="Select Park"
              onSelect={(locationName) => {
                const found = fromLocations.find(
                  (loc) => loc.location === locationName
                );
                setSelectedFromLocation(found ? found.location : null);
              }}
            />
          )}
            {/* <SelectInput
              label='Motor Park Location State'
              data={['Oshodi Park', 'Agege Park', 'Ijaro Park', 'Ojota Park']}
              placeholder='Select motor park'
              onSelect={(value) =>
                dispatch(updateField({key: 'location', value}))
              }
              showSearch={true}
            /> */}
            <SelectInput
              label='Do you have a store?'
              data={['Yes', 'No']}
              placeholder='Select option'
              onSelect={(value) => dispatch(updateField({key: 'store', value}))}
            />

            <View style={$buttonsContainer}>
              <Button
                onPress={handleCreateAccount}
                title='Continue'
                style={{height: 55}}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomView>
  );
};

export default BusinessInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(16),
  },
});
