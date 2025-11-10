// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from './slices/checkout/checkoutSlice';
import authReducer from './slices/auth/authSlice';

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: []
      }
    })
});

export default store;
