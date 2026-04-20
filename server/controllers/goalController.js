const Shop = require('../models/Shop');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

const getGoal = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);
    if (!shop) return error(res, 404, 'Shop not found');

    // compute today's revenue
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    const agg = await Order.aggregate([
      { $match: { shop: mongoose.Types.ObjectId(shopId), createdAt: { $gte: start, $lte: end }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const todayRevenue = (agg[0] && agg[0].total) || 0;

    return success(res, { goal: shop.dailyGoal || 0, todayRevenue }, 'Shop goal');
  } catch (err) {
    console.error('Get goal error:', err);
    return error(res, 500, 'Failed to get goal');
  }
};

const setGoal = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { dailyGoal } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return error(res, 404, 'Shop not found');

    shop.dailyGoal = Number(dailyGoal) || 0;
    await shop.save();

    return success(res, { dailyGoal: shop.dailyGoal }, 'Goal updated');
  } catch (err) {
    console.error('Set goal error:', err);
    return error(res, 500, 'Failed to set goal');
  }
};

module.exports = { getGoal, setGoal };
