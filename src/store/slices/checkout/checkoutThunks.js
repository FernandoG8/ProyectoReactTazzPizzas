import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';
import {
  setAddressList,
  setLoading,
  setError,
  setSelectedAddress,
  setOrderSummary,
  setClientSecret,
  addAddress as addAddressAction,
  updateAddress as updateAddressAction,
  removeAddress as removeAddressAction
} from './checkoutSlice';
import { toast } from 'react-toastify';

export const fetchCart = createAsyncThunk(
  'checkout/fetchCart',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await api.get('/carts/users/cart');
      dispatch(setOrderSummary(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el carrito';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'checkout/createPaymentIntent',
  async (totalPrice, { dispatch, rejectWithValue }) => {
    try {
      if (totalPrice === undefined || totalPrice === null) {
        throw new Error('El monto total es requerido');
      }

      if (typeof totalPrice !== 'number' || Number.isNaN(totalPrice)) {
        throw new Error('El monto total debe ser un número válido');
      }

      if (totalPrice < 10) {
        throw new Error('El monto mínimo de compra es $10 MXN');
      }

      const amountInCents = Math.round(totalPrice * 100);

      if (amountInCents < 1000) {
        throw new Error('El monto en centavos debe ser al menos 1000 (10 MXN)');
      }

      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data } = await api.post('/order/stripe-client-secret', {
        amount: amountInCents,
        currency: 'mxm'
      });

      if (!data || !data.client_secret) {
        throw new Error('No se recibió el client_secret del servidor');
      }

      dispatch(setClientSecret(data.client_secret));

      return data.client_secret;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al crear la intención de pago';

      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const confirmOrder = createAsyncThunk(
  'checkout/confirmOrder',
  async ({ addressId, paymentIntent }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const body = {
        addressId: addressId,
        pgName: 'Stripe',
        pgPaymentId: paymentIntent.id,
        pgStatus: paymentIntent.status,
        pgResponseMessage: 'Payment successful'
      };

      const response = await api.post('/order/users/payments/CARD', body);

      dispatch(setClientSecret(null));
      toast.success('Pago procesado exitosamente');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al confirmar la orden';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const confirmCashOrder = createAsyncThunk(
  'checkout/confirmCashOrder',
  async ({ addressId }, { rejectWithValue }) => {
    try {
      const parsedAddressId = Number(addressId);
      if (Number.isNaN(parsedAddressId) || parsedAddressId <= 0) {
        throw new Error('ID de dirección inválido');
      }

      const response = await api.post('/order/users/payments/CASH', {
        addressId: parsedAddressId
      });

      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {
        message: 'Error desconocido al procesar el pago'
      };
      return rejectWithValue(errorData);
    }
  }
);

export const fetchAddresses = createAsyncThunk(
  'checkout/fetchAddresses',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.get('/users/addresses');
      dispatch(setAddressList(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar las direcciones';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createAddress = createAsyncThunk(
  'checkout/createAddress',
  async (addressData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.post('/addresses', addressData);
      const newAddress = response.data;

      dispatch(addAddressAction(newAddress));
      dispatch(setSelectedAddress(newAddress));
      toast.success('Dirección agregada exitosamente');
      return newAddress;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear la dirección';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateAddress = createAsyncThunk(
  'checkout/updateAddress',
  async ({ addressId, addressData }, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.put(`/addresses/${addressId}`, addressData);
      const updatedAddress = response.data;

      dispatch(updateAddressAction(updatedAddress));

      const { selectedAddress } = getState().checkout;
      if (selectedAddress?.addressId === addressId) {
        dispatch(setSelectedAddress(updatedAddress));
      }

      toast.success('Dirección actualizada exitosamente');
      return updatedAddress;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar la dirección';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'checkout/deleteAddress',
  async (addressId, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await api.delete(`/addresses/${addressId}`);

      dispatch(removeAddressAction(addressId));

      const { selectedAddress } = getState().checkout;
      if (selectedAddress?.addressId === addressId) {
        dispatch(setSelectedAddress(null));
      }

      toast.success('Dirección eliminada exitosamente');
      return addressId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar la dirección';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
