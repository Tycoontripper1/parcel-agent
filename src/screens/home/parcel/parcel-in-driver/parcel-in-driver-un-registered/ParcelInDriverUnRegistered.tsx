import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {CustomView, Input, Text} from '@/components';
import StepProgress from '@/components/share/StepProgress';
import KeyBoardView from '@/components/KeyBoardView';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackList} from '@/navigation/navigationType';
import {updateField} from '@/redux/slices/parcelSlice';
import ButtonHome from '@/components/ButtonHome';
import BackButton from '@/components/share/BackButton';
import SelectInput from '@/components/SelectInput';
import {Ionicons} from '@expo/vector-icons';
import PaymentOption from '@/components/PaymentOption';
import TextAreaInput from '@/components/TextAreaInput';
import ShootButton from '@/components/svg/ShootButton';
import ConfirmPaymentModal from '@/components/ComfirmPaymentModal';
import ParcelPhotoModal from '@/components/ParcelPhotoModal';

type Props = NativeStackScreenProps<HomeStackList>;
const ParcelInDriverUnRegistered = ({navigation}: Props) => {
  // const [loading, setLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.parcel);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string>('Online');
  const [selectedPaymentAnswer, setSelectedPaymentAnswer] = useState<
    string | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [driverPhoneError, setDriverPhoneError] = useState('');
    const [receiverPhoneError, setReceiverPhoneError] = useState('');
    const [senderPhoneError, setSenderPhoneError] = useState('');


  const handleValidation = () => {
    let isValid = true;

    if (!formData.driverNumber) {
      setDriverPhoneError('Phone Number is required.');
      isValid = false;
    } else if (formData.driverNumber.length < 11 || formData.driverNumber.length > 11) {
      setDriverPhoneError('Please enter a valid mobile number.');
      isValid = false;
    } else {
      setDriverPhoneError('');
    }

    if (!formData.senderPhoneNumber) {
      setSenderPhoneError('Phone Number is required.');
      isValid = false;
    } else if (formData.senderPhoneNumber.length < 11 || formData.senderPhoneNumber.length > 11) {
      setSenderPhoneError('Please enter a valid mobile number.');
      isValid = false;
    } else {
      setSenderPhoneError('');
    }

    if (!formData.receiverPhoneNumber) {
      setReceiverPhoneError('Phone Number is required.');
      isValid = false;
    } else if (formData.receiverPhoneNumber.length < 11 || formData.receiverPhoneNumber.length > 11) {
      setReceiverPhoneError('Please enter a valid mobile number.');
      isValid = false;
    } else {
      setReceiverPhoneError('');
    }

    return isValid;
  };

  const HandleContinue = () => {
    if (!handleValidation()) {
      return;
    }
    navigation.navigate('ParcelInDriverUnRegisteredPreview');
    console.log({formData});
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

  const handleSave = (photos: string[]) => {
    dispatch(updateField({key: 'parcelImages', value: photos}));
    console.log('Captured Photos:', photos);
  };
  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {modalVisible && (
        <ConfirmPaymentModal
          selectedOption={selectedPaymentAnswer}
          setModalVisible={setModalVisible}
          setSelectedOption={setSelectedPaymentAnswer}
          modalVisible={modalVisible}
        />
      )}
      {photoModalVisible && (
        <ParcelPhotoModal
          visible={photoModalVisible}
          onClose={() => setPhotoModalVisible(false)}
          onSave={handleSave}
        />
      )}
      {/* {loading && <Spinner />} */}

      <BackButton onClick={() => navigation.goBack()} />
      <StepProgress step={1} totalSteps={2} />
      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Parcel In - Driver
          </Text>
        </View>
        <View style={$cardHeader}>
          <Input
            label='Driver Phone Number'
            placeholder='Enter phone number'
            placeholderTextColor='#B8C2CC'
            value={formData.driverNumber}
            onChangeText={(value) =>
              dispatch(updateField({key: 'driverNumber', value}))
            }
            keyboardType='number-pad'
            errorMessage={driverPhoneError}
          />
          <SelectInput
            label='Departure State?'
            data={[
              'Lagos State',
              'Ondo State',
              'Ogun State',
              'Benue State',
              'Kogi State',
              'Ekiti State',
              'Kwara State',
            ]}
            placeholder='Select option'
            onSelect={(value) =>
              dispatch(updateField({key: 'departureState', value}))
            }
            // showSearch={true}
          />
          <Input
            label='Sender Phone Number'
            placeholder='Enter phone number'
            placeholderTextColor='#B8C2CC'
            value={formData.senderPhoneNumber}
            onChangeText={(value) =>
              dispatch(updateField({key: 'senderPhoneNumber', value}))
            }
            keyboardType='number-pad'
            errorMessage={senderPhoneError}
          />
          <Input
            label=' Receiver Phone Number'
            placeholder='Enter phone number'
            placeholderTextColor='#B8C2CC'
            value={formData.receiverPhoneNumber}
            onChangeText={(value) =>
              dispatch(updateField({key: 'receiverPhoneNumber', value}))
            }
            keyboardType='number-pad'
            errorMessage={receiverPhoneError}
          />
          <Input
            label='Delivery Motor Park'
            placeholder='Enter delivery park'
            placeholderTextColor='#B8C2CC'
            value={formData.deliveryMotorPark}
            onChangeText={(value) =>
              dispatch(updateField({key: 'deliveryMotorPark', value}))
            }
            keyboardType='default'
          />

          <Text size={18} style={{paddingTop: 15, paddingBottom: 10}}>
            Parcel Information
          </Text>

          <Input
            label='Parcel Type'
            placeholder='Enter parcel type'
            placeholderTextColor='#B8C2CC'
            value={formData.parcelType}
            onChangeText={(value) =>
              dispatch(updateField({key: 'parcelType', value}))
            }
            keyboardType='default'
          />
          <Input
            label='Parcel Value (₦)'
            placeholder='Enter parcel worth'
            placeholderTextColor='#B8C2CC'
            value={formData.parcelValue}
            onChangeText={(value) =>
              dispatch(updateField({key: 'parcelValue', value}))
            }
            keyboardType='number-pad'
          />

          <Input
            label='Charges Payable (₦)'
            placeholder='Enter amount charged'
            placeholderTextColor='#B8C2CC'
            value={formData.chargesPayable}
            onChangeText={(value) =>
              dispatch(updateField({key: 'chargesPayable', value}))
            }
            keyboardType='number-pad'
          />

          <View style={styles.container}>
            {/* Icon and Label */}
            <View style={styles.infoContainer}>
              <Ionicons
                name='information-circle-outline'
                size={RFValue(20)}
                color='#717680'
              />
              <Text style={styles.label}>Handling Fee</Text>
            </View>
            {/* Amount */}
            <Text style={styles.amount}>₦1,000.00</Text>
          </View>
          <SelectInput
            label='Charges to be paid by?'
            data={['Sender', 'Receiver']}
            placeholder='Select option'
            onSelect={(value) =>
              dispatch(updateField({key: 'chargesPayBy', value}))
            }
            // showSearch={true}
          />
          {formData.chargesPayBy === 'Sender' && (
            <View style={{paddingBottom: 10}}>
              {selectedPaymentAnswer == 'Yes' ? (
                <TouchableOpacity style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>
                    Payment Confirmed
                  </Text>
                </TouchableOpacity>
              ) : (
                <PaymentOption
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  onPress={() => setModalVisible(true)}
                />
              )}
            </View>
          )}
          <TextAreaInput
            label='Parcel Description(Optional)'
            placeholder='Enter a description...'
            placeholderTextColor='#B8C2CC'
            value={formData.parcelDescription}
            onChangeText={(value) =>
              dispatch(updateField({key: 'parcelDescription', value}))
            }
            keyboardType='default'
          />

          <Text size={18} style={{paddingTop: 15, paddingBottom: 10}}>
            Take photos of the Parcel
          </Text>

          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={() => setPhotoModalVisible(true)}
              title='Take Photo'
              style={{height: 55}}
              disabled={!formData}
              backgroundColor='#E6FFDB'
              buttonIcon={<ShootButton />}
            />
          </View>

          {formData.parcelImages &&
          formData.parcelImages.filter((photo) => photo).length > 0 ? (
            <View style={{paddingVertical: RFValue(10)}}>
              <Text style={styles.counter}>
                {formData.parcelImages.filter((photo) => photo !== null).length}
             /2 photos
              </Text>
              <View style={styles.photoGrid}>
                {formData.parcelImages.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.photoBox}>
                    {photo ? (
                      <Image
                        source={{uri: photo}}
                        style={styles.photoPreview}
                      />
                    ) : (
                      <View></View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View></View>
          )}
          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={HandleContinue}
              title='Next'
              style={{height: 55}}
              disabled={!formData.parcelDescription}
            />
          </View>
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

export default ParcelInDriverUnRegistered;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: RFValue(12),
    borderRadius: RFValue(8),
    borderColor: '#E6E6E6',
    borderWidth: 1,
    marginTop: RFValue(2),
    marginBottom: RFValue(10),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: RFValue(8),
    fontSize: RFValue(14),
    color: '#717680',
    fontFamily: 'System', // You can replace with custom font if needed
  },
  amount: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#FAFAFA',
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: RFValue(14),
    fontWeight: '400',
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  counter: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoBox: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
