import { useEffect, useState } from 'react';
import { getShopGoal, setShopGoal } from '../services/api';
import { useParams } from 'react-router-dom';

const GoalTracker = () => {
  const { shopId } = useParams();
  const [goal, setGoal] = useState(0);
  const [today, setToday] = useState(0);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(0);

  const fetch = async () => {
    try {
      const res = await getShopGoal(shopId);
      setGoal(res.data.data.goal || 0);
      setToday(res.data.data.todayRevenue || 0);
      setValue(res.data.data.goal || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetch(); }, [shopId]);

  const save = async () => {
    try {
      await setShopGoal(shopId, { dailyGoal: Number(value) });
      setEditing(false);
      fetch();
    } catch (err) { console.error(err); }
  };

  const percent = goal > 0 ? Math.min(100, Math.round((today / goal) * 100)) : 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold">Today's Goal</h4>
        <div className="text-xs text-gray-500">{percent}%</div>
      </div>

      <div className="mb-3">
        <div className="w-full bg-gray-100 rounded-full h-4">
          <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <div className="text-xs text-gray-500">Goal</div>
          <div className="font-bold">${goal.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Today</div>
          <div className="font-bold">${today.toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-4">
        {editing ? (
          <div className="flex gap-2">
            <input type="number" value={value} onChange={(e)=>setValue(e.target.value)} className="input" />
            <button onClick={save} className="btn-primary px-3">Save</button>
            <button onClick={()=>setEditing(false)} className="text-sm text-gray-500">Cancel</button>
          </div>
        ) : (
          <button onClick={()=>setEditing(true)} className="text-sm text-primary-600 font-bold mt-2">Edit Goal</button>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
