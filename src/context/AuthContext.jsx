// src/context/auth/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api'; 
import { authReducer, initialState } from './authReducer';
import { login as loginAction, logout as logoutAction } from '../store/slices/auth/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUsername = localStorage.getItem('username');
      const storedRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      
      if (storedUsername && storedRoles.length > 0) {
        const userData = {
          username: storedUsername,
          roles: storedRoles
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: userData });
        reduxDispatch(loginAction(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (username, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/auth/signin', { username, password });

      if (response.data && response.data.username) {
        const userData = {
          username: response.data.username,
          roles: response.data.roles
        };
        console.log('Login exitoso:', userData);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userRoles', JSON.stringify(userData.roles));

        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        reduxDispatch(loginAction(userData));

        return { success: true, data: userData };
      }
      throw new Error('Respuesta inválida del servidor');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en la autenticación';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/signout', {});
      localStorage.removeItem('username');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userRole');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('checkout-state');
      dispatch({ type: 'LOGOUT' });
      reduxDispatch(logoutAction());
      return { success: true };
    } catch (err) {
      console.error('Error en logout:', err);
      return { success: false, error: err.message };
    }
  };

  const hasRole = (requiredRoles) => {
    if (!state.user?.roles) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.some(role => state.user.roles.includes(role));
    }
    return state.user.roles.includes(requiredRoles);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    isLoggedIn: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    hasRole,
    clearError
  };

  if (state.loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;