import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';

const STATUSES = ['pending','processing','shipped','delivered'];

const OrderKanban = ({ shopId }) => {
  const [columns, setColumns] = useState({});

  const fetch = async () => {
    try {
      const res = await getOrders({ shopId });
      const orders = res.data.data || [];
      const cols = {};
      STATUSES.forEach(s => cols[s] = []);
      orders.forEach(o => { if (cols[o.status]) cols[o.status].push(o); else cols.pending.push(o); });
      setColumns(cols);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (shopId) fetch(); }, [shopId]);

  const move = async (orderId, from, to) => {
    try {
      await updateOrderStatus(orderId, { status: to });
      fetch();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="card p-4">
      <div className="text-sm font-bold mb-3">Order Pipeline</div>
      <div className="flex gap-4 overflow-auto">
        {STATUSES.map(status => (
          <div key={status} className="w-64 bg-gray-50 p-2 rounded">
            <div className="font-semibold text-xs mb-2">{status.toUpperCase()}</div>
            <div className="flex flex-col gap-2">
              {(columns[status] || []).map(o => (
                <div key={o._id} className="p-2 bg-white rounded shadow-sm">
                  <div className="text-xs font-bold">{o.orderNumber || o._id}</div>
                  <div className="text-xs text-gray-500">${o.totalAmount}</div>
                  <div className="mt-2 flex gap-1">
                    {STATUSES.filter(s=>s!==status).map(s=> (
                      <button key={s} onClick={()=>move(o._id, status, s)} className="text-xs px-2 py-1 bg-gray-100 rounded">Move to {s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderKanban;
