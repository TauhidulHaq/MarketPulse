import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePricePage = () => {
    const { shopId } = useParams();
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    const loadProducts = async () => {
        const res = await axios.get(`/api/products?shopId=${shopId}`);
        setProducts(res.data.data);
    };

    useEffect(() => { loadProducts(); }, [shopId]);

    const savePrice = async (id) => {
        await axios.patch(`/api/products/${id}/price`, { newPrice });
        setEditId(null);
        loadProducts();
    };

    return (
        <div className="p-8 grid grid-cols-3 gap-4">
            {products.map(p => (
                <div key={p._id} className="border p-4 rounded shadow">
                    <h3>{p.name}</h3>
                    <p>${p.price}</p>
                    {editId === p._id ? (
                        <>
                            <input type="number" onChange={(e) => setNewPrice(e.target.value)} className="border p-1 w-full" />
                            <button onClick={() => savePrice(p._id)} className="bg-green-500 text-white p-1 mt-1 w-full">Save</button>
                        </>
                    ) : (
                        <button onClick={() => setEditId(p._id)} className="bg-blue-500 text-white p-1 mt-1 w-full">Modify Price</button>
                    )}
                </div>
            ))}
        </div>
    );
};
export default UpdatePricePage;
