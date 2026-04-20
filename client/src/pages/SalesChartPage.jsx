import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Bar } from 'react-chartjs-2';

const SalesChartPage = () => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState({ division: '', district: '' });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('/api/sales/divisions').then(res => setDivisions(res.data.data));
  }, []);

  const handleDivChange = (div) => {
    setFilters({ division: div, district: '' });
    axios.get(`/api/sales/divisions/${div}/districts`).then(res => setDistricts(res.data.data));
  };

  const applyFilter = async () => {
    const res = await axios.get(`/api/sales/location-revenue?division=${filters.division}&district=${filters.district}`);
    setChartData({ labels: res.data.data.labels, datasets: [{ label: 'Revenue', data: res.data.data.values, backgroundColor: '#8B7A2E' }] });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar shopName="Coffee Loot" shopColor="#8B7A2E" />
      <main className="flex-1 ml-56 p-8">
        <h1 className="text-2xl font-bold mb-6">Sales Chart</h1>
        <div className="flex gap-4 mb-8">
          <select onChange={(e) => handleDivChange(e.target.value)}><option>Select Division</option>{divisions.map(d => <option key={d} value={d}>{d}</option>)}</select>
          <select onChange={(e) => setFilters({...filters, district: e.target.value})}><option>Select District</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}</select>
          <button onClick={applyFilter} className="bg-primary-600 text-white px-6 py-2 rounded-xl">Apply</button>
        </div>
        {chartData && <Bar data={chartData} />}
      </main>
    </div>
  );
};
export default SalesChartPage;
