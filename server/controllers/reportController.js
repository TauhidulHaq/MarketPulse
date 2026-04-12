const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;
    // Aggregation for profit: (Price - Cost) * Quantity
    const stats = await Order.aggregate([
      { $match: { "products.product": new mongoose.Types.ObjectId(productId), status: "completed" } },
      { $unwind: "$products" },
      { $match: { "products.product": new mongoose.Types.ObjectId(productId) } },
      { $group: {
          _id: "$products.saleSource",
          revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          profit: { $sum: { $multiply: [{ $subtract: ["$products.price", "$products.cost"] }, "$products.quantity"] } }
      }}
    ]);

    const product = await Product.findById(productId);
    const totalProfit = stats.reduce((acc, s) => acc + s.profit, 0);

    res.status(200).json({
      success: true,
      data: {
        productName: product?.name || "Unknown",
        evaluation: totalProfit > 5000 ? 'GOOD' : 'Moderate',
        revenueBreakdown: {
          campaigns: stats.find(s => s._id === 'campaign')?.revenue || 0,
          other: stats.find(s => s._id !== 'campaign')?.revenue || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
