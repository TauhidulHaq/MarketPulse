import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePricePage = () => {
  const { shopId } = useParams();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products?shopId=${shopId}&search=${search}`);
      setProducts(res.data);
    } catch (err) { console.error("Error fetching products:", err); }
  };

  useEffect(() => { fetchProducts(); }, [search, shopId]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`/api/products/${selectedProduct._id}/price`, { newPrice });
      setSelectedProduct(null);
      setNewPrice('');
      fetchProducts();
    } catch (err) { alert("Failed to update price"); }
  };

  return (
    <div className="p-8">
      {!selectedProduct ? (
        <>
          <input 
            className="border border-gray-200 rounded-lg p-3 w-full mb-6 outline-none" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} className="bg-white p-5 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-primary-600">${p.price?.toFixed(2)}</p>
                  <button onClick={() => setSelectedProduct(p)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
                    Modify Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-xl border">
          <button onClick={() => setSelectedProduct(null)} className="mb-4">← Back</button>
          <h2 className="text-xl font-bold mb-4">Modify Price: {selectedProduct.name}</h2>
          <input type="number" className="border p-3 w-full mb-4 rounded-xl" placeholder="New Price" onChange={(e) => setNewPrice(e.target.value)} />
          <button onClick={handleUpdate} className="bg-emerald-600 text-white w-full py-3 rounded-xl font-bold">Save Price</button>
        </div>
      )}
    </div>
  );
};
export default UpdatePricePage;
