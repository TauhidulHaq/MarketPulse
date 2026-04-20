const Refund = require('../models/Refund');
const { success, error } = require('../views/responseHelper');

const getRefundsOverview = async (req, res) => {
  try {
    const { shopId } = req.params;
    const refunds = await Refund.find({ shop: shopId })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    const totalAmountRefunded = refunds.reduce((sum, r) => sum + r.amount, 0);
    const totalRefunds = refunds.length;

    const reasons = ['Defective', 'Wrong Item', 'Not Satisfied', 'Late Delivery', 'Other'];
    const chartData = reasons.map(name => ({
      name,
      value: refunds.filter(r => r.reason === name).length
    }));

    return success(res, {
      refunds,
      stats: {
        totalRefunds,
        totalAmountRefunded
      },
      chartData
    });
  } catch (err) {
    console.error(err);
    return error(res, 500, 'Failed to fetch refunds overview');
  }
};

module.exports = { getRefundsOverview };
