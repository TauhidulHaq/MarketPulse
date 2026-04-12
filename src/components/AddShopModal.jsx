import { useState } from 'react';
import { createShop } from '../services/api';

const AddShopModal = ({ isOpen, onClose, onShopCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8B9A46');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetColors = [
    '#8B9A46', '#6EBF8B', '#8B8FBF', '#8B7A2E',
    '#C53030', '#2B6CB0', '#DD6B20', '#805AD5',
    '#38A169', '#D69E2E', '#319795', '#E53E3E',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createShop({ name, description, color });
      onShopCreated(response.data.data);
      setName('');
      setDescription('');
      setColor('#8B9A46');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Create New Shop</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">Add a new business to your Market Pulse dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Shop Name *</label>
            <input
              id="new-shop-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Coffee Shop"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input
              id="new-shop-description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your business"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all duration-200 ${color === c
                    ? 'ring-2 ring-offset-2 ring-primary-400 scale-110'
                    : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
              style={{ backgroundColor: color }}
            >
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{name || 'Shop Name'}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-emerald-500">Connected</span>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShopModal;
