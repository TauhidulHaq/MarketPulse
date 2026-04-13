import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';

const ReportsPage = () => {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products?shopId=${shopId}`);
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [shopId]);

  const handleGenerateReport = async (product) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/reports/single-product?productId=${product._id}`);
      setReportData(res.data.data);
      setSelectedProduct(product);
    } catch (err) {
      console.error("Error generating report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar*/}
      <Sidebar shopName="Coffee Loot" shopColor="#8B7A2E" />
      
      <main className="flex-1 ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Individual Item Sales Report</h1>
          <p className="text-gray-400 text-sm">Generate an individualized sales report for each item</p>
        </header>

        {!selectedProduct ? (
         
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-200/50 p-4 rounded-3xl flex items-center justify-between border border-transparent hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-800 text-lg w-40">{product.name}</span>
                  <div className="w-24 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[10px] text-gray-300 italic">
                    Product Image
                  </div>
                </div>
                <button 
                  onClick={() => handleGenerateReport(product)}
                  disabled={loading}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Processing...' : 'Generate Report'}
                </button>
              </div>
            ))}
          </div>
        ) : (
        
          <div className="animate-fade-in space-y-8">
            <button 
              onClick={() => { setSelectedProduct(null); setReportData(null); }} 
              className="text-primary-600 font-bold text-sm flex items-center gap-2 hover:underline mb-4"
            >
              ← Back to Selection
            </button>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-8">
                <div className="w-28 h-20 bg-gray-200 rounded-2xl"></div>
                <div>
                  <h4 className="text-gray-900 font-bold text-xl uppercase tracking-tight">Product Selected:</h4>
                  <div className="bg-gray-200/60 px-6 py-2 rounded-2xl mt-2 text-gray-800 font-bold inline-block">
                    {reportData.productName}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900 font-bold text-sm mb-4">Product Performance Evaluation</h4>
                  <div className={`px-10 py-2 rounded-2xl font-bold text-lg inline-block ${
                    reportData.evaluation === 'GOOD' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {reportData.evaluation}
                  </div>
                </div>
                <div className={reportData.evaluation === 'GOOD' ? 'text-emerald-500' : 'text-orange-500'}>
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Metrics*/}
            <div className="grid grid-cols-2 gap-8">
              <SummaryCard 
                title="Revenue via campaign" 
                value={`$${reportData.revenueBreakdown.campaigns.toLocaleString()}`} 
                subtitle={
                  reportData.revenueBreakdown.campaigns >= 2000 
                    ? "The product is performing optimally in campaign sales" 
                    : "The product is performing unsuitably in campaign sales"
                }
                icon={<span className="text-primary-600">💵</span>}
              />

              <SummaryCard 
                title="Revenue via other sales" 
                value={`$${reportData.revenueBreakdown.other.toLocaleString()}`} 
                subtitle={
                  reportData.revenueBreakdown.other >= 2000 
                    ? "The product is performing optimally in other sales" 
                    : "The product is performing unsuitably in other sales"
                }
                icon={<span className="text-primary-600">💵</span>}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
