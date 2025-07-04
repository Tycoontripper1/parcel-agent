

// export default ParcelPhotoModal;
import React, { use, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { color } from '@/constants/Colors';
import CustomView from './CustomView';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import ShootButton from './svg/ShootButton';
import { upload, uploadBulkImages } from '../../services/upload';
import { getToken, getUser } from '../../services/auth';
import Toast from 'react-native-toast-message';
import { Helper } from '@/helper/helper';
import Spinner from './Spinner';
import * as FileSystem from 'expo-file-system';
import { set } from 'date-fns';

interface ParcelPhotoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (photos: string[]) => void;
}

const ParcelPhotoModal: React.FC<ParcelPhotoModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null]);
  const [loading, setLoading] = useState(false);
  const handleCapture = async (index: number) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: false, // No cropping
      quality: 1,
      base64:false,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      console.log('Captured photo URI:', selected.uri); // 👈 Add this
      const updatedPhotos = [...photos];
      updatedPhotos[index] = selected.uri;
      setPhotos(updatedPhotos);
    }
  };

  
const handleSave = async () => {
  console.log(photos, 'photos');
  setLoading(true);

  try {
    const validPhotos = photos.filter(p => p !== null);

    if (validPhotos.length < 1) {
      Toast.show({
        type: 'error',
        text1: 'No Images Selected',
        text2: 'Please select at least one image before saving.',
      });
      return;
    }

    const userImageUrl = await upload(validPhotos);

    if (userImageUrl?.data?.details) {
      console.log(userImageUrl.data.details, 'userImageUrl');
      onSave(userImageUrl.data.details);

      Helper.vibrate();

      setTimeout(() => {
        onClose(); // ✅ Close modal after delay
      }, 2000);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Unable to upload images. Please try again.',
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    Toast.show({
      type: 'error',
      text1: 'An Error Occurred',
      text2: 'Something went wrong during upload.',
    });
  } finally {
    setLoading(false); // Always stop loading indicator
  }
};




  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <CustomView style={{ paddingVertical: RFValue(10) }} padded>
      {loading && <Spinner />}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back-outline" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={styles.iconButton}
          >
            <Ionicons name="close" size={16} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: RFValue(40) }}>
          <Text style={styles.title}>Take Parcel Photos</Text>
          <Text style={styles.subtitle}>
            Ensure you take two clear images of the parcel
          </Text>
          <Text style={styles.counter}>
            {photos.filter((photo) => photo !== null).length}/2 photos
          </Text>

          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoBox}
                onPress={() => handleCapture(index)}
              >
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <ShootButton />
                    <Text style={styles.photoText}>Photo {index + 1}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              photos.filter((photo) => photo !== null).length < 1
                ? styles.disabledButton
                : {},
            ]}
            onPress={handleSave}
            disabled={photos.filter((photo) => photo !== null).length < 1}
          >
            <Text style={styles.saveText}>Save and Continue</Text>
          </TouchableOpacity>
        </View>
      </CustomView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 38,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
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
  photoPlaceholder: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  photoText: {
    color: 'gray',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: color.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ParcelPhotoModal;