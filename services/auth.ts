// api/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'http://185.230.64.174:8001/parcel/v1.0/api'; // change this



export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};


export const getUser = async (): Promise<any | null> => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'user']);
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
export const loginUser = async (data: {
  emailPhone: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signin?userType=agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
export const verifyOtpAccount = async (data: {
  email: string;
  otp: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/otp/verify?type=account_confirmation&userType=agent`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(data),
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
export const resendOtp = async (data: {
  email: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/otp/send?userType=agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Otp sent failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
export const updateUserKyc = async (
  payload: {
    businessName: string;
    state: string;
    address: string;
    location: string;
    store: boolean;
    identificationType: string;
    identificationNumber: string;
    identificationImages: string[];
    userImage: string;
  },
) => {
  
  try {
    const token = await getToken()
    console.log(token, 'token')
    const response = await fetch(`${BASE_URL}/users/update?type=kyc&userType=agent`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'user kyc update failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const onboardingDriver = async (
  data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    parkLocation: string;
    vehicleType: string;
    vehicleRegistrationNumber: string;
    email?: string;
  },

) => {
  const token = getToken()
  try {
    const response = await fetch(
      `${BASE_URL}/auth/onboarding`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Driver Onboarding failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};


