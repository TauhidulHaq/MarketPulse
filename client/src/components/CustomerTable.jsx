const CustomerTable = ({ customers }) => {
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 'High':
        return 'badge-high';
      case 'Medium':
        return 'badge-medium';
      case 'Low':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const formatFrequency = (lastOrderDate) => {
    if (!lastOrderDate) return 'Never';

    const now = new Date();
    const orderDate = new Date(lastOrderDate);
    const diffMs = now - orderDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} Days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} Week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      if (months === 1) return 'Last Month';
      return `${months} Months ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} Year${years > 1 ? 's' : ''} ago`;
  };

  if (!customers || customers.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-400 font-medium">No customers found</p>
        <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards', opacity: 0 }}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Rank</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Avg. Spend</th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer._id}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-150"
              style={{ animationDelay: `${(index + 3) * 50}ms` }}
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: customer.avatar || '#6B7280' }}
                  >
                    {customer.name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{customer.name}</span>
                </div>
              </td>

              <td className="py-4 px-6">
                <span className={getRankBadgeClass(customer.rank)}>{customer.rank}</span>
              </td>

              <td className="py-4 px-6">
                <span className="text-sm text-gray-700 font-medium">
                  $ {customer.avgSpend?.toFixed(2) || '0.00'}
                </span>
              </td>

              <td className="py-4 px-6">
                <span className="text-sm text-gray-600 font-medium">
                  {formatFrequency(customer.lastOrderDate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
