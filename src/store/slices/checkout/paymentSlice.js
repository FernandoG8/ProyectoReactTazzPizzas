// src/store/slices/checkout/paymentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  method: null,        // 'card', 'cash', etc.
  details: null,       // Detalles del método de pago
  status: 'idle',      // 'idle', 'processing', 'completed', 'error'
  error: null,         // Mensaje de error si algo falla
  amount: 0,          // Monto a pagar
  currency: 'MXN'     // Moneda
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.method = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.details = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.status = action.payload;
    },
    setPaymentError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    resetPayment: (state) => {
      return initialState;
    }
  }
});

export const {
  setPaymentMethod,
  setPaymentDetails,
  setPaymentStatus,
  setPaymentError,
  setAmount,
  resetPayment
} = paymentSlice.actions;

export default paymentSlice.reducer;