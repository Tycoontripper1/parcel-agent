import {configureStore} from '@reduxjs/toolkit';
import formReducer from '@/redux/slices/formSlice';
import parcelReducer from '@/redux/slices/parcelSlice';
import parcelVariationReducer from "@/redux/slices/parcelVariationSlice"

export const store = configureStore({
  reducer: {
    form: formReducer,
    parcel: parcelReducer,
    parcelVariation:parcelVariationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
