import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePricePage = () => {
  const { shopId } = useParams(); // Get shopId from URL
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Fetch products based on search and shopId
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products?shopId=${shopId}&search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, shopId]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`/api/products/${selectedProduct._id}/price`, { newPrice });
      setSelectedProduct(null);
      setNewPrice('');
      fetchProducts(); // Refresh list instantly
    } catch (err) {
      alert("Failed to update price");
    }
  };

  return (
    <div className="p-8">
      {!selectedProduct ? (
        <>
          <input 
            className="border border-gray-200 rounded-lg p-3 w-full mb-6 outline-none focus:ring-2 focus:ring-primary-500" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category || 'Product'}</span>
                  <h3 className="font-bold text-gray-800 mt-1">{p.name}</h3>
                  <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-primary-600">${p.price?.toFixed(2)}</p>
                  <button 
                    onClick={() => setSelectedProduct(p)} 
                    className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                  >
                    Modify Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 mb-6">← Back</button>
          <h2 className="text-2xl font-bold mb-1">Modify Price</h2>
          <p className="text-gray-500 mb-6">Current price for {selectedProduct.name}: ${selectedProduct.price}</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-2">New Price ($)</label>
          <input 
            type="number" 
            className="border border-gray-200 rounded-xl p-3 w-full mb-6 outline-none focus:ring-2 focus:ring-emerald-500" 
            placeholder="0.00" 
            onChange={(e) => setNewPrice(e.target.value)} 
          />
          <button 
            onClick={handleUpdate} 
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            Save Price
          </button>
        </div>
      )}
    </div>
  );
};
export default UpdatePricePage;
