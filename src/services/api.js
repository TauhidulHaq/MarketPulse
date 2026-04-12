import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mp_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== API Functions =====

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Shops
export const getShops = () => api.get('/shops');
export const getShopById = (id) => api.get(`/shops/${id}`);
export const createShop = (data) => api.post('/shops', data);
export const updateShop = (id, data) => api.put(`/shops/${id}`, data);

// Dashboard
export const getDashboardOverview = (shopId, params) =>
  api.get(`/dashboard/${shopId}/overview`, { params });

// Customers
export const getCustomers = (shopId, params) =>
  api.get(`/customers/${shopId}`, { params });
export const getCustomerStats = (shopId) =>
  api.get(`/customers/${shopId}/stats`);

export default api;
