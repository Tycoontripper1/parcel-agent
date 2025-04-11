// api/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
 export const BASE_URL = ' http://185.230.64.174:8001/parcel/v1.0/api'; // change this

export const getToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  export const uploadBulkImages = async (files: any[], username: string) => {
    const formData = new FormData();
    const token = await getToken(); // ✅ await the async call
  
    files.forEach((file, index) => {
      formData.append('files', {
        uri: file,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      } as any);
    });
  
    const response = await fetch(`${`http://185.230.64.174:8001/parcel/v1.0/api`}/upload/bulk?folder=${username}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload identification images');
    }
  
    return result; // Assuming this returns an array
  };
  

  export const uploadSingleImage = async (file: any, username: string) => {
    const token = await getToken(); // ✅ await the async call
  
    const formData = new FormData();
    formData.append('file', {
      uri: file,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);
  
    const response = await fetch(`${`http://185.230.64.174:8001/parcel/v1.0/api`}/upload/single?folder=${username}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  
    const result = await response.json();
     console.log(result,"result upload");
    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload user image');
    }
  
    return result;
  };
  
  
  