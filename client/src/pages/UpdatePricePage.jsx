import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePricePage = () => {
    const { shopId } = useParams();
    const [products, setProducts] = useState([]);
    const [newPrices, setNewPrices] = useState({});

    const loadProducts = async () => {
        const res = await axios.get(`/api/products?shopId=${shopId}`);
        setProducts(res.data.data);
    };

    useEffect(() => { loadProducts(); }, [shopId]);

    const savePrice = async (id) => {
        await axios.patch(`/api/products/${id}/price`, { newPrice: newPrices[id] });
        loadProducts();
    };

    return (
        <div className="p-8 grid grid-cols-3 gap-4">
            {products.map(p => (
                <div key={p._id} className="border p-4 rounded">
                    <h3>{p.name}</h3>
                    <p>Current: ${p.price}</p>
                    <input type="number" onChange={(e) => setNewPrices({...newPrices, [p._id]: e.target.value})} className="border p-1 w-full" />
                    <button onClick={() => savePrice(p._id)} className="bg-blue-500 text-white p-2 mt-2 w-full">Update Price</button>
                </div>
            ))}
        </div>
    );
};
export default UpdatePricePage;
