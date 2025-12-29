import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token dynamically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // read latest token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect unauthenticated admin requests back to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      // Only redirect if on protected dashboard routes
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
