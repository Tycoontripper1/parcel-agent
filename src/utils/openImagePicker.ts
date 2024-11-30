import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';

// Define the type for the function that sets the image URI
type SetImageFunction = (uri: string) => void;

// Function to handle image selection
export const openImagePicker = async (
  setImage: SetImageFunction, // Function to update state
  fromCamera: boolean // Boolean to determine source (camera or gallery)
): Promise<void> => {
  try {
    // Request permissions based on the source
    let permissionResult: ImagePicker.PermissionResponse;

    if (fromCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    // Check if permissions were granted
    if (permissionResult.status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        fromCamera
          ? 'Camera access is required to capture the image.'
          : 'Gallery access is required to select an image.'
      );
      return;
    }

    // Launch camera or gallery
    const result: ImagePicker.ImagePickerResult = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

    // Check if the user canceled the action
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri); // Set the image URI
    }
  } catch (error) {
    console.error('Error selecting an image:', error);
    Alert.alert('Error', 'An error occurred while selecting the image.');
  }
};
