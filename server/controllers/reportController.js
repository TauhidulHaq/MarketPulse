const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) return error(res, 400, "Valid ID required.");


    const product = await Product.findById(productId);
    
   
    const stats = await Order.aggregate([
      { $match: { "products.product": new mongoose.Types.ObjectId(productId), status: "completed" } },
      { $unwind: "$products" },
      { $match: { "products.product": new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$products.saleSource", revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } } }
    ]);

    const campaignsData = stats.find(s => s._id === 'campaign') || { revenue: 0 };
    const otherSalesData = stats.find(s => s._id === 'simulator') || { revenue: 0 };

    const finalCampaign = (product.campaignRevenue || 0) + campaignsData.revenue;
    const finalOther = (product.otherRevenue || 0) + otherSalesData.revenue;

    return success(res, {
      productName: product.name,
      revenueBreakdown: {
        campaigns: parseFloat(finalCampaign.toFixed(2)),
        other: parseFloat(finalOther.toFixed(2))
      }
    }, "Report generated successfully.");
  } catch (err) { return error(res, 500, err.message); }
};
