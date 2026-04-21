import { useEffect, useMemo, useState } from 'react';
import { getTopHours } from '../services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const BestHoursHeatmap = ({ shopId }) => {
  const [matrix, setMatrix] = useState(Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0)));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);

        const res = await getTopHours(shopId, {
          start: start.toISOString().slice(0, 10),
          end: end.toISOString().slice(0, 10),
        });

        setMatrix(res.data.data.matrix || matrix);
      } catch (err) {
        console.error('Failed to fetch heatmap:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchHeatmap();
    }
  }, [shopId]);

  const maxValue = useMemo(() => {
    let max = 0;
    matrix.forEach((day) => {
      day.forEach((value) => {
        if (value > max) max = value;
      });
    });
    return max;
  }, [matrix]);

  const colorFor = (value) => {
    if (!value || !maxValue) return 'bg-gray-100';
    const ratio = value / maxValue;
    if (ratio > 0.75) return 'bg-emerald-600';
    if (ratio > 0.5) return 'bg-emerald-500';
    if (ratio > 0.25) return 'bg-emerald-300';
    return 'bg-emerald-200';
  };

  if (loading) {
    return <div className="card p-5 animate-pulse h-64" />;
  }

  return (
    <section className="card p-5">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Best-selling Hours</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[56px_repeat(24,minmax(0,1fr))] gap-1 mb-2">
            <div />
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="text-[10px] text-gray-500 text-center">
                {hour}
              </div>
            ))}
          </div>

          {matrix.map((hours, dayIndex) => (
            <div key={DAYS[dayIndex]} className="grid grid-cols-[56px_repeat(24,minmax(0,1fr))] gap-1 mb-1">
              <div className="text-xs text-gray-600 font-medium flex items-center">{DAYS[dayIndex]}</div>
              {hours.map((value, hour) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className={`h-4 rounded-sm ${colorFor(value)}`}
                  title={`${DAYS[dayIndex]} ${hour}:00 - $${Math.round(value).toLocaleString()}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestHoursHeatmap;
