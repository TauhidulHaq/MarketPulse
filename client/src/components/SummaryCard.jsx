const SummaryCard = ({ title, value, icon, change, subtitle, delay = 0 }) => {
  const isPositive = change >= 0;

  return (
    <div
      className="card p-5 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <span
            className={`text-sm font-medium flex items-center gap-0.5 pb-1 ${
              isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {isPositive ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 20 L10 8 L14 14 L22 4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 4 L10 16 L14 10 L22 20" />
              )}
            </svg>
            {Math.abs(change)}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
      )}
    </div>
  );
};

export default SummaryCard;
