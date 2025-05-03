// import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// interface FormState {
//   senderPhoneNumber: string;
//   senderFullName: string;
//   senderAddress: string;
//   receiverPhoneNumber: string;
//   receiverFullName: string;
//   receiverAddress: string;
//   senderEmail: string;
//   receiverEmail: string;
//   sendingFrom: string;
//   deliveryMotorPark: string;
//   parcelType: string;
//   parcelValue: string;
//   chargesPayable: string;
//   chargesPayBy: string;
//   parcelDescription: string;
//   paymentMethod: string;
//   parcelImages: string[];
//   driverNumber: string;
//   departureState: string;
//   frequency:string
// }

// const initialState: FormState = {
//   senderPhoneNumber: '',
//   senderFullName: '',
//   senderAddress: '',
//   receiverPhoneNumber: '',
//   receiverFullName: '',
//   receiverAddress: '',
//   senderEmail: '',
//   receiverEmail: '',
//   sendingFrom: '',
//   deliveryMotorPark: '',
//   parcelType: '',
//   parcelValue: '',
//   chargesPayable: '',
//   chargesPayBy: '',
//   parcelDescription: '',
//   paymentMethod: '',
//   parcelImages: [''],
//   driverNumber: '',
//   departureState: '',
//   frequency:''
// };

// const parcelSlice = createSlice({
//   name: 'parcel',
//   initialState,
//   reducers: {
//     updateField: (
//       state,
//       action: PayloadAction<{key: keyof FormState; value: any}>
//     ) => {
//       const {key, value} = action.payload;
//       state[key] = value;
//     },
//     resetForm: (state) => {
//       state.receiverAddress = '';
//       state.receiverEmail = '';
//       state.receiverFullName = '';
//       state.senderAddress = '';
//       state.senderEmail = '';
//       state.chargesPayBy = '';
//       state.chargesPayable = '';
//       state.deliveryMotorPark = '';
//       state.parcelDescription = '';
//       state.parcelImages = [''];
//       state.parcelType = '';
//       state.parcelValue = ''; // Preserve the image
//       state.paymentMethod = '';
//       state.senderFullName = '';
//       state.senderPhoneNumber = '';
//       state.sendingFrom = '';
//       state.departureState = '';
//       state.driverNumber = '';
//       state.frequency = ''
//     },
//   },
// });

// export const {updateField, resetForm} = parcelSlice.actions;
// // export const selectParcel = (state: RootState) => state.parcel;
// export default parcelSlice.reducer;
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

