import axios from 'axios';

// Professional Axios Instance
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API = axios.create({
  baseURL: isLocalhost ? 'http://localhost:5002/api' : 'https://rj-backend-9xr1.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
