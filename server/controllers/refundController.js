const Refund = require('../models/Refund');
const { success, error } = require('../views/responseHelper');

const getRefundsOverview = async (req, res) => {
  try {
    const { shopId } = req.params;

    const refunds = await Refund.find({ shop: shopId }).sort({ createdAt: -1 }).populate('customer', 'name email');

    const totalRefunds = refunds.length;
    const totalAmountRefunded = refunds.reduce((sum, r) => sum + r.amount, 0);

    const reasonCounts = refunds.reduce((acc, r) => {
      acc[r.reason] = (acc[r.reason] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(reasonCounts).map(reason => ({
      name: reason,
      value: reasonCounts[reason]
    }));

    return success(res, {
      refunds,
      stats: { totalRefunds, totalAmountRefunded },
      chartData
    }, 'Refunds overview retrieved.');
  } catch (err) {
    console.error(err);
    return error(res, 500, 'Failed to retrieve refunds.');
  }
};

module.exports = {
  getRefundsOverview
};
