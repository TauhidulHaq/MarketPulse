const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const Order = require('../models/Order');
const { success, error } = require('../views/responseHelper');

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const getGoal = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findOne({ _id: shopId, owner: req.user._id }).select('dailyGoal');
    if (!shop) {
      return error(res, 404, 'Shop not found.');
    }

    const { start, end } = getTodayRange();

    const revenueResult = await Order.aggregate([
      {
        $match: {
          shop: new mongoose.Types.ObjectId(shopId),
          createdAt: { $gte: start, $lt: end },
          status: { $in: ['completed', 'delivered'] },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const todayRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return success(
      res,
      { goal: shop.dailyGoal || 0, todayRevenue },
      'Daily goal retrieved successfully.'
    );
  } catch (err) {
    console.error('getGoal error:', err);
    return error(res, 500, 'Failed to retrieve daily goal.');
  }
};

const setGoal = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { goal } = req.body;

    if (goal === undefined || goal === null || Number(goal) < 0) {
      return error(res, 400, 'Goal must be a number greater than or equal to 0.');
    }

    const shop = await Shop.findOneAndUpdate(
      { _id: shopId, owner: req.user._id },
      { dailyGoal: Number(goal) },
      { new: true, runValidators: true }
    ).select('dailyGoal');

    if (!shop) {
      return error(res, 404, 'Shop not found.');
    }

    return success(res, { goal: shop.dailyGoal }, 'Daily goal updated successfully.');
  } catch (err) {
    console.error('setGoal error:', err);
    return error(res, 500, 'Failed to update daily goal.');
  }
};

module.exports = { getGoal, setGoal };
