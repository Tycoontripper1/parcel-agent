import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Parcel {
  senderPhoneNumber: string;
  receiverPhoneNumber: string;
  departureState: string;
  deliveryMotorPark: string;
  parcelType: string;
  parcelValue: string;
  chargesPayable: string;
  chargesPayBy: string;
  handlingFee: string;
  sendingFrom:string
  senderAddress:string
  senderEmail:string
  receiverFullName:string
  receiverAddress:string
  parcelDescription: string;
  parcelImages: string[];
}

interface FormState {
  parcels: Parcel[];
  driverNumber: string;
  driverName: string;
  currentParcelIndex: number;
}

const initialState: FormState = {
  parcels: [{
    senderPhoneNumber: '',
    receiverPhoneNumber: '',
    departureState: '',
    deliveryMotorPark: '',
    parcelType: '',
    parcelValue: '',
    chargesPayable: '',
    chargesPayBy: '',
    handlingFee: '',
    sendingFrom:"",
    senderEmail:"",
    senderAddress:"",
    receiverAddress:"",
    receiverFullName:"",
    parcelDescription: '',
    parcelImages: [],
  }],
  driverNumber: '',
  driverName: '',
  currentParcelIndex: 0,
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
      (state[key] as any) = value;
    },
    addParcel: (state) => {
      state.parcels.push({
        senderPhoneNumber: '',
        receiverPhoneNumber: '',
        departureState: '',
        deliveryMotorPark: '',
        parcelType: '',
        parcelValue: '',
        chargesPayable: '',
            senderEmail:"",
            senderAddress:"",
        chargesPayBy: '',
        receiverAddress: '',
        receiverFullName: '',
          sendingFrom:"",
        handlingFee: '',
        parcelDescription: '',
        parcelImages: [],
      });
    },
    updateParcelField: (
      state,
      action: PayloadAction<{ index: number; key: keyof Parcel; value: any }>
    ) => {
      const { index, key, value } = action.payload;
      if (state.parcels[index]) {
        (state.parcels[index][key] as any) = value;
      }
    },
    updateParcelImages: (
      state,
      action: PayloadAction<{ index: number; images: string[] }>
    ) => {
      const { index, images } = action.payload;
      if (state.parcels[index]) {
        state.parcels[index].parcelImages = images;
      }
    },
    removeParcel: (state, action: PayloadAction<number>) => {
      if (action.payload > 0 && action.payload < state.parcels.length) {
        state.parcels.splice(action.payload, 1);
        if (state.currentParcelIndex >= state.parcels.length) {
          state.currentParcelIndex = state.parcels.length - 1;
        }
      }
    },

    setCurrentParcelIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.parcels.length) {
        state.currentParcelIndex = action.payload;
      }
    },
    resetForm: () => initialState,
  },
});

export const { 
  updateField, 
  addParcel, 
  updateParcelField, 
  updateParcelImages, 
  removeParcel,
  setCurrentParcelIndex,
  resetForm 
} = parcelSlice.actions;

export default parcelSlice.reducer;