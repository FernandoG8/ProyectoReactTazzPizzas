  // src/context/auth/authReducer.js
  export const initialState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  };

  export const authReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
      case 'AUTH_SUCCESS':
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload,
          loading: false,
          error: null
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        };
      case 'AUTH_ERROR':
      case 'LOGIN_ERROR':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          loading: false,
          error: action.payload
        };
      case 'SET_LOADING':
        return {
          ...state,
          loading: action.payload
        };
      case 'CLEAR_ERROR':
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };