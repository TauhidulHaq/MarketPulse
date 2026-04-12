const Customer = require('../models/Customer');
const { success, error } = require('../views/responseHelper');

const getCustomers = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { orderFrequency, totalSpend, lastOrderDate, memberStatus, sortBy, order } = req.query;

    const query = { shop: shopId };

    if (orderFrequency) {
      switch (orderFrequency) {
        case 'frequent':
          query.orderCount = { $gte: 10 };
          break;
        case 'occasional':
          query.orderCount = { $gte: 3, $lt: 10 };
          break;
        case 'rare':
          query.orderCount = { $lt: 3 };
          break;
      }
    }

    if (totalSpend) {
      switch (totalSpend) {
        case 'high':
          query.avgSpend = { $gte: 200 };
          break;
        case 'medium':
          query.avgSpend = { $gte: 50, $lt: 200 };
          break;
        case 'low':
          query.avgSpend = { $lt: 50 };
          break;
      }
    }

    if (lastOrderDate) {
      const now = new Date();
      switch (lastOrderDate) {
        case 'today':
          query.lastOrderDate = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
          break;
        case 'this_week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          query.lastOrderDate = { $gte: weekAgo };
          break;
        case 'this_month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          query.lastOrderDate = { $gte: monthAgo };
          break;
        case 'this_year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          query.lastOrderDate = { $gte: yearAgo };
          break;
      }
    }

    if (memberStatus) {
      query.memberStatus = memberStatus;
    }
    let sortOption = { totalSpend: -1 };
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sortOption = { [sortBy]: sortOrder };
    }

    const customers = await Customer.find(query).sort(sortOption);

    return success(res, customers, 'Customers retrieved successfully.');
  } catch (err) {
    console.error('getCustomers error:', err);
    return error(res, 500, 'Failed to retrieve customers.');
  }
};

const getCustomerStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    const totalCustomers = await Customer.countDocuments({ shop: shopId });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const activeToday = await Customer.countDocuments({
      shop: shopId,
      lastOrderDate: { $gte: todayStart },
    });

    const highRankCount = await Customer.countDocuments({ shop: shopId, rank: 'High' });
    const topTierPercentage = totalCustomers > 0 ? ((highRankCount / totalCustomers) * 100).toFixed(1) : 0;

    const data = {
      totalCustomers,
      activeToday,
      topTierGrowth: parseFloat(topTierPercentage),
      changes: {
        totalCustomers: 4.2,
        activeToday: 15.0,
        topTierGrowth: 2.1,
      },
    };

    return success(res, data, 'Customer stats retrieved.');
  } catch (err) {
    console.error('getCustomerStats error:', err);
    return error(res, 500, 'Failed to retrieve customer stats.');
  }
};

module.exports = { getCustomers, getCustomerStats };
