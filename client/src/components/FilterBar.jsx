const FilterBar = ({ filters, onFilterChange, onApply, onClear }) => {
  const filterOptions = {
    orderFrequency: {
      label: 'Order Frequency',
      options: [
        { value: '', label: 'All' },
        { value: 'frequent', label: 'Frequent (10+)' },
        { value: 'occasional', label: 'Occasional (3-9)' },
        { value: 'rare', label: 'Rare (<3)' },
      ],
    },
    totalSpend: {
      label: 'Total Spend',
      options: [
        { value: '', label: 'All' },
        { value: 'high', label: 'High ($200+)' },
        { value: 'medium', label: 'Medium ($50-199)' },
        { value: 'low', label: 'Low (<$50)' },
      ],
    },
    lastOrderDate: {
      label: 'Last Order Date',
      options: [
        { value: '', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'this_week', label: 'This Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'this_year', label: 'This Year' },
      ],
    },
    memberStatus: {
      label: 'Member Status',
      options: [
        { value: '', label: 'All' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'New', label: 'New' },
      ],
    },
  };

  return (
    <div className="card px-5 py-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter By:
        </div>

        {Object.entries(filterOptions).map(([key, config]) => (
          <select
            key={key}
            id={`filter-${key}`}
            value={filters[key] || ''}
            onChange={(e) => onFilterChange(key, e.target.value)}
            className="bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 
                       focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all duration-200
                       cursor-pointer hover:border-gray-300"
          >
            {config.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        <div className="flex items-center gap-3 ml-auto">
          <button
            id="clear-filters-button"
            onClick={onClear}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            Clear All
          </button>
          <button
            id="apply-filters-button"
            onClick={onApply}
            className="btn-primary text-sm py-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
