import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

export const getShops = () => api.get('/shops');
export const getShopById = (id) => api.get(`/shops/${id}`);
export const createShop = (data) => api.post('/shops', data);
export const updateShop = (id, data) => api.put(`/shops/${id}`, data);


export const getDashboardOverview = (shopId, params) =>
  api.get(`/dashboard/${shopId}/overview`, { params });
export const getTopHours = (shopId, params) =>
  api.get(`/dashboard/${shopId}/top-hours`, { params });

export const getDailyGoal = (shopId) => api.get(`/shops/${shopId}/goal`);
export const setDailyGoal = (shopId, goal) => api.post(`/shops/${shopId}/goal`, { goal });

export const getProductReviews = (productId) => api.get(`/products/${productId}/reviews`);
export const createProductReview = (productId, data) => api.post(`/products/${productId}/reviews`, data);

export const getOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (orderId, status) => api.put(`/orders/${orderId}/status`, { status });


export const getCustomers = (shopId, params) =>
  api.get(`/customers/${shopId}`, { params });
export const getCustomerStats = (shopId) =>
  api.get(`/customers/${shopId}/stats`);

export const getSimulatorProducts = (shopId) => api.get(`/simulator/products/${shopId}`);
export const processSimulationCheckout = (shopId, data) => api.post(`/simulator/checkout/${shopId}`, data);
export const processSimulationRefund = (shopId, data) => api.post(`/simulator/refund/${shopId}`, data);
export const getSimulatorRecentOrders = (shopId) => api.get(`/simulator/orders/${shopId}`);

export const getCampaigns = (shopId) => api.get(`/campaigns/${shopId}`);
export const createCampaign = (shopId, data) => api.post(`/campaigns/${shopId}`, data);
export const toggleCampaign = (shopId, campaignId) => api.put(`/campaigns/${shopId}/${campaignId}/toggle`);
export const validateCampaign = (shopId, code) => api.get(`/campaigns/${shopId}/validate/${code}`);

export const getRefundsOverview = (shopId) => api.get(`/refunds/${shopId}`);

export default api;
