const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Refund = require('../models/Refund');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

const getSimulatorProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const products = await Product.find({ shop: shopId, stock: { $gt: 0 } });
    return success(res, products, 'Products retrieved for simulator.');
  } catch (err) {
    return error(res, 500, 'Failed to fetch simulator products.');
  }
};

const processCheckout = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { customerData, items, promoCode } = req.body;

    if (!items || items.length === 0) {
      return error(res, 400, 'Cart is empty.');
    }

    let campaign = null;
    let discountMultiplier = 1;
    if (promoCode) {
      const Campaign = require('../models/Campaign');
      campaign = await Campaign.findOne({ shop: shopId, code: promoCode.toUpperCase(), isActive: true });
      if (campaign) {
        discountMultiplier = 1 - (campaign.discountPercentage / 100);
      }
    }

    let customer = await Customer.findOne({ email: customerData.email, shop: shopId });
    if (!customer) {
      customer = await Customer.create({
        shop: shopId,
        name: customerData.name || 'Simulated Customer',
        email: customerData.email,
        phone: customerData.phone || '',
        avatar: `hsl(${Math.random() * 360}, 70%, 50%)`,
        memberStatus: 'New',
      });
    } else if (customerData.phone && !customer.phone) {
      customer.phone = customerData.phone;
    }

    const orderProducts = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return error(res, 400, `Product ${product?.name || 'Unknown'} has insufficient stock.`);
      }

      let itemTotal = product.price * item.quantity;
      if (campaign) {
        itemTotal = itemTotal * discountMultiplier;
      }
      totalAmount += itemTotal;

      orderProducts.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        cost: product.costPrice || 0,
        saleSource: campaign ? 'campaign' : 'simulator',
      });

      product.stock -= item.quantity;
      product.unitsSold += item.quantity;
      product.revenue += itemTotal;
      await product.save();
    }

    if (campaign) {
      campaign.usageCount += 1;
      campaign.revenueGenerated += totalAmount;
      await campaign.save();
    }

    const orderCount = await Order.countDocuments();
    const orderNumber = `SIM-${(orderCount + 1000).toString()}`;

    const order = await Order.create({
      shop: shopId,
      customer: customer._id,
      orderNumber,
      customerLocation: customerData.location || { division: 'Unknown', district: 'Unknown' },
      products: orderProducts,
      totalAmount,
      status: 'completed',
    });

    customer.orderCount += 1;
    customer.totalSpend += totalAmount;
    customer.avgSpend = customer.totalSpend / customer.orderCount;
    customer.lastOrderDate = new Date();
    customer.memberStatus = 'Active';

    if (customer.totalSpend > 500) customer.rank = 'High';
    else if (customer.totalSpend > 200) customer.rank = 'Medium';

    await customer.save();

    return success(res, { order, customer }, 'Checkout simulated successfully.');
  } catch (err) {
    console.error('Simulator checkout error:', err);
    return error(res, 500, 'Checkout failed during simulation.');
  }
};

const processRefund = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { orderNumber, reason, notes } = req.body;

    const order = await Order.findOne({ shop: shopId, orderNumber });
    if (!order) {
      return error(res, 404, 'Order not found for refund.');
    }

    if (order.status === 'refunded') {
      return error(res, 400, 'Order is already refunded.');
    }

    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.unitsSold = Math.max(0, product.unitsSold - item.quantity);
        product.revenue = Math.max(0, product.revenue - (item.price * item.quantity));
        await product.save();
      }
    }

    order.status = 'refunded';
    await order.save();

    const refund = await Refund.create({
      shop: shopId,
      order: order._id,
      customer: order.customer,
      amount: order.totalAmount,
      reason: reason || 'Other',
      status: 'approved',
      notes: notes || 'Simulated refund',
    });

    return success(res, { refund }, 'Refund simulated successfully.');
  } catch (err) {
    console.error('Simulator refund error:', err);
    return error(res, 500, 'Refund failed during simulation.');
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const { shopId } = req.params;
    const orders = await Order.find({ shop: shopId }).sort({ createdAt: -1 }).limit(10).populate('customer', 'name email');
    return success(res, orders, 'Recent orders retrieved.');
  } catch (err) {
    return error(res, 500, 'Failed to fetch recent orders.');
  }
};

const trackCartRemoval = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    
    const product = await Product.findById(productId);
    if (product) {
      product.lostSalesQuantity = (product.lostSalesQuantity || 0) + quantity;
      product.lostRevenue = (product.lostRevenue || 0) + (quantity * price);
      await product.save();
    }

    return success(res, null, 'Cart removal tracked.');
  } catch (err) {
    console.error('Track removal error:', err);
    return error(res, 500, 'Failed to track removal.');
  }
};


module.exports = {
  getSimulatorProducts,
  processCheckout,
  processRefund,
  getRecentOrders,
  trackCartRemoval
};
