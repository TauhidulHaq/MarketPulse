import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import { 
  getSimulatorProducts, 
  processSimulationCheckout, 
  processSimulationRefund, 
  getSimulatorRecentOrders, 
  validateCampaign,
  trackCartRemovalAPI
} from '../services/api';

const SimulatorPage = () => {
  const { shopId } = useParams();
  const [activeTab, setActiveTab] = useState('buy');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '' });
  const [refundForm, setRefundForm] = useState({ orderNumber: '', reason: 'Other', notes: '' });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchData();
  }, [shopId, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'buy') {
        const res = await getSimulatorProducts(shopId);
        setProducts(res.data.data);
      } else {
        const res = await getSimulatorRecentOrders(shopId);
        setRecentOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load simulator data');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) return showToast('Not enough stock');
      setCart(cart.map(item => item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };


const changeQty = async (productId, delta) => {
    //calc
    if (delta < 0) {
      const itemToReduce = cart.find(item => item.productId === productId);
      if (itemToReduce) {
        try {
        
          await trackCartRemovalAPI(shopId, {
            productId: itemToReduce.productId,
            quantity: Math.abs(delta),
            price: itemToReduce.price
          });
        } catch (err) {
          console.error("Failed to track cart abandonment", err);
        }
      }
    }

    
    setCart(cart.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const applyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode) return;
    try {
      const res = await validateCampaign(shopId, promoCode);
      setAppliedPromo(res.data.data);
      showToast(`Discount applied: ${res.data.data.discountPercentage}% off!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid promo code');
      setAppliedPromo(null);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showToast('Cart is empty');
    setProcessing(true);

    try {
      await processSimulationCheckout(shopId, { customerData: customerForm, items: cart, promoCode: appliedPromo?.code });
      showToast('Simulation: Order completed successfully!');
      setCart([]);
      setCustomerForm({ name: '', email: '', phone: '' });
      setPromoCode('');
      setAppliedPromo(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await processSimulationRefund(shopId, refundForm);
      showToast('Simulation: Refund processed successfully!');
      setRefundForm({ orderNumber: '', reason: 'Other', notes: '' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Refund failed');
    } finally {
      setProcessing(false);
    }
  };

  let cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedPromo ? cartTotal * (appliedPromo.discountPercentage / 100) : 0;
  cartTotal = cartTotal - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56 p-8">

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Point of Sale (POS)</h1>
            <p className="text-gray-500">Process manual orders and returns locally.</p>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button 
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'buy' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              New Sale
            </button>
            <button 
              onClick={() => setActiveTab('refund')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'refund' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Process Return
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-gray-500">Loading POS terminal...</p>
        ) : activeTab === 'buy' ? (
          <div className="flex gap-8">

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-fit">
              {products.map(p => (
                <div key={p._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">{p.category}</span>
                    <h3 className="font-bold text-gray-900 mt-3">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Stock: {p.stock}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <span className="font-bold text-lg text-primary-600">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-gray-500 text-sm">No products available. Add some products first.</p>}
            </div>


            <div className="w-96 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 h-fit sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Current Mock Order</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        <button onClick={() => changeQty(item.productId, -1)} className="w-6 h-6 flex justify-center items-center text-gray-600 hover:text-black">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => changeQty(item.productId, 1)} className="w-6 h-6 flex justify-center items-center text-gray-600 hover:text-black">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Subtotal:</span>
                <span className="text-lg font-bold text-gray-900">${(cartTotal + discountAmount).toFixed(2)}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between items-center mb-4 text-emerald-600">
                  <span className="font-medium text-sm">Discount (-{appliedPromo.discountPercentage}%):</span>
                  <span className="font-bold text-sm">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-6 pt-2">
                <span className="text-gray-900 font-bold">Total:</span>
                <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>

              <form onSubmit={applyPromo} className="flex gap-2 mb-6">
                 <input type="text" placeholder="Promo Code" 
                   value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                   className="flex-1 text-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500" />
                 <button type="submit" disabled={!promoCode} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold disabled:opacity-50">Apply</button>
              </form>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <input type="text" required placeholder="Customer Name"
                    value={customerForm.name} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <input type="email" required placeholder="Customer Email"
                    value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <input type="tel" placeholder="Phone Number (Optional)"
                    value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                </div>
                <button
                  type="submit"
                  disabled={processing || cart.length === 0}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Complete Sale'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Process a Return</h2>
              <p className="text-sm text-gray-500">Pick a recent order or type an order number to return items and subtract revenue.</p>
            </div>

            <form onSubmit={handleRefund} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Order Number</label>
                <input type="text" required placeholder="e.g. SIM-1000"
                  value={refundForm.orderNumber} onChange={e => setRefundForm({ ...refundForm, orderNumber: e.target.value })}
                  className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />

                <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
                  {recentOrders.map(order => (
                    <button key={order._id} type="button" onClick={() => setRefundForm({ ...refundForm, orderNumber: order.orderNumber })} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 whitespace-nowrap">
                      {order.orderNumber} ({order.customer?.name})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason</label>
                  <select
                    value={refundForm.reason} onChange={e => setRefundForm({ ...refundForm, reason: e.target.value })}
                    className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="Defective">Defective</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Not Satisfied">Not Satisfied</option>
                    <option value="Late Delivery">Late Delivery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Internal Note</label>
                  <input type="text" placeholder="Optional notes"
                    value={refundForm.notes} onChange={e => setRefundForm({ ...refundForm, notes: e.target.value })}
                    className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-xl shadow-md shadow-red-500/20 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Process Return'}
              </button>
            </form>
          </div>
        )}

      </main>


      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default SimulatorPage;
