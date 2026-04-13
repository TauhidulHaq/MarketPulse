import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CustomerNotificationModal from '../components/CustomerNotificationModal';

const Alerts = () => {
  const { shopId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await axios.get(`/api/alerts/${shopId}/overview`);
        setDashboardData(data);
        setNotifCount(data.metrics.notificationsSent);
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    };
    if (shopId) fetchAlerts();
  }, [shopId]);

  if (!dashboardData) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-56 p-8 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Loading Alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* 1. Inject the Sidebar and pass the dynamic shop details */}
      <Sidebar 
        shopName={dashboardData.shop?.name} 
        shopColor={dashboardData.shop?.color} 
      />

      {/* 2. Wrap content in flex-1 and add ml-56 to clear the fixed sidebar */}
      <div className="flex-1 ml-56 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-500">Manage low stock and expiring items requiring immediate attention.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
            Export Report
          </button>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-red-600 font-bold text-sm tracking-wider mb-2">CRITICAL STOCK</h3>
            <p className="text-4xl font-bold">{dashboardData.metrics.criticalStockCount}</p>
            <p className="text-gray-400 text-sm mt-2">Items require immediate restocking</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-orange-500 font-bold text-sm tracking-wider mb-2">EXPIRING SOON</h3>
            <p className="text-4xl font-bold">{dashboardData.metrics.expiringSoonCount}</p>
            <p className="text-gray-400 text-sm mt-2">Consider restocking to maintain regular operations</p>
          </div>

          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => setShowNotificationModal(true)}
          >
            <h3 className="text-gray-500 font-bold text-sm tracking-wider mb-2">NOTIFICATIONS SENT</h3>
            <p className="text-4xl font-bold">{notifCount}</p>
            <p className="text-gray-400 text-sm mt-2">Customers have been notified based on their purchase patterns. Click to manage.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Requiring Action */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">ITEMS REQUIRING ACTION</h2>
            {dashboardData.itemsRequiringAction.length === 0 ? (
              <p className="text-gray-500 italic p-4 bg-gray-50 rounded">All inventory looks good right now!</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.itemsRequiringAction.map((item, idx) => (
                  <div key={idx} className="bg-gray-100 p-4 rounded-md">
                    <h4 className={`font-bold text-sm mb-1 ${item.type === 'CRITICAL_STOCK' ? 'text-red-600' : 'text-orange-500'}`}>
                        {item.type === 'CRITICAL_STOCK' ? 'CRITICAL STOCK' : 'EXPIRY NOTICE'}
                    </h4>
                    <p className="font-bold text-gray-800">PRODUCT: {item.data.name.toUpperCase()}</p>
                    <p className="text-sm text-gray-600">ID: {item.data._id.slice(-6).toUpperCase()}</p> 
                    <p className="text-sm font-semibold mt-1">
                      STATUS BADGE: 
                      <span className={item.type === 'CRITICAL_STOCK' ? 'text-red-500 ml-1' : 'text-orange-500 ml-1'}>
                        {item.type === 'CRITICAL_STOCK' ? 'OUT OF STOCK' : 'EXPIRES SOON'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Sales Feed */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">LIVE SALES</h2>
            <div className="space-y-3">
              {dashboardData.liveSales.map((order) => (
                <div key={order._id} className="bg-gray-100 p-3 rounded-md flex items-center text-sm font-medium">
                  <span className="mr-2">🛍️</span>
                  ORDER {order.orderNumber} PLACED • ${order.totalAmount.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNotificationModal && (
          <CustomerNotificationModal 
            shopId={shopId} 
            onClose={() => setShowNotificationModal(false)} 
            onNotify={() => setNotifCount(prev => prev + 1)} 
          />
        )}
      </div>
    </div>
  );
};

export default Alerts;