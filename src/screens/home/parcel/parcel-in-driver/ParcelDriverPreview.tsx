import {CustomView, Spinner, Text} from '@/components';
import ButtonHome from '@/components/ButtonHome';
import KeyBoardView from '@/components/KeyBoardView';
import BackButton from '@/components/share/BackButton';
import StepProgress from '@/components/share/StepProgress';
import {HomeStackList} from '@/navigation/navigationType';
import {RootState} from '@/redux/store';
import { singleParcelInterface } from '@/utils/interface';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import { getSingleParcel, updateParcel } from '../../../../../services/parcel';
import { Helper } from '@/helper/helper';
import { apiKey, getToken } from '../../../../../services/auth';

type Props = NativeStackScreenProps<HomeStackList>;
const ParcelDriverPreviewScreen = ({navigation}: Props) => {
  const [singleParcel, setSingleParcel] = useState<singleParcelInterface | null>(null);
  const parcelId = singleParcel?.id
  useEffect(() => {
    const fetchUser = async () => {
      const parcel = await getSingleParcel();
      setSingleParcel(parcel)
    };
    fetchUser();
  }
  , []);
  
  const [loading, setLoading] = useState(false);
  const HandleContinue = async () => {
    setLoading(true);
    try {
          const payload = {
            status:"arrived"
          };
    
          // const result = await updateParcel(payload, parcelId);
           const token = await getToken()
                const response = await fetch(`${apiKey}/shipment/${parcelId}`, {
                  method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
                
                });
            
                const result = await response.json();
          setLoading(false)
          Helper.vibrate();
          Toast.show({
            type: "success",
            text1: "Success",
            text2: result?.message || " Parcel Received!",
          });
          navigation.navigate('ParcelCongratulation', {
               message: 'Parcel received successfully',
               note: 'SMS has been sent to notify the sender/receiver.',
        });
      }catch (error: any) {
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
  const $bodyHeader: ViewStyle = {
    paddingHorizontal: RFValue(16),
    flexDirection: 'column',
    gap: 6,
    paddingVertical: RFValue(20),
  };
  const $buttonsContainer: ViewStyle = {
    padding: RFValue(16),
  };

  return (
    <CustomView style={{paddingVertical: RFValue(10)}}>
      {loading && <Spinner />}
      <BackButton onClick={() => navigation.goBack()} />
      {/* Body */}
      <KeyBoardView padded={false}>
        <View style={$bodyHeader}>
          <Text font='SemiBold' size={18}>
            Parcel Information
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 6,
            padding: RFValue(16),
          }}>
          <Text size={14}>{singleParcel?.status}</Text>
          <View
            style={{backgroundColor: '#FFF8E6', padding: 4, borderRadius: 8}}>
            <Text color='#F79009'> In Transit</Text>
          </View>
        </View>
        {/* Sender's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Sender's Information
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Name: </Text>
              <Text style={styles.infoText}>{singleParcel?.sender?.fullName} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Email: </Text>
              <Text style={styles.infoText}>{singleParcel?.sender.email} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Phone Number:</Text>
              <Text style={styles.infoText}>{singleParcel?.sender.phone} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Address: </Text>
              <Text style={styles.infoText}>{singleParcel?.sender.address} </Text>
            </View>
          </View>
        </View>

        {/* Receiver's Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Receiver's Information
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Name: </Text>
              <Text style={styles.infoText}>{singleParcel?.receiver.fullName} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Email: </Text>
              <Text style={styles.infoText}>{singleParcel?.receiver.email} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Phone Number:</Text>
              <Text style={styles.infoText}>
                {singleParcel?.receiver.phone}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Address: </Text>
              <Text style={styles.infoText}>{singleParcel?.receiver.address} </Text>
            </View>
          </View>
        </View>

        {/* Park Detail */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Park Detail
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Dispatch Park:</Text>
              <Text style={styles.infoText}> {singleParcel?.park.source}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Delivery Park:</Text>
              <Text style={styles.infoText}>{singleParcel?.park.destination}</Text>
            </View>
          </View>
        </View>

        {/* Parcel Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Parcel Information
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Charges Paid By:</Text>
              <Text style={styles.infoText}>{singleParcel?.parcel.chargesPaidBy}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Parcel Type:</Text>
              <Text style={styles.infoText}>{singleParcel?.parcel.type}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Parcel Worth:</Text>
              <Text style={styles.infoText}>{singleParcel?.parcel.value}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#E9EAEB',
              }}>
              <Text style={styles.descriptionText}>Charges Payable:</Text>
              <Text style={styles.infoText}>{singleParcel?.parcel.chargesPayable}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Handling Fee:</Text>
              <Text style={styles.infoText}>
                {(Number(singleParcel?.parcel.handlingFee) || 0)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.descriptionText}>Total Paid:</Text>
              <Text style={styles.infoText}>
              {(Number(singleParcel?.parcel.handlingFee) || 0) + (Number(singleParcel?.parcel.chargesPayable) || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Parcel Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader} font='SemiBold' size={14}>
            Parcel Description
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: RFValue(6),
              borderRadius: 8,
            }}>
            <Text style={styles.descriptionText}>
              {singleParcel?.parcel.description}
            </Text>
          </View>
        </View>

        {singleParcel?.parcel.thumbnails &&
        singleParcel?.parcel.thumbnails.filter((photo) => photo).length > 0 ? (
          <View style={{paddingVertical: RFValue(10), padding: RFValue(16)}}>
            <Text style={styles.counter}>
              {singleParcel?.parcel.thumbnails.filter((photo) => photo !== null).length}
           /2 photos
            </Text>
            <View style={styles.photoGrid}>
              {singleParcel?.parcel.thumbnails.map((photo, index) => (
                <TouchableOpacity key={index} style={styles.photoBox}>
                  {photo ? (
                    <Image source={{uri: `http://45.9.191.184:8001/parcel/v1.0/api/files?slugs=${photo}`}} style={styles.photoPreview} />
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
            title='Accept Parcel'
            style={{height: 55}}
          />
        </View>
      </KeyBoardView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginBottom: RFValue(16),
    textAlign: 'center',
  },
  sectionContainer: {
    // marginBottom: RFValue(10),
    // paddingVertical: RFValue(12),
    backgroundColor: '#FDFDFD',
    borderRadius: RFValue(8),
    padding: RFValue(16),
  },
  sectionHeader: {
    paddingVertical: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E9EAEB',
    marginBottom: RFValue(6),
  },
  infoText: {
    fontSize: RFValue(10),
    marginBottom: RFValue(4),
    color: '#252B37',
  },
  descriptionText: {
    fontSize: RFValue(10),
    color: '#717680',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(16),
  },
  image: {
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(8),
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(16),
    color: '#fff',
    fontWeight: 'bold',
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
  counter: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
});

export default ParcelDriverPreviewScreen;
