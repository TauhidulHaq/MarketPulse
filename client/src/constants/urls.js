// Quick Access URLs Configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

export const URLS = {
  // Authentication Pages
  login: `${APP_URL}/login`,
  logout: `${APP_URL}/logout`,
  
  // Dashboard Pages
  dashboard: `${APP_URL}/dashboard`,
  shopSelection: `${APP_URL}/shop-selection`,
  
  // Main Pages
  orders: `${APP_URL}/orders`,
  inventory: `${APP_URL}/inventory`,
  customers: `${APP_URL}/customers`,
  promotions: `${APP_URL}/promotions`,
  refunds: `${APP_URL}/refunds`,
  alerts: `${APP_URL}/alerts`,
  reports: `${APP_URL}/reports`,
  simulator: `${APP_URL}/simulator`,
  
  // API Endpoints
  api: {
    auth: `${BASE_URL}/api/auth`,
    shops: `${BASE_URL}/api/shops`,
    orders: `${BASE_URL}/api/orders`,
    products: `${BASE_URL}/api/products`,
    customers: `${BASE_URL}/api/customers`,
    campaigns: `${BASE_URL}/api/campaigns`,
    goals: `${BASE_URL}/api/goals`,
    refunds: `${BASE_URL}/api/refunds`,
    alerts: `${BASE_URL}/api/alerts`,
    reviews: `${BASE_URL}/api/reviews`,
    reports: `${BASE_URL}/api/reports`,
    simulator: `${BASE_URL}/api/simulator`,
  }
};

export default URLS;
