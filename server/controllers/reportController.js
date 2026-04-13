const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required.",
      });
    }


    const stats = await Order.aggregate([
      {
        $match: {
          "products.product": new mongoose.Types.ObjectId(productId),
          status: "completed" 
        }
      },
      { $unwind: "$products" },
      { $match: { "products.product": new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$products.saleSource",
          revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          // Profit calculation: (Price - Cost) * Quantity
          profit: { $sum: { $multiply: [{ $subtract: ["$products.price", "$products.cost"] }, "$products.quantity"] } }
        }
      }
    ]);

    const productDetails = await Product.findById(productId);

    const totalProfit = stats.reduce((acc, s) => acc + s.profit, 0);
    

    let evaluation = 'Bad';
    if (totalProfit > 8000) {
      evaluation = 'GOOD';
    } else if (totalProfit > 3000) {
      evaluation = 'Moderate';
    }


    const campaignsRevenue = stats.find(s => s._id === 'campaign')?.revenue || 0;
    const otherSalesRevenue = stats.find(s => s._id !== 'campaign')?.revenue || 0;

    res.status(200).json({
      success: true,
      data: {
        productName: productDetails ? productDetails.name : "Unknown",
        evaluation,
        revenueBreakdown: {
          campaigns: campaignsRevenue,
          other: otherSalesRevenue
        }
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
