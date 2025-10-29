// api/auth.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import * as FileSystem from 'expo-file-system';
//  export const BASE_URL = 'https://1746-41-173-243-171.ngrok-free.app/parcel/v1.0/api'; // change this
//  const apiKey = Constants.expoConfig?.extra?.apiKey;
export const apiKey = "https://api.parcelpointng.com:4001/parcel/v1.0"

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







export const uploadBulkImages = async (images: string[], username: string) => {
  const token = await getToken();

  const formData = new FormData();

  images.forEach((imageUri, index) => {
    formData.append('files', {
      uri: imageUri,
      name: `image_${index}.jpg`,
      type: 'image/jpeg',
    } as any);
  });

  const response = await fetch(
    `https://api.parcelpointng.com:4001/parcel/v1.0/upload/bulk?folder=${username}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to upload user image');
  }
  return result;
};






  export const uploadSingleImage = async (file: any, username: string) => {
    const token = await getToken(); // ✅ await the async call
  
    const formData = new FormData();
    const localUri = file
    const fileName = localUri.split('/').pop();
    const fileType = fileName?.split('.').pop() ;

    formData.append('file', {
      uri: localUri,
      name: fileName,
      type: `image/${fileType}`, // Use the correct MIME type for the file
    } as any);
  
    const response = await fetch(`${apiKey}/upload/single?folder=${username}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  
    const result = await response.json();
     //(result,"result upload");
    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload user image');
    }
  
    return result;
  };


  



export const upload = async (uris: string[]) => {
  const token = await getToken();
  const formData = new FormData();
  const MAX_FILE_SIZE_MB = 10;

  for (let index = 0; index < uris.length; index++) {
    const uri = uris[index];

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error(`File at URI "${uri}" does not exist.`);
    }

    const fileSizeMB = fileInfo.size ? fileInfo.size / (1024 * 1024) : 0;
    console.log(`File ${index + 1}: ${fileSizeMB.toFixed(2)} MB`);

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File at "${uri}" is too large. Max allowed size is ${MAX_FILE_SIZE_MB}MB.`);
    }

    formData.append('files', {
      uri,
      name: `image_${index}.jpg`,
      type: 'image/jpeg',
    } as any);
  }

  try {
    const response = await axios.post(
      `https://api.parcelpointng.com:4001/parcel/v1.0/files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    const serverMessage =
      error?.response?.data?.message || error.message || 'Upload failed';

    console.error('Upload error:', serverMessage);
    throw new Error(`Upload failed: ${serverMessage}`);
  }
};


  
export const getImage = async (imageSlug: string[]) => {
  const token = await getToken();


  const response = await fetch(`${apiKey}/files?slugs=${imageSlug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
 
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to upload file(s)');
  }

  return result;
};


  
  // export const uploadSingleImage = async (base64: string, username: string) => {
  //   const token = await getToken();
  
  //   const formData = new FormData();
  
  //   const mime = base64.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
  //   const b64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = new Uint8Array(byteCharacters.length);
  
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteArrays[i] = byteCharacters.charCodeAt(i);
  //   }
  
  //   const blob = new Blob([byteArrays], { type: mime });
  
  //   formData.append('file', {
  //     uri: `file://${Date.now()}.jpg`,
  //     name: `image.jpg`,
  //     type: mime,
  //   } as any);
  
  //   formData.append('file', blob); // attach the actual image blob
  
  //   const response = await fetch(`${BASE_URL}/upload/single?folder=${username}`, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       // Do not set 'Content-Type' manually for multipart/form-data
  //     },
  //     body: formData,
  //   });
  
  //   const result = await response.json();
  //   //(result, 'result upload');
  
  //   if (!response.ok) {
  //     throw new Error(result.message || 'Failed to upload user image');
  //   }
  
  //   return result;
  // };
   
 

