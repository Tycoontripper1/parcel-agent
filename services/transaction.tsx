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

export const fundTransfer = async (data: {
    amount: string;
    bank_code?: string;
    account_number: string;
    account_name: string;
    narration?: string;

  }) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/wallets/transfer?userType=agent&trxType=outward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Funding failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  
export const nameEnquiry = async (data: {
bankCode: string;
    accountNumber: string;

  }) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/wallets/name-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Name Inquiry failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };

export const getAllBanks = async () => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/wallets/banks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get bank failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
export const getAllTransaction = async (
   startDate: string,
  endDate: string,
  direction?: 'credit' | 'debit',
  type?: 'inward' | 'outward' | 'wallet-to-wallet' | 'freeBalanceCharges',
  offset: number = 0,
  limit: number = 100
) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/wallets/transactions?userType=agent&startDate=${startDate}&endDate=${endDate}&offset=${offset}&limit=${limit}${
    direction ? `&direction=${direction}` : ''
  }${type ? `&type=${type}` : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get Transactions failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };