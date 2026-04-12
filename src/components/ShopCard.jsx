const ShopCard = ({ shop, onClick }) => {
  const isConnected = shop.status === 'connected';

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      id={`shop-card-${shop._id}`}
      className="card-hover p-6 flex flex-col items-center text-center group"
      onClick={() => onClick(shop)}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4 
                   shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105"
        style={{ backgroundColor: shop.color || '#8B9A46' }}
      >
        {shop.name.charAt(0)}
      </div>

      <h3 className="font-bold text-gray-800 text-base mb-1">{shop.name}</h3>

      <div className="flex items-center gap-1.5 mb-1">
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'
            }`}
        ></div>
        <span
          className={`text-sm font-medium ${isConnected ? 'text-emerald-500' : 'text-red-500'
            }`}
        >
          {isConnected ? 'Connected' : 'Action Required'}
        </span>
      </div>

      <p className="text-xs text-gray-400">Last synced: {timeSince(shop.lastSynced)}</p>
    </div>
  );
};

export const AddShopCard = ({ onClick }) => {
  return (
    <div
      id="add-new-shop-card"
      className="card-hover p-6 flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-200 hover:border-primary-300"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 
                       group-hover:bg-primary-50 transition-colors duration-300">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="font-bold text-gray-800 text-base mb-1">Add new Shop</h3>
      <p className="text-sm text-gray-400">Expand your Business</p>
    </div>
  );
};

export default ShopCard;
