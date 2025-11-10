// src/store/slices/checkout/addressThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';
import {
  setLoading,
  setLoadingButton,
  setError,
  setSuccess,
  setDirecciones,
  setDireccionSeleccionada,
  removeDireccionSeleccionada
} from './addressSlice';

export const obtenerDirecciones = createAsyncThunk(
  'address/obtenerDirecciones',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await api.get('/addresses');
      dispatch(setDirecciones(response.data));
      dispatch(setSuccess());
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Error al obtener direcciones'));
      throw error;
    }
  }
);

export const agregarActualizarDireccion = createAsyncThunk(
  'address/agregarActualizarDireccion',
  async ({ datos, direccionId = null }, { dispatch }) => {
    dispatch(setLoadingButton(true));
    try {
      let response;
      if (direccionId) {
        response = await api.put(`/addresses/${direccionId}`, datos);
      } else {
        response = await api.post('/addresses', datos);
      }
      await dispatch(obtenerDirecciones());
      dispatch(setSuccess());
      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Error al guardar la dirección'));
      throw error;
    }
  }
);

export const eliminarDireccion = createAsyncThunk(
  'address/eliminarDireccion',
  async (id, { dispatch }) => {
    dispatch(setLoadingButton(true));
    try {
      await api.delete(`/addresses/${id}`);
      await dispatch(obtenerDirecciones());
      dispatch(setSuccess());
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Error al eliminar la dirección'));
      throw error;
    }
  }
);

export const seleccionarDireccion = (direccion) => (dispatch) => {
  dispatch(setDireccionSeleccionada(direccion));
};

export const limpiarDireccion = () => (dispatch) => {
  dispatch(removeDireccionSeleccionada());
};

export const validarDireccionesUsuario = createAsyncThunk(
  'address/validarDirecciones',
  async (_, { dispatch, getState }) => {
    try {
      const { direcciones } = getState().address;
      if (!direcciones || direcciones.length === 0) {
        await dispatch(obtenerDirecciones());
      }
      return getState().address.direcciones;
    } catch (error) {
      console.error("Error al validar direcciones:", error);
      throw error;
    }
  }
);