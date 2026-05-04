import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChartPage = () => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState({ division: '', district: '' });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/sales/divisions')
      .then(res => setDivisions(res.data.data))
      .catch(err => console.error("Error fetching divisions:", err));
  }, []);


  const handleDivChange = (div) => {
    setFilters({ division: div, district: '' });
    setDistricts([]); 
    api.get(`/sales/divisions/${div}/districts`)
      .then(res => setDistricts(res.data.data))
      .catch(err => console.error("Error fetching districts:", err));
  };

  const applyFilter = async () => {
    if (!filters.division || !filters.district) return;
    setLoading(true);
    try {
      const res = await api.get(`/sales/location-revenue?division=${filters.division}&district=${filters.district}`);
      const { labels, values } = res.data.data;
      
      setChartData({
        labels: labels,
        datasets: [{
          label: 'Revenue (BDT)',
          data: values,
          backgroundColor: '#8B7A2E',
          borderRadius: 8,
        }]
      });
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar shopName="Coffee Loot" shopColor="#8B7A2E" />
      <main className="flex-1 ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sales Chart</h1>
        </header>

       
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-8 flex items-end gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600">Division</label>
            <select className="border p-2 rounded-xl" onChange={(e) => handleDivChange(e.target.value)}>
              <option value="">Select Division</option>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600">District</label>
            <select className="border p-2 rounded-xl" value={filters.district} onChange={(e) => setFilters({...filters, district: e.target.value})}>
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button onClick={applyFilter} className="bg-emerald-500 text-white px-8 py-2 rounded-xl font-bold hover:bg-emerald-600 transition">
            Apply Filter
          </button>
        </div>

        
        <div className="bg-white p-8 rounded-3xl shadow-sm min-h-[400px] flex items-center justify-center">
          {loading ? (
            <p className="text-gray-500">Loading chart...</p>
          ) : chartData && chartData.labels.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          ) : (
            <p className="text-gray-500 font-medium">No sales data found for the selected location.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SalesChartPage;
