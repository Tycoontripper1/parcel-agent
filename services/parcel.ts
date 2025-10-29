// api/auth.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const apiKey = Constants.expoConfig?.extra?.apiKey;
// const apiKey = "https://bc65-196-1-179-86.ngrok-free.app/parcel/v1.0/api"
export const apiKey = "https://api.parcelpointng.com:4001/parcel/v1.0"


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
  parcels: Array<{
    sender: {
      phone: string;
      fullName?: string;
      email?: string;
      address: string;
    };
    receiver: {
      phone: string;
      fullName: string;
      email?: string;
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
    paymentOption: string;
  }>;
}) => {
  try {
    const token = await getToken();

    // Validate at least one parcel exists
    if (!data.parcels || data.parcels.length === 0) {
      throw new Error('At least one parcel is required');
    }

    // Process each parcel to ensure proper formatting
    const processedParcels = data.parcels.map(parcel => ({
      ...parcel,
      sender: {
        ...parcel.sender,
        phone: parcel.sender.phone.replace(/-/g, ''),
      },
      receiver: {
        ...parcel.receiver,
        phone: parcel.receiver.phone.replace(/-/g, ''),
      },
      parcel: {
        ...parcel.parcel,
        value: parcel.parcel.value ? String(Number(parcel.parcel.value)) : "0",
        chargesPayable: parcel.parcel.chargesPayable ? String(Number(parcel.parcel.chargesPayable)) : "0",
        handlingFee: parcel.parcel.handlingFee ? String(Number(parcel.parcel.handlingFee)) : "0",
        totalFee: parcel.parcel.totalFee || (
          parcel.parcel.handlingFee && parcel.parcel.chargesPayable
            ? String(Number(parcel.parcel.handlingFee) + Number(parcel.parcel.chargesPayable))
            : "0")
      },
      paymentOption: parcel.paymentOption || "bank"
    }));

    const response = await fetch(`${apiKey}/shipment/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        parcels: processedParcels
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Parcel creation failed');
    }

    return result;
  } catch (error) {
    console.error('Parcel submission error:', error);
    throw error;
  }
};
  
export const ParcelInDriver = async (data: {
  parcels: Array<{
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
    paymentOption: string;
    status: string;
  }>;
}) => {
  try {
    const token = await getToken();
    
    // Validate at least one parcel exists
    if (!data.parcels || data.parcels.length === 0) {
      throw new Error('At least one parcel is required');
    }

    // Process each parcel to ensure proper formatting
    const processedParcels = data.parcels.map(parcel => ({
      ...parcel,
      sender: {
        phone: parcel.sender.phone.replace(/-/g, ""),
      },
      receiver: {
        phone: parcel.receiver.phone.replace(/-/g, ""),
      },
      parcel: {
        ...parcel.parcel,
        value: parcel.parcel.value ? String(Number(parcel.parcel.value)) : "",
        chargesPayable: parcel.parcel.chargesPayable ? String(Number(parcel.parcel.chargesPayable)) : "",
        handlingFee: parcel.parcel.handlingFee ? String(Number(parcel.parcel.handlingFee)) : "",
        totalFee: parcel.parcel.handlingFee && parcel.parcel.chargesPayable
          ? String(Number(parcel.parcel.handlingFee) + Number(parcel.parcel.chargesPayable))
          : "",
        thumbnails: parcel.parcel.thumbnails || [],
      },
      paymentOption: parcel.paymentOption || "bank",
      status: parcel.status || "arrived"
    }));

    const response = await fetch(`${apiKey}/shipment/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        parcels: processedParcels
      }),
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
      const response = await fetch(`${apiKey}/shipment?startDate=2025-01-15&endDate=2025-12-03&agent=true`, {
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
export const getAllParcel = async (phone:string) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/shipment?startDate=2025-01-15&endDate=2025-12-03&phoneNumber=${phone}&agent=true`, {
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
  
  