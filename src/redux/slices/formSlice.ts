import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FormState {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  otp: string;
  businessName: string;
  state: string;
  address: string;
  location: string;
  idType: string;
  idNumber: string;
  idFrontImage: string;
  idBackImage: string;
  store: string;
  facialVerificationImage: string; // Optional
      amount: number;
    bank_code?: string;
    account_number: string;
    account_name: string;
    sender_name: string;
    narration?: string;
  bank: {
    code: string;
    name: string;
  }; // Optional, can be empty
}

const initialState: FormState = {
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  otp: '',
  businessName: '',
  state: '',
  address: '',
  location: '',
  idType: '',
  idNumber: '',
  idFrontImage: '',
  idBackImage: '',
  store: '',
  facialVerificationImage: '',
  amount: 0, // Initialize amount to 0
  bank: {
    code: '',
    name: '',
  }, // Optional, can be empty
  account_number: '',
  account_name: '',
  sender_name: '',
  narration: '', // Optional, can be empty
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{key: keyof FormState; value: any}>
    ) => {
      const {key, value} = action.payload;
      (state as any)[key] = value;
    },
    resetForm: (state) => {
      state.fullName = '';
      state.phoneNumber = '';
      state.email = '';
      state.password = '';
      state.otp = '';
      state.businessName = '';
      state.state = '';
      state.address = '';
      state.location = '';
      state.idType = '';
      state.idNumber = '';
      state.idFrontImage = state.idFrontImage; // Preserve the image
      state.idBackImage = '';
      state.store = '';
      state.facialVerificationImage = '';
      state.amount = 0; // Reset amount to 0
      state.bank_code = ''; // Reset bank_code to empty
      state.account_number = '';
      state.account_name = '';
      state.sender_name = '';
      state.narration = ''; // Reset narration to empty
      state.bank = {
        code: '',
        name: '',
      }; // Reset bank to empty
    },
  },
});

export const {updateField, resetForm} = formSlice.actions;
export default formSlice.reducer;
