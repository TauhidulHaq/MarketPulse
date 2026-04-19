import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getRefundsOverview } from '../services/api';

const RefundsPage = () => {
  const { shopId } = useParams();
  const [refunds, setRefunds] = useState([]);
  const [stats, setStats] = useState({ totalRefunds: 0, totalAmountRefunded: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefunds();
  }, [shopId]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await getRefundsOverview(shopId);
      setRefunds(res.data.data.refunds);
      setStats(res.data.data.stats);
      setChartData(res.data.data.chartData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value) => {
    if (stats.totalRefunds === 0) return 0;
    return Math.round((value / stats.totalRefunds) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Refunds Management</h1>
          <p className="text-gray-500">Track return reasons to prevent future loss of sales.</p>
        </header>

        {loading ? (
          <p className="text-gray-500">Loading refunds data...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Returned</span>
                <span className="text-4xl font-black text-red-500 mb-1">-${stats.totalAmountRefunded.toFixed(2)}</span>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{stats.totalRefunds} orders</span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Loss Prevention Matrix</h3>
                <div className="space-y-4">
                  {chartData.length === 0 ? (
                    <p className="text-xs text-gray-400">No return data available yet.</p>
                  ) : chartData.map((data, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-700">{data.name}</span>
                        <span className="text-gray-500">{calculatePercentage(data.value)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${calculatePercentage(data.value)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Returned Orders Ledger</h2>
                </div>

                {refunds.length === 0 ? (
                  <div className="p-16 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex justify-center items-center mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 font-bold mb-1">No Refunds Yet!</h3>
                    <p className="text-sm text-gray-500">Your products are keeping customers satisfied.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white">
                          <th className="px-6 py-4 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                          <th className="px-6 py-4 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                          <th className="px-6 py-4 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">Reason</th>
                          <th className="px-6 py-4 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Refunded</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {refunds.map((r) => (
                          <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-indigo-600 tracking-wider">
                              SIM-REFUND-{r._id.toString().substring(18, 24).toUpperCase()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-gray-900 block text-sm">{r.customer?.name}</span>
                              <span className="text-xs text-gray-500">{r.customer?.email}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">{r.reason}</span>
                              {r.notes && <p className="text-[10px] text-gray-400 mt-1 italic w-40 truncate">{r.notes}</p>}
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-red-500">
                              -${r.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RefundsPage;
