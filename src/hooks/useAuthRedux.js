// src/hooks/useCheckout.js
import { useDispatch } from 'react-redux';

export const useCheckout = () => {
  const dispatch = useDispatch();

  const clearCheckout = () => {
    dispatch({ type: 'CLEAR_CHECKOUT' });
  };

  return {
    clearCheckout
  };
};