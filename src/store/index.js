// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from './slices/checkout/checkoutSlice';

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
});

export default store;