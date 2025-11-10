// src/store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import addressReducer from './slices/checkout/addressSlice';
import uiReducer from './slices/ui/uiSlice';

const rootReducer = combineReducers({
  checkout: addressReducer,
  ui: uiReducer,
  // Aquí puedes agregar más reducers según necesites
});

export default rootReducer;