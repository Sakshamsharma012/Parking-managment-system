import axios from 'axios';

/**
 * Axios instance preconfigured with base URL and JWT interceptor.
 * Automatically attaches the JWT token to every request.
 * Redirects to login on 401 responses.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://parking-managment-system-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
