import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ShopSelectionPage from './pages/ShopSelectionPage';
import DashboardOverview from './pages/DashboardOverview';
import CustomerPage from './pages/CustomerPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import Alerts from './pages/Alerts';
import OrdersPage from './pages/OrdersPage';
import SimulatorPage from './pages/SimulatorPage';
import PromotionsPage from './pages/PromotionsPage';
import RefundsPage from './pages/RefundsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/shops"
        element={
          <ProtectedRoute>
            <ShopSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId/overview"
        element={
          <ProtectedRoute>
            <DashboardOverview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shop/:shopId/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/shop/:shopId/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId/customers"
        element={
          <ProtectedRoute>
            <CustomerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shop/:shopId/simulator"
        element={
          <ProtectedRoute>
            <SimulatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId/campaigns"
        element={
          <ProtectedRoute>
            <PromotionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId/refunds"
        element={
          <ProtectedRoute>
            <RefundsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:shopId/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
