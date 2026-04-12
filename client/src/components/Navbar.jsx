import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('/shops')}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L8 20L16 20L12 36L28 20L20 20L24 4Z" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M28 12L36 20L28 28" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="text-lg font-bold text-gray-800">Market Pulse</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/shops')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Dashboard
            </button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Analytics
            </button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Settings
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="new-shop-nav-button"
            className="btn-primary text-sm flex items-center gap-1.5"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openAddShopModal'));
            }}
          >
            <span className="text-lg leading-none">+</span>
            NEW SHOP
          </button>

          <div className="relative group">
            <button
              id="user-avatar-button"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform duration-200 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${user?.avatar || '#C53030'}, ${user?.avatar || '#C53030'}dd)` }}
              onClick={handleLogout}
              title="Logout"
            >
              {user?.name?.charAt(0) || 'A'}
            </button>
            <div className="absolute right-0 top-full mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Click to logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
