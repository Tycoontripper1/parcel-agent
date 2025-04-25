import {CustomView, Input, Spinner, Text} from '@/components';
import ButtonHome from '@/components/ButtonHome';
import KeyBoardView from '@/components/KeyBoardView';
import BackButton from '@/components/share/BackButton';
import ShootButton from '@/components/svg/ShootButton';
import {HomeStackList} from '@/navigation/navigationType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import { getSingleParcelData } from '../../../../../services/parcel';

type Props = NativeStackScreenProps<HomeStackList>;
const SearchParcelOutReceiver = ({navigation}: Props) => {
  const [parcelId, setParcelId] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to simulate barcode scanning
  const handleScanBarcode = () => {
    setLoading(true);
    setTimeout(() => {
      setParcelId(generateRandomNumbers(10));
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Parcel loaded!',
      });
      navigation.navigate('ParcelDriverOutPreviewScreen');
    }, 3000);
  };

  // Function to handle parcel search
  const handleSearchParcel = async () => {
    if (!parcelId) {
      Alert.alert('Please enter a parcel ID!');
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await getSingleParcelData(parcelId);
  
      // ✅ Save to local storage
      await AsyncStorage.setItem('singleParcelData', JSON.stringify(result?.data?.details?.rows[0]));
  
      Toast.show({
        type: "success",
        text1: "Success",
        text2: result?.data?.message || "Parcel loaded!",
      });
  
      navigation.navigate('ParcelReceiverOutPreviewScreen');
    } catch (error: any) {
      console.error("Parcel submission error:", error);
  
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate random 10-digit number
  const generateRandomNumbers = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: 'column',
    gap: 6,
    paddingVertical: RFValue(18),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && (
        <Spinner
          message={`Processing your Parcel Please wait.....`}
          width={'65%'}
          height={200}
        />
      )}
      <BackButton onClick={() => navigation.goBack()} />
      {/* Body */}
      <KeyBoardView padded={true}>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
          Parcel Out - Receiver
          </Text>
        </View>
        <>
          {/* Barcode Scanner */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanBarcode}>
            <ShootButton />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Parcel Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Input Parcel ID</Text>

            <Input
              label='Parcel ID'
              placeholder='Enter parcel ID'
              placeholderTextColor='#B8C2CC'
              keyboardType='number-pad'
              value={parcelId}
              onChangeText={(text) => setParcelId(text)}
            />
          </View>

          {/* Search Button */}
          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleSearchParcel}
              title='Search Parcel'
              style={{height: 55}}
              disabled={!parcelId}
              textColor='#61616B'
            />
          </View>
        </>
      </KeyBoardView>
    </CustomView>
  );
};
export default SearchParcelOutReceiver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#E6FFDB',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  scanButtonText: {
    color: '#1b4e73',
    fontSize: 18,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#aaa',
    fontSize: 14,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#555',
    fontSize: 18,
    fontWeight: '600',
  },
});
