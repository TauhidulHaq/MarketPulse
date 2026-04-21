import { useEffect, useMemo, useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';

const COLUMNS = ['pending', 'processing', 'shipped', 'delivered'];

const OrderKanban = ({ shopId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getOrders({ shopId });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchOrders();
    }
  }, [shopId]);

  const grouped = useMemo(() => {
    const result = { pending: [], processing: [], shipped: [], delivered: [] };
    orders.forEach((order) => {
      if (result[order.status]) {
        result[order.status].push(order);
      }
    });
    return result;
  }, [orders]);

  const moveForward = async (order) => {
    const idx = COLUMNS.indexOf(order.status);
    if (idx < 0 || idx === COLUMNS.length - 1) return;

    const nextStatus = COLUMNS[idx + 1];
    setUpdatingId(order._id);
    try {
      const res = await updateOrderStatus(order._id, nextStatus);
      const updated = res.data.data;
      setOrders((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="card p-6 animate-pulse h-80" />;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => (
        <div key={col} className="bg-gray-100/70 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase">{col}</h3>
            <span className="text-xs text-gray-500">{grouped[col].length}</span>
          </div>

          <div className="space-y-2">
            {grouped[col].map((order) => (
              <article key={order._id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">{order.orderNumber}</p>
                <p className="text-xs text-gray-500 mb-2">${Math.round(order.totalAmount).toLocaleString()}</p>
                <button
                  type="button"
                  disabled={updatingId === order._id || col === 'delivered'}
                  onClick={() => moveForward(order)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
                >
                  {col === 'delivered' ? 'Completed' : updatingId === order._id ? 'Updating...' : 'Move next'}
                </button>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default OrderKanban;
