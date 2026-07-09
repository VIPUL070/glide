import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import vehicleReducer from './vehicleSlice';

export const store = configureStore({
    reducer: {
      user: userReducer,
      vehicle: vehicleReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch