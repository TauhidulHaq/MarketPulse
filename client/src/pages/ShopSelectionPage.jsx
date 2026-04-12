import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShopCard, { AddShopCard } from '../components/ShopCard';
import AddShopModal from '../components/AddShopModal';
import { getShops } from '../services/api';

const ShopSelectionPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();

    const handleOpenModal = () => setShowModal(true);
    window.addEventListener('openAddShopModal', handleOpenModal);
    return () => window.removeEventListener('openAddShopModal', handleOpenModal);
  }, []);

  const fetchShops = async () => {
    try {
      const response = await getShops();
      setShops(response.data.data);
    } catch (err) {
      console.error('Failed to fetch shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (shop) => {
    navigate(`/shop/${shop._id}/overview`);
  };

  const handleShopCreated = (newShop) => {
    setShops((prev) => [newShop, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Select a Shop</h1>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Welcome back. Choose a profile to manage your business operations and view real-time insights.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shops.map((shop, index) => (
              <div
                key={shop._id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <ShopCard shop={shop} onClick={handleShopClick} />
              </div>
            ))}
            <div
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${shops.length * 100}ms`, animationFillMode: 'forwards' }}
            >
              <AddShopCard onClick={() => setShowModal(true)} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 bg-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm text-gray-400">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L8 20L16 20L12 36L28 20L20 20L24 4Z" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M28 12L36 20L28 28" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span>© 2026 Market Pulse. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      <AddShopModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onShopCreated={handleShopCreated}
      />
    </div>
  );
};

export default ShopSelectionPage;
