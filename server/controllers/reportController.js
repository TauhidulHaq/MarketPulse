const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return error(res, 400, "A valid productId is required.");
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const stats = await Order.aggregate([
      { $match: { "products.product": productObjectId, status: "completed" } },
      { $unwind: "$products" },
      { $match: { "products.product": productObjectId } },
      {
        $group: {
          _id: "$products.saleSource",
          revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
        }
      }
    ]);

    const productDetails = await Product.findById(productId);
    const campaignsData = stats.find(s => s._id === 'campaign') || { revenue: 0 };
    const otherSalesData = stats.find(s => s._id === 'simulator') || { revenue: 0 };

    return success(res, {
      productName: productDetails?.name || "Unknown Product",
      evaluation: productDetails.revenue > 2000 ? 'GOOD' : 'Moderate',
      revenueBreakdown: {
        campaigns: parseFloat(campaignsData.revenue.toFixed(2)),
        other: parseFloat(otherSalesData.revenue.toFixed(2))
      }
    }, "Report generated successfully.");

  } catch (err) {
    return error(res, 500, err.message);
  }
};
