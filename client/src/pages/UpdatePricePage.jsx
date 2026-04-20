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
        } catch (err) {
            console.error("Failed to load products", err);
        }
    };

    useEffect(() => {
        if (shopId) {
            loadProducts();
        }
    }, [shopId]);

    const savePrice = async (id) => {
        try {
            const priceToSave = newPrices[id];
            if (!priceToSave || isNaN(priceToSave)) {
                alert("Please enter a valid price.");
                return;
            }
         
            await axios.patch(`/api/products/${id}/price`, { newPrice: priceToSave });
            
            
            await loadProducts();
            
           
            setNewPrices({...newPrices, [id]: ''}); 
            
        } catch (err) {
            alert("Error updating price.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Update Product Prices</h1>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                    <div key={p._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category || 'Product'}</span>
                            <h3 className="font-bold text-gray-800 mt-1 mb-1">{p.name}</h3>
                            <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                            
                         
                            {p.description && (
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{p.description}</p>
                            )}
                        </div>

               
                        <div className="mt-6 space-y-4">
                          
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-2xl font-bold text-primary-600">${p.price?.toFixed(2)}</p>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={newPrices[p._id] || ''}
                                    onChange={(e) => setNewPrices({...newPrices, [p._id]: e.target.value})} 
                                    className="border border-gray-200 p-3 w-1/2 rounded-xl text-right outline-none focus:ring-2 focus:ring-primary-500" 
                                />
                            </div>

                            
                            <button 
                                onClick={() => savePrice(p._id)} 
                                className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold text-base hover:bg-emerald-700 transition"
                            >
                                Update Price
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            
            {products.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border">
                    <p className="text-xl font-medium">No products found for this shop.</p>
                    <p className="text-sm">Add some products or check the shop ID.</p>
                </div>
            )}
        </div>
    );
};
export default UpdatePricePage;
