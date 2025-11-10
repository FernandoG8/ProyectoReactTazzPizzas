import axios from 'axios';

const apiImages = axios.create({
  baseURL: process.env.REACT_APP_IMAGES_API_URL || 'http://localhost:8080', // Default to localhost if not set
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add interceptors if needed
apiImages.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiImages;