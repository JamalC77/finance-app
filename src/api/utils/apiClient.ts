import axios from 'axios';
import { env } from './env';

// Determine the API base URL
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      // Get token from localStorage - check both 'token' and 'financeAppToken'
      // This is to ensure compatibility with different token storage keys
      const token = localStorage.getItem('token') || localStorage.getItem('financeAppToken');
      
      // If token exists, add it to the request headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle browser-specific actions in browser environment
    if (typeof window !== 'undefined') {
      // Log the error for debugging
      console.error('API Response Error:', error);
      
      // Handle 401 Unauthorized errors (token expired or invalid)
      if (error.response && error.response.status === 401) {
        console.log('Auth error: Unauthorized (401)');
        
        // Clear both tokens for consistency
        localStorage.removeItem('token');
        localStorage.removeItem('financeAppToken');
        
        // Redirect to login page
        window.location.href = '/auth/login';
      }
      
      // Handle 403 Forbidden errors (insufficient permissions)
      if (error.response && error.response.status === 403) {
        console.error('Permission denied: Forbidden (403)');
        // You could redirect to an access denied page or show a notification
      }
    }
    
    return Promise.reject(error);
  }
); 