// api/auth.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
// export const apiKey = Constants.expoConfig?.extra?.apiKey;
export const apiKey = "http://45.9.191.184:8001/parcel/v1.0/api"

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



export const getUser = async (): Promise<any | null> => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
export const getDriver = async (): Promise<any | null> => {
  try {
    const driver = await AsyncStorage.getItem('driver');
    return driver ? JSON.parse(driver) : null;
  } catch (error) {
    console.error('Error getting driver:', error);
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
    const response = await fetch(`${apiKey}/auth/signup`, {
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
export const pushNotification = async (data: {
  userType: string;
  token: string;
}) => {
  try {
      const token = await getToken()
      console.log(token,"userToken")
    const response = await fetch(`${apiKey}/notifications/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'notification failed');
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

    const response = await fetch(`${apiKey}/auth/signin?userType=agent`, {
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

export const changePassword = async (data: {
  password: string;
  confirm: string;
}) => {
  try {
   const token = await getToken()
    const response = await fetch(`${apiKey}/auth/password?userType=agent`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'password reset failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
export const verifyOtpAccount = async (data: {
  emailPhone: string;
  otp: string;
}) => {
  try {
    const response = await fetch(`${apiKey}/auth/otp/verify?type=account_confirmation&userType=agent`, {
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
export const verifyOtpAccountReset = async (data: {
  emailPhone: string;
  otp: string;
}) => {
  try {
    const response = await fetch(`${apiKey}/auth/otp/verify?type=password_reset&userType=agent`, {
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
  emailPhone: string;
}) => {
  try {
    const response = await fetch(`${apiKey}/auth/otp/send?userType=agent`, {
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
    parkLocation: string;
    store: boolean;
    identificationType: string;
    identificationNumber: string;
    identificationImages: string[];
    userImage: string;
  },
) => {
  
  try {
    const token = await getToken()
    // console.log(token, 'token')
    const response = await fetch(`${apiKey}/users/update?type=profile&userType=agent`, {
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
export const updateUserProfile = async (
  payload: {
    userImage: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
) => {
  
  try {
    const token = await getToken()
    // console.log(token, 'token')
    const response = await fetch(`${apiKey}/users/update?type=profile&userType=agent`, {
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

export const updateDriverKyc = async (
  payload: {
    identificationImages: string[];
    userImage: string;
  },driverId:string
) => {
  
  try {
    const token = await getToken()
    // console.log(token, 'token')
    const response = await fetch(`${apiKey}/users/driver/${driverId}`, {
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
  DriverOnboardingPayload: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email?: string;
    phone: string;
    address: string;
    // identificationType: string;
    // identificationNumber: string;
    vehicleType: string;
    vehicleRegistrationNumber: string;
    parkLocation: string;
  }

) => {
  const token = await getToken()

  try {
    const response = await fetch(
      `${apiKey}/auth/onboarding`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(DriverOnboardingPayload),
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

// drivers
export const getAllDrivers = async () => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/users?userType=driver
`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get drivers failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
export const getDriverById = async (driverId:string) => {
    try {
        const token = await getToken()
      const response = await fetch(`${apiKey}/users?userType=driver&driverId=${driverId}
`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'get driver failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };


