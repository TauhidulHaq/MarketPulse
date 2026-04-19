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
         
          revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          profit: { 
            $sum: { 
              $multiply: [
                { $subtract: ["$products.price", "$products.cost"] }, 
                "$products.quantity" 
              ] 
            } 
          }
        }
      }
    ]);

    const productDetails = await Product.findById(productId);
    const totalProfit = stats.reduce((acc, s) => acc + s.profit, 0);

    let evaluation = 'Bad';
    if (totalProfit > 5000) evaluation = 'GOOD';
    else if (totalProfit > 2000) evaluation = 'Moderate';

    const campaignsData = stats.find(s => s._id === 'campaign') || { revenue: 0 };
    const otherSalesData = stats
      .filter(s => s._id !== 'campaign')
      .reduce((acc, curr) => ({ revenue: acc.revenue + curr.revenue }), { revenue: 0 });

    return success(res, {
      productName: productDetails?.name || "Unknown Product",
      evaluation,
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      revenueBreakdown: {
        campaigns: parseFloat(campaignsData.revenue.toFixed(2)),
        other: parseFloat(otherSalesData.revenue.toFixed(2))
      }
    }, "Report generated successfully.");

  } catch (err) {
    return error(res, 500, err.message);
  }
};
