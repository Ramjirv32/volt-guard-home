import axios from 'axios';
import { auth } from './firebase';

// Flag to enable/disable API calls completely
export const USE_MOCK_DATA = true; // Set to true to use mock data exclusively

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000, // Shorter timeout to fail faster when backend is unavailable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    
    // Suppress connection refused errors from console logs
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('Backend server is not available. Using mock data.');
      return Promise.reject(new Error('Backend unavailable'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
