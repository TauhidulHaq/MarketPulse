import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CustomerNotificationModal = ({ shopId, onClose, onNotify }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get(`/alerts/${shopId}/customers-to-notify`);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers to notify", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [shopId]);

  const handleNotify = async (customerId) => {
  
    setCustomers(prev => prev.filter(c => c._id !== customerId));
    
  
    if (onNotify) onNotify();
    
 
    alert(`Notification sent successfully!`);
  };

  const filteredCustomers = customers.filter(c => {
    if (filter === 'recurring') return c.orderCount > 1;
    if (filter === 'non-recurring') return c.orderCount === 1;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[80vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pending Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-4 border-b pb-4">
          {['all', 'recurring', 'non-recurring'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md capitalize font-medium ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Customer List */}
        <div className="overflow-y-auto flex-1 pr-2">
          {loading ? (
            <p className="text-center text-gray-500">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-500">No customers require notifications right now.</p>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map(customer => (
                <div key={customer._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: customer.avatar }}
                    >
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{customer.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">Orders: {customer.orderCount} • Last: {new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                      
                      {/* Notification Triggers */}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {customer.needsTimeBasedNudge && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                            &gt; 30 Days Inactive
                          </span>
                        )}
                        {customer.restockedItemNames?.length > 0 && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Restocked: {customer.restockedItemNames[0]} {customer.restockedItemNames.length > 1 ? `+${customer.restockedItemNames.length - 1} more` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleNotify(customer._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Notify Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerNotificationModal;