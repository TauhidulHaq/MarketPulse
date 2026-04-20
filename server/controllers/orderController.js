const Order = require('../models/Order');
const { success, error } = require('../views/responseHelper');

const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!['pending','processing','shipped','delivered','completed','refunded','cancelled'].includes(status)) {
      return error(res, 400, 'Invalid status');
    }

    const order = await Order.findById(orderId);
    if (!order) return error(res, 404, 'Order not found');

    order.status = status;
    await order.save();

    return success(res, order, 'Order status updated');
  } catch (err) {
    console.error('Update order status error:', err);
    return error(res, 500, 'Failed to update order status');
  }
};

const listOrders = async (req, res) => {
  try {
    const { shopId, status } = req.query;
    const filter = {};
    if (shopId) filter.shop = shopId;
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).populate('customer', 'name email');
    return success(res, orders, 'Orders');
  } catch (err) {
    console.error('List orders error:', err);
    return error(res, 500, 'Failed to list orders');
  }
};

module.exports = { updateStatus, listOrders };
