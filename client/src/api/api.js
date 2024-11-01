// src/api/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Your API base URL
});

// Request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token'); // Or localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle token expiration
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Check if the error is due to an expired token (401 Unauthorized)
  if (error.response && error.response.status === 401) {
    // Token expired, clear session storage and redirect to login
    sessionStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  }
  return Promise.reject(error);
});

export default api; // Export the Axios instance
