// api/auth.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
 export const BASE_URL = ' http://45.9.191.184:8001/parcel/v1.0/api'; // change this
 const apiKey = Constants.expoConfig?.extra?.apiKey;

 export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.warn('No token found in AsyncStorage.');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};


// export const uploadBulkImages = async (base64Images: string[], username: string) => {
//   const formData = new FormData();
//   const token = await getToken();

//   base64Images.forEach((base64, index) => {
//     const mime = base64.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
//     const b64Data = base64.replace(/^data:image\/\w+;base64,/, '');
//     const byteCharacters = atob(b64Data);
//     const byteArrays = [];

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteArrays.push(byteCharacters.charCodeAt(i));
//     }

//     const byteArray = new Uint8Array(byteArrays);
//     const blob = new Blob([byteArray], { type: mime });

//     formData.append('files', {
//       uri: base64, // This won't be used, just for naming
//       name: `image_${index}.jpg`,
//       type: mime,
//       // The crucial part
//       ...((Platform.OS === 'ios' || Platform.OS === 'android') ? { uri: `file://${Date.now()}_${index}.jpg` } : {}),
//     } as any); // Still necessary for RN's FormData

//     // FormData needs an actual Blob for React Native
//     formData.append('files', blob);
//   });

//   const response = await fetch(`http://185.230.64.174:8001/parcel/v1.0/api/upload/bulk?folder=${username}`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       // Don't set Content-Type manually for FormData
//     },
//     body: formData,
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || 'Failed to upload images');
//   }

//   return result;
// };

export const uploadBulkImages = async (base64Images: string[], username: string) => {
  const formData = new FormData();
  const token = await getToken();

  for (let index = 0; index < base64Images.length; index++) {
    const base64 = base64Images[index];
    const mime = base64.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
    const b64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(b64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArrays], { type: mime });

    formData.append('files', {
      uri: `file://${Date.now()}_${index}.jpg`,
      name: `image_${index}.jpg`,
      type: mime,
    } as any);

    formData.append('files', blob); // This is enough!
  }

  const response = await fetch(`http://45.9.191.184:8001/parcel/v1.0/api/upload/bulk?folder=${username}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to upload images');
  }

  return result;
};


  // export const uploadSingleImage = async (file: any, username: string) => {
  //   const token = await getToken(); // ✅ await the async call
  
  //   const formData = new FormData();
  //   formData.append('file', {
  //     uri: file,
  //     name: 'image.jpg',
  //     type: 'image/jpeg',
  //   } as any);
  
  //   const response = await fetch(`${apiKey}/upload/single?folder=${username}`, {
  //     method: 'POST',
  //     body: formData,
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  
  //   const result = await response.json();
  //    console.log(result,"result upload");
  //   if (!response.ok) {
  //     throw new Error(result.message || 'Failed to upload user image');
  //   }
  
  //   return result;
  // };
  
  
  export const uploadSingleImage = async (base64: string, username: string) => {
    const token = await getToken();
  
    const formData = new FormData();
  
    const mime = base64.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
    const b64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(b64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
  
    const blob = new Blob([byteArrays], { type: mime });
  
    formData.append('file', {
      uri: `file://${Date.now()}.jpg`,
      name: `image.jpg`,
      type: mime,
    } as any);
  
    formData.append('file', blob); // attach the actual image blob
  
    const response = await fetch(`${BASE_URL}/upload/single?folder=${username}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Do not set 'Content-Type' manually for multipart/form-data
      },
      body: formData,
    });
  
    const result = await response.json();
    console.log(result, 'result upload');
  
    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload user image');
    }
  
    return result;
  };
  