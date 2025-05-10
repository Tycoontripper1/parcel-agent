// api/auth.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiKey = Constants.expoConfig?.extra?.apiKey;

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getSingleParcel = async (): Promise<any | null> => {
  try {
    const user = await AsyncStorage.getItem('singleParcelData');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
export const getParcelDetails = async (): Promise<any | null> => {
  try {
    const user = await AsyncStorage.getItem('parcelDetails');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
export const SendParcelData = async (data: {
    sender: {
      phone: string;
      fullName: string;
      email: string;
      address: string;
    };
    receiver: {
      phone: string;
      fullName: string;
      email: string;
      address: string;
    };
    park: {
      source: string;
      destination: string;
    };
    parcel: {
      type: string;
      value: string;
      chargesPayable: string;
      chargesPaidBy: string;
      handlingFee: string;
      totalFee: string;
      description: string;
      thumbnails: string[];
    };
    // driver: {
    //   phone: string;
    //   name: string;
    //   driverId: string;
    //   upfrontPayment: boolean;
    // };
    paymentOption: string;
  }) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/shipment/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Parcel creation failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  
export const ParcelInDriver = async (data: {
  sender: {
    phone: string;
  };
  receiver: {
    phone: string;
  };
  park: {
    source: string;
    destination: string;
  };
  parcel: {
    type: string;
    value: string;
    chargesPayable: string;
    chargesPaidBy: string;
    handlingFee: string;
    totalFee: string;
    description: string;
    thumbnails: string[];
  };
  driver: {
    phone: string;
    // name: string;
    // driverId: string;
    // upfrontPayment: boolean;
  };
  paymentOption: string;
  }) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/shipment/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Parcel creation failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
export const getSingleParcelData = async (parcelId:any) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/shipment/?parcelId=${parcelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get parcel failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
export const getShipmentsHistory = async () => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/shipment?startDate=2025-01-15&endDate=2025-12-03`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get parcel failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
export const getLocations = async () => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get locations failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  export const verifyReceiverOtp = async ({code}: { code: string }) => {
    try {
       const token = await getToken()
      const response = await fetch(`${apiKey}/shipment/verify?code=${code}`, {
        method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
      
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Otp Verification failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  export const updateParcel = async (payload:any, id:any) => {
    try {
       const token = await getToken()
      const response = await fetch(`${apiKey}/shipment/${id}`, {
        method: 'patch',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'parcel update failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  export const overdueParcelRemindersUpdate = async (payload:any) => {
    try {
       const token = await getToken()
      const response = await fetch(`${apiKey}/users/reminders`, {
        method: 'patch',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'parcel update failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  