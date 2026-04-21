import { useEffect, useMemo, useState } from 'react';
import { getDailyGoal, setDailyGoal } from '../services/api';

const GoalTracker = ({ shopId }) => {
  const [goal, setGoal] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [nextGoal, setNextGoal] = useState('0');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchGoal = async () => {
    try {
      const res = await getDailyGoal(shopId);
      const payload = res.data.data || {};
      const currentGoal = payload.goal || 0;
      setGoal(currentGoal);
      setTodayRevenue(payload.todayRevenue || 0);
      setNextGoal(String(currentGoal));
    } catch (err) {
      console.error('Failed to fetch daily goal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchGoal();
    }
  }, [shopId]);

  const progress = useMemo(() => {
    if (!goal) return 0;
    return Math.min(100, Math.round((todayRevenue / goal) * 100));
  }, [goal, todayRevenue]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const amount = Number(nextGoal);
      if (Number.isNaN(amount) || amount < 0) return;
      const res = await setDailyGoal(shopId, amount);
      setGoal(res.data.data.goal || 0);
    } catch (err) {
      console.error('Failed to save goal:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card p-5 animate-pulse h-44" />;
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Daily Sales Goal</h3>
        <span className="text-xs text-gray-500">{progress}% complete</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
        <div className="h-3 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Today: <span className="font-semibold text-gray-900">${Math.round(todayRevenue).toLocaleString()}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-900">${Math.round(goal).toLocaleString()}</span>
      </p>

      <form onSubmit={onSave} className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="1"
          value={nextGoal}
          onChange={(e) => setNextGoal(e.target.value)}
          className="w-36 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Set goal"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Update Goal'}
        </button>
      </form>
    </section>
  );
};

export default GoalTracker;
