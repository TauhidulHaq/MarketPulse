const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;
    const pId = new mongoose.Types.ObjectId(productId);

    
    const stats = await Order.aggregate([
      { $match: { "products.product": pId, status: "completed" } },
      { $unwind: "$products" },
      { $match: { "products.product": pId } },
      { $group: { _id: "$products.saleSource", revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } } }
    ]);

    const product = await Product.findById(productId);
    const camp = stats.find(s => s._id === 'campaign')?.revenue || 0;
    const other = stats.find(s => s._id !== 'campaign')?.revenue || 0;

    return success(res, {
      productName: product?.name,
      revenueBreakdown: {
        campaigns: parseFloat(camp.toFixed(2)),
        other: parseFloat(other.toFixed(2))
      }
    }, "Report generated.");
  } catch (err) { return error(res, 500, err.message); }
};
