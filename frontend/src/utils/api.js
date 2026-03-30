import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Attempt to grab token from local storage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
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

// Optional: Add response interceptor for global error handling (e.g. 401 unauth)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage and redirect on token expiration
      localStorage.removeItem('userInfo');
      // window.location.href = '/login'; // Let components handle this gracefully if desired
    }
    return Promise.reject(error);
  }
);

export default api;
