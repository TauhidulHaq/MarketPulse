import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePricePage = () => {
    const { shopId } = useParams();
    const [products, setProducts] = useState([]);
    const [newPrices, setNewPrices] = useState({});

    const loadProducts = async () => {
        try {
            const res = await axios.get(`/api/products?shopId=${shopId}`);
            setProducts(res.data.data);
        } catch (err) { console.error("Failed to load", err); }
    };

    useEffect(() => { if (shopId) loadProducts(); }, [shopId]);

    const savePrice = async (id) => {
        try {
            await axios.patch(`/api/products/${id}/price`, { newPrice: newPrices[id] });
            await loadProducts();
            setNewPrices({...newPrices, [id]: ''});
        } catch (err) { alert("Error"); }
    };

    return (
     
        <div className="flex min-h-screen bg-gray-50">
           
            <div className="w-64 bg-white border-r"></div>

            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Update Prices</h1>
                
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map(p => (
                        <div key={p._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category || 'Product'}</span>
                            <h3 className="font-bold text-gray-800 text-sm mt-1">{p.name}</h3>
                            
                            <div className="mt-4">
                                <p className="text-lg font-bold text-primary-600">${p.price?.toFixed(2)}</p>
                                <input 
                                    type="number" 
                                    placeholder="New Price" 
                                    value={newPrices[p._id] || ''}
                                    onChange={(e) => setNewPrices({...newPrices, [p._id]: e.target.value})} 
                                    className="border border-gray-200 p-2 w-full mt-2 rounded-lg text-sm" 
                                />
                                <button 
                                    onClick={() => savePrice(p._id)} 
                                    className="w-full bg-emerald-600 text-white py-2 mt-2 rounded-lg text-xs font-bold hover:bg-emerald-700"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default UpdatePricePage;
