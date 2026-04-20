import { useEffect, useState } from 'react';
import { getProductReviews } from '../services/api';

const RatingsSummary = ({ productId }) => {
  const [stats, setStats] = useState({ avgRating: 0, count: 0, badge: 'Needs attention' });

  useEffect(() => {
    if (!productId) return;
    getProductReviews(productId).then(res => {
      setStats(res.data.data.stats || {});
    }).catch(console.error);
  }, [productId]);

  return (
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <div className="font-bold">{stats.avgRating || 0}</div>
        <div className="text-gray-500">({stats.count || 0} reviews)</div>
        <div className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{stats.badge}</div>
      </div>
    </div>
  );
};

export default RatingsSummary;
