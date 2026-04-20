import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePricePage = () => {
    const { shopId } = useParams();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    const loadProducts = async () => {
        try {
            const res = await axios.get(`/api/products?shopId=${shopId}`);
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadProducts(); }, [shopId]);

    const savePrice = async () => {
        try {
            await axios.patch(`/api/products/${selectedProduct._id}/price`, { newPrice });
            setSelectedProduct(null);
            loadProducts();
        } catch (err) { alert("Error"); }
    };

    return (
        <div className="p-8">
            {!selectedProduct ? (
                <div className="grid grid-cols-3 gap-4">
                    {products.map(p => (
                        <div key={p._id} className="border p-4 rounded shadow">
                            <h3>{p.name}</h3>
                            <p>${p.price}</p>
                            <button onClick={() => setSelectedProduct(p)} className="bg-blue-500 text-white p-2 mt-2">Modify</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 shadow-lg">
                    <h2>Modify {selectedProduct.name}</h2>
                    <input type="number" onChange={(e) => setNewPrice(e.target.value)} className="border p-2 w-full" />
                    <button onClick={savePrice} className="bg-green-500 text-white p-2 mt-2">Save</button>
                    <button onClick={() => setSelectedProduct(null)} className="ml-2">Cancel</button>
                </div>
            )}
        </div>
    );
};
export default UpdatePricePage;
