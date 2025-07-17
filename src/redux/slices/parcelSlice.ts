
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  senderPhoneNumber: string;
  senderFullName: string;
  senderAddress: string;
  receiverPhoneNumber: string;
  receiverFullName: string;
  receiverAddress: string;
  senderEmail: string;
  receiverEmail: string;
  sendingFrom: string;
  deliveryMotorPark: string;
  parcelType: string;
  parcelValue: string;
  chargesPayable: string;
  chargesPayBy: string;
  parcelDescription: string;
  paymentMethod: string;
  parcelImages: string[];
  driverNumber: string;
  driverName: string;
  departureState: string;
  handlingFee: string;
  frequency: string;
}

const initialState: FormState = {
  senderPhoneNumber: '',
  senderFullName: '',
  senderAddress: '',
  receiverPhoneNumber: '',
  receiverFullName: '',
  receiverAddress: '',
  senderEmail: '',
  receiverEmail: '',
  sendingFrom: '',
  deliveryMotorPark: '',
  parcelType: '',
  parcelValue: '',
  driverName: '',
  chargesPayable: '',
  chargesPayBy: '',
  parcelDescription: '',
  paymentMethod: '',
  parcelImages: [''],
  driverNumber: '',
  departureState: '',
  handlingFee: '',
  frequency: ''
};

const parcelSlice = createSlice({
  name: 'parcel',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ key: keyof FormState; value: any }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetForm: () => initialState, // 🔥 Clean and simple reset
  },
});

export const { updateField, resetForm } = parcelSlice.actions;
export default parcelSlice.reducer;

