const Order = require('../models/Order');
const { success, error } = require('../views/responseHelper');

const ALLOWED_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

const getOrders = async (req, res) => {
  try {
    const { shopId, status } = req.query;

    if (!shopId) {
      return error(res, 400, 'shopId query parameter is required.');
    }

    const query = { shop: shopId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return success(res, orders, 'Orders retrieved successfully.');
  } catch (err) {
    console.error('getOrders error:', err);
    return error(res, 500, 'Failed to retrieve orders.');
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return error(res, 400, 'Invalid status. Use pending, processing, shipped, or delivered.');
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return error(res, 404, 'Order not found.');
    }

    return success(res, order, 'Order status updated successfully.');
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return error(res, 500, 'Failed to update order status.');
  }
};

module.exports = { getOrders, updateOrderStatus };
