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
      { $group: { _id: { $toLower: "$products.saleSource" }, revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } } }
    ]);


    console.log("Database saleSource tags found:", stats);

    const product = await Product.findById(productId);
    

    const campaignsData = stats.find(s => s._id === 'campaign') || { revenue: 0 };
    

    const otherRevenue = stats.filter(s => s._id !== 'campaign').reduce((sum, s) => sum + s.revenue, 0);

    return success(res, {
      productName: product?.name,
      revenueBreakdown: {
        campaigns: parseFloat(campaignsData.revenue.toFixed(2)),
        other: parseFloat(otherRevenue.toFixed(2))
      }
    }, "Report generated.");
  } catch (err) { return error(res, 500, err.message); }
};
