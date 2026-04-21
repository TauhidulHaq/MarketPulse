import { useEffect, useState } from 'react';
import { getProductReviews } from '../services/api';

const badgeClass = {
  Positive: 'bg-emerald-100 text-emerald-700',
  Mixed: 'bg-amber-100 text-amber-700',
  'Needs attention': 'bg-rose-100 text-rose-700',
};

const RatingsSummary = ({ productId }) => {
  const [stats, setStats] = useState({ avgRating: 0, count: 0, badge: 'Needs attention' });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getProductReviews(productId);
        setStats(res.data.data.stats || { avgRating: 0, count: 0, badge: 'Needs attention' });
      } catch (err) {
        console.error('Failed to fetch product rating stats:', err);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ratings</p>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${badgeClass[stats.badge] || badgeClass['Needs attention']}`}>
          {stats.badge}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-amber-500 text-sm" aria-label="stars">
          {'★'.repeat(Math.round(stats.avgRating || 0))}
          <span className="text-gray-300">{'★'.repeat(5 - Math.round(stats.avgRating || 0))}</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">{Number(stats.avgRating || 0).toFixed(1)}</span>
        <span className="text-xs text-gray-500">({stats.count} reviews)</span>
      </div>
    </div>
  );
};

export default RatingsSummary;
