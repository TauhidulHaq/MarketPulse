import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdatePricePage = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');


  useEffect(() => {
    axios.get(`/api/products?search=${search}`).then(res => setProducts(res.data));
  }, [search]);

  const handleUpdate = async () => {
    await axios.patch(`/api/products/${selectedProduct._id}/price`, { newPrice });
    setSelectedProduct(null); 
    setSearch('');
  };

  return (
    <div className="p-8">
      {!selectedProduct ? (
        <>
          <input className="border p-2 w-full mb-4" placeholder="Search products..." onChange={(e) => setSearch(e.target.value)} />
          <div className="grid grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p._id} className="border p-4 rounded-xl cursor-pointer" onClick={() => setSelectedProduct(p)}>
                <h3 className="font-bold">{p.name}</h3>
                <p>${p.price}</p>
                <button className="bg-blue-500 text-white px-4 py-1 mt-2 rounded">Modify</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          <button onClick={() => setSelectedProduct(null)} className="mb-4">← Back</button>
          <h2 className="text-xl font-bold mb-4">Modify Price: {selectedProduct.name}</h2>
          <input type="number" className="border p-2 w-full mb-4" placeholder="New Price" onChange={(e) => setNewPrice(e.target.value)} />
          <button onClick={handleUpdate} className="bg-emerald-600 text-white px-6 py-2 rounded">Save Price</button>
        </div>
      )}
    </div>
  );
};
export default UpdatePricePage;
