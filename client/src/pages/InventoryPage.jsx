import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import RatingsSummary from '../components/RatingsSummary';

const InventoryPage = () => {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ revenue: '', stock: '', performance: '' });

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products`, {
        params: { 
          shopId, 
          revenueFilter: filters.revenue, 
          stockFilter: filters.stock, 
          performanceFilter: filters.performance 
        }
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    
  
    const handleVisibilityChange = () => { 
      if (document.visibilityState === 'visible') fetchProducts(); 
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [shopId]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar shopName="Coffee Loot" shopColor="#8B7A2E" />
      
      <main className="flex-1 ml-56 p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-400 text-sm">View in-depth real-time insights about your product</p>
        </header>

     
        <div className="card px-5 py-4 mb-8 flex items-center gap-4 animate-fade-in">
          <span className="text-gray-700 font-semibold text-sm">Filter By:</span>
          
          <select className="filter-select" onChange={(e) => setFilters({...filters, revenue: e.target.value})}>
            <option value="">Revenue</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
          
          <select className="filter-select" onChange={(e) => setFilters({...filters, stock: e.target.value})}>
            <option value="">Stock Level</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
          
          <select className="filter-select" onChange={(e) => setFilters({...filters, performance: e.target.value})}>
            <option value="">Performance</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>

          <div className="ml-auto flex gap-4">
             <button className="text-primary-600 text-sm font-medium" onClick={() => window.location.reload()}>Clear All</button>
             <button className="btn-primary py-2 text-sm px-6" onClick={fetchProducts}>Apply Filters</button>
          </div>
        </div>


        <div className="space-y-8">
          {products.map((product) => (
            <div key={product._id} className="animate-slide-up">
              <h3 className="font-bold text-gray-800 mb-3 ml-2">{product.name}</h3>
              <div className="bg-gray-200/50 p-6 rounded-[2.5rem] grid grid-cols-4 gap-6 items-center">
                <div className="bg-white rounded-3xl overflow-hidden aspect-video shadow-sm border border-gray-100 flex items-center justify-center">
                  
                   <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                </div>
                
                <SummaryCard 
                  title="Total Revenue" 
                  value={`$${product.revenue?.toLocaleString()}`} 
                  change={product.revenueTrend} 
                />
                <SummaryCard 
                  title="Stock Level" 
                  value={product.stock > 50 ? 'High' : (product.stock > 10 ? 'Moderate' : 'Low')} 
                  subtitle={`${product.stock} units remaining`}
                />
                <SummaryCard 
                  title="Performance" 
                  value={`${product.performance}%`}
                  change={product.performanceTrend} 
                />
              </div>
              <div className="mt-3 max-w-sm">
                <RatingsSummary productId={product._id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;
