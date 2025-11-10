// src/store/slices/checkout/addressSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses = [...state.addresses, action.payload];
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
      state.selectedAddress = state.selectedAddress?.id === action.payload ? null : state.selectedAddress;
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  addAddress,
  removeAddress,
  selectAddress,
  setLoading,
  setError
} = addressSlice.actions;

export default addressSlice.reducer;