import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import RatingsSummary from '../components/RatingsSummary';

const ReportsPage = () => {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?shopId=${shopId}`);
      setProducts(res.data.data);
    } catch (err) { console.error("Error fetching products:", err); }
  };

  useEffect(() => {
    fetchProducts();
    const handleVisibilityChange = () => { if (document.visibilityState === 'visible') fetchProducts(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [shopId]);

  const handleGenerateReport = async (product) => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/single-product?productId=${product._id}`);
      setReportData({ ...res.data.data, image: product.image });
      setSelectedProduct(product);
    } catch (err) { console.error("Error generating report:", err); } 
    finally { setLoading(false); }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar shopName="Coffee Loot" shopColor="#8B7A2E" />
      <main className="flex-1 ml-56 p-8">
        <header className="mb-8"><h1 className="text-2xl font-bold text-gray-800">Individual Item Sales Report</h1></header>
        {!selectedProduct ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-200/50 p-4 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-800 text-lg w-40">{product.name}</span>
<<<<<<< HEAD
                  <div className="w-24 h-16 bg-white rounded-2xl overflow-hidden"><img src={product.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" /></div>
                  <div className="w-64">
                    <RatingsSummary productId={product._id} />
                  </div>
                </div>
                <button onClick={() => handleGenerateReport(product)} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold">Generate Report</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            <button onClick={() => { setSelectedProduct(null); setReportData(null); }} className="text-primary-600 font-bold text-sm">← Back</button>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] flex items-center gap-8">
                <div className="w-28 h-20 bg-gray-200 rounded-2xl overflow-hidden"><img src={reportData.image} className="w-full h-full object-cover" /></div>
                <div><h4 className="text-gray-900 font-bold text-xl uppercase">Product Selected:</h4><div className="bg-gray-200/60 px-6 py-2 rounded-2xl mt-2 font-bold">{reportData.productName}</div></div>
              </div>
            </div>

            <div className="max-w-md">
              <RatingsSummary productId={selectedProduct?._id} />
            </div>

            {/* Metrics*/}
            <div className="grid grid-cols-2 gap-8">
              <SummaryCard title="Revenue via campaign" value={`$${reportData.revenueBreakdown.campaigns.toLocaleString()}`} />
              <SummaryCard title="Revenue via other sales" value={`$${reportData.revenueBreakdown.other.toLocaleString()}`} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default ReportsPage;
