import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import FilterBar from '../components/FilterBar';
import CustomerTable from '../components/CustomerTable';
import { getShopById, getCustomers, getCustomerStats } from '../services/api';

const CustomerPage = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    orderFrequency: '',
    totalSpend: '',
    lastOrderDate: '',
    memberStatus: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, [shopId]);

  const fetchInitialData = async () => {
    try {
      const [shopRes, customersRes, statsRes] = await Promise.all([
        getShopById(shopId),
        getCustomers(shopId),
        getCustomerStats(shopId),
      ]);
      setShop(shopRes.data.data);
      setCustomers(customersRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const response = await getCustomers(shopId, params);
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Failed to filter customers:', err);
    }
  };

  const handleClearFilters = async () => {
    setFilters({
      orderFrequency: '',
      totalSpend: '',
      lastOrderDate: '',
      memberStatus: '',
    });
    try {
      const response = await getCustomers(shopId);
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Failed to clear filters:', err);
    }
  };

  const icons = {
    totalCustomers: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    activeToday: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    topTier: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar shopName="Loading..." shopColor="#94a3b8" />
        <main className="flex-1 ml-56 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-5">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar shopName={shop?.name} shopColor={shop?.color} />

      <main className="flex-1 ml-56 p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Customer Segmentation</h1>
          <p className="text-gray-500">
            Analyze and rank your cafe's customer base based on purchasing behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="TOTAL CUSTOMERS"
            value={stats?.totalCustomers?.toLocaleString() || '0'}
            icon={icons.totalCustomers}
            change={stats?.changes?.totalCustomers || 4.2}
            subtitle="Total unique visitors this year"
            delay={0}
          />
          <SummaryCard
            title="ACTIVE TODAY"
            value={stats?.activeToday?.toString() || '0'}
            icon={icons.activeToday}
            change={stats?.changes?.activeToday || 15.0}
            subtitle="Orders processed in the last 24h"
            delay={100}
          />
          <SummaryCard
            title="TOP TIER GROWTH"
            value={`+${stats?.topTierGrowth || 0}%`}
            icon={icons.topTier}
            change={stats?.changes?.topTierGrowth || 2.1}
            subtitle="Conversion to High-Value segment"
            delay={200}
          />
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <CustomerTable customers={customers} />
      </main>
    </div>
  );
};

export default CustomerPage;
