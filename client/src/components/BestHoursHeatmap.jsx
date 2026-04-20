import { useEffect, useState } from 'react';
import { getTopHours } from '../services/api';

const cellColor = (value, max) => {
  if (!max) return 'bg-gray-100';
  const p = value / max;
  if (p > 0.75) return 'bg-emerald-600';
  if (p > 0.5) return 'bg-emerald-400';
  if (p > 0.25) return 'bg-emerald-200';
  return 'bg-gray-100';
};

const BestHoursHeatmap = ({ shopId, start, end }) => {
  const [matrix, setMatrix] = useState([]);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (!shopId) return;
    getTopHours(shopId, { start, end }).then(res => {
      const rows = Array.from({ length: 7 }, () => Array(24).fill(0));
      (res.data.data || []).forEach(({ day, hour, revenue }) => {
        if (day >=0 && day < 7 && hour >=0 && hour < 24) rows[day][hour] = revenue;
      });
      const m = Math.max(...rows.flat());
      setMax(m);
      setMatrix(rows);
    }).catch(console.error);
  }, [shopId, start, end]);

  return (
    <div className="card p-4">
      <div className="text-sm font-bold mb-2">Best-selling Hours</div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-25 gap-1">
          <div className="col-span-1" />
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="text-xs text-center">{h}</div>
          ))}
        </div>
        {matrix.map((row, d) => (
          <div key={d} className="flex items-center gap-1 mt-1">
            <div className="w-12 text-xs">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]}</div>
            <div className="flex gap-1 overflow-x-auto">
              {row.map((val, h) => (
                <div key={h} className={`w-6 h-6 ${cellColor(val, max)} rounded-sm`} title={`${val}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestHoursHeatmap;
