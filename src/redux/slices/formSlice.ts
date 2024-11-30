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
      state[key] = value;
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
    },
  },
});

export const {updateField, resetForm} = formSlice.actions;
export default formSlice.reducer;
