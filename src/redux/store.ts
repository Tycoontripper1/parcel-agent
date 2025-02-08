import {configureStore} from '@reduxjs/toolkit';
import formReducer from '@/redux/slices/formSlice';
import parcelReducer from '@/redux/slices/parcelSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    parcel: parcelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
