import {CustomView, Input, Spinner, Text} from '@/components';
import ButtonHome from '@/components/ButtonHome';
import KeyBoardView from '@/components/KeyBoardView';
import BackButton from '@/components/share/BackButton';
import ShootButton from '@/components/svg/ShootButton';
import {HomeStackList} from '@/navigation/navigationType';
import {Ionicons} from '@expo/vector-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<HomeStackList>;
const SearchParcelOutDriverId = ({navigation}: Props) => {
  const [parcelId, setParcelId] = useState('');
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

  const [fetched, setFetched] = useState(false);
  const fetchParcelId = (text: string) => {
    if (text.length === 3) {
      setLoading(true);
      setTimeout(() => {
        setParcelId('PEH6568498706');
        setFetched(true);
        setLoading(false);
      }, 3000);
    }
  };

  // Styles
  const $bodyHeader: ViewStyle = {
    flexDirection: 'column',
    gap: 6,
    paddingVertical: RFValue(30),
  };
  const $buttonsContainer: ViewStyle = {
    paddingVertical: RFValue(16),
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      {/* Body */}
      <KeyBoardView padded={true}>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Parcel Out-Driver
          </Text>
        </View>
        <>
          {/* Parcel Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label} font='Medium' size={16}>
              Input Driver ID
            </Text>

            <Input
              label='Driver ID/Phone Number'
              placeholder='Enter driver ID'
              placeholderTextColor='#B8C2CC'
              keyboardType='number-pad'
              value={parcelId}
              onChangeText={(text) => {
                setParcelId(text);
                fetchParcelId(text);
              }}
            />
          </View>
          {fetched && (
            <View style={[styles.outputContainer, styles.checkedContainer]}>
              <TouchableOpacity>
                <Ionicons name='checkmark-circle' size={24} color='#4CAF50' />
              </TouchableOpacity>

              <View style={styles.infoContainer}>
                <Text style={styles.name}>Name</Text>
                <Text style={styles.phone}>Chinedu Joseph</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>Phone Number</Text>
                <Text style={styles.phone}>08035369384</Text>
              </View>
            </View>
          )}

          {/* Search Button */}
          <View style={$buttonsContainer}>
            <ButtonHome
              onPress={handleSubmit}
              title='Release Parcel'
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
export default SearchParcelOutDriverId;

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
  outputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    backgroundColor: '#f9fff4',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  checkedContainer: {
    borderColor: '#4CAF50',
  },

  infoContainer: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: 14,
    color: '#555',
  },
});
