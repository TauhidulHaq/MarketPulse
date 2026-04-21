import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import GoalTracker from '../components/GoalTracker';
import BestHoursHeatmap from '../components/BestHoursHeatmap';
import { getShopById, getDashboardOverview } from '../services/api';

const DashboardOverview = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '2026-02-01',
    end: '2026-02-28',
  });

  useEffect(() => {
    fetchData();
  }, [shopId]);

  const fetchData = async () => {
    try {
      const [shopRes, overviewRes] = await Promise.all([
        getShopById(shopId),
        getDashboardOverview(shopId, {
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      ]);
      setShop(shopRes.data.data);
      setOverview(overviewRes.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateRange = () => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const opts = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
  };

  const icons = {
    revenue: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    orders: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    avgOrder: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    retention: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
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
            <div className="grid grid-cols-4 gap-6 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-5">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
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
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              Welcome back, {shop?.name}
            </h1>
            <p className="text-gray-500">Manage your shop profiles and view real-time insights.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDateRange()}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <button
              id="export-report-button"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SummaryCard
            title="TOTAL REVENUE"
            value={formatCurrency(overview?.totalRevenue || 0)}
            icon={icons.revenue}
            change={overview?.changes?.revenue || 12.5}
            subtitle="vs last month"
            delay={0}
          />
          <SummaryCard
            title="ACTIVE ORDERS"
            value={overview?.activeOrders?.toLocaleString() || '0'}
            icon={icons.orders}
            change={overview?.changes?.orders || 2.4}
            subtitle="vs last week"
            delay={100}
          />
          <SummaryCard
            title="AVG ORDER VALUE"
            value={formatCurrency(overview?.avgOrderValue || 0)}
            icon={icons.avgOrder}
            change={overview?.changes?.avgOrder || 5.1}
            subtitle="vs last month"
            delay={200}
          />
          <SummaryCard
            title="CUSTOMER RETENTION"
            value={`${overview?.customerRetention || 0}%`}
            icon={icons.retention}
            change={overview?.changes?.retention || 0.8}
            subtitle="vs last month"
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-1">
            <GoalTracker shopId={shopId} />
          </div>
          <div className="xl:col-span-2">
            <BestHoursHeatmap shopId={shopId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;
