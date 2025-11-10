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
  removeAddress as removeAddressAction,
} from './checkoutSlice';
import { toast } from 'react-toastify';

// Cargar el carrito
export const fetchCart = createAsyncThunk(
  'checkout/fetchCart',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      console.log('Iniciando fetchCart'); // 🐛
      const response = await api.get('/carts/users/cart');
      dispatch(setOrderSummary(response.data));
            console.log('Datos del carrito:', response.data); // 🐛
      console.log('Respuesta del carrito:', response.data);
      // El setOrderSummary se encarga ahora de guardar en localStorage
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

// Generar intención de pago con Stripe
export const createPaymentIntent = createAsyncThunk(
  'checkout/createPaymentIntent',
  async (totalPrice, { dispatch, rejectWithValue }) => {
    try {
      // Validaciones del monto
      if (totalPrice === undefined || totalPrice === null) {
        throw new Error('El monto total es requerido');
      }

      if (typeof totalPrice !== 'number' || isNaN(totalPrice)) {
        throw new Error('El monto total debe ser un número válido');
      }

      if (totalPrice < 10) {
        throw new Error('El monto mínimo de compra es $10 MXN');
      }

      console.log('Total Price recibido:', totalPrice);
      console.log('Tipo de totalPrice:', typeof totalPrice);

      const amountInCents = Math.round(totalPrice * 100);
      console.log('Amount en centavos:', amountInCents);

      // Validar que el monto en centavos sea válido
      if (amountInCents < 1000) { // Mínimo 10 MXN = 1000 centavos
        throw new Error('El monto en centavos debe ser al menos 1000 (10 MXN)');
      }

      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data } = await api.post('/order/stripe-client-secret', {
        amount: amountInCents,
        currency: 'mxm'
      });
      console.log('Respuesta real del backend:', data);
      if (!data || !data.client_secret) {
        throw new Error('No se recibió el client_secret del servidor');
      }

      console.log('Respuesta del servidor:', data.client_secret);

      // Guardar el client_secret en el estado
      // setClientSecret ahora maneja la persistencia en localStorage
      dispatch(setClientSecret(data.client_secret));

      return data.client_secret;
    } catch (error) {
      console.error('Error al crear payment intent:', error);

      // Determinar el mensaje de error apropiado
      const errorMessage = error.response?.data?.message || // Error del servidor
        error.message || // Error de nuestras validaciones
        'Error al crear la intención de pago'; // Mensaje por defecto

      // Actualizar el estado con el error
      dispatch(setError(errorMessage));

      // Mostrar el error al usuario
      toast.error(errorMessage);

      // Usar rejectWithValue para manejar el error en el componente
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Confirmar el pago y finalizar la orden
export const confirmOrder = createAsyncThunk(
  'checkout/confirmOrder',
  /**
   * payload: {
   *   addressId: number,
   *   paymentIntent: object
   * }
   */
  async ({ addressId, paymentIntent }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Construye el body exactamente como lo pide tu backend
      const body = {
        addressId: addressId,
        pgName: "Stripe",
        pgPaymentId: paymentIntent.id,
        pgStatus: paymentIntent.status,
        pgResponseMessage: "Payment successful"
      };

      const response = await api.post('/order/users/payments/CARD', body);

      // Limpiar el client secret después de una orden exitosa
      dispatch(setClientSecret(null));
      // Ya no es necesario llamar a persistState()

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
);export const confirmCashOrder = createAsyncThunk(
  'checkout/confirmCashOrder',
  async ({ addressId }, { dispatch, rejectWithValue }) => {
    try {
      // Validación robusta del addressId
      const parsedAddressId = Number(addressId);
      if (isNaN(parsedAddressId) || parsedAddressId <= 0) {
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
// GET /addresses
export const fetchAddresses = createAsyncThunk(
  'checkout/fetchAddresses',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.get('/users/addresses');
      // Simplemente actualizar el estado sin persistir
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

// POST /addresses
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
      // Ya no persistimos las direcciones

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

// PUT /addresses/{addressId}
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
      // Ya no persistimos las direcciones

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

// DELETE /addresses/{addressId}
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
      // Ya no persistimos las direcciones

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