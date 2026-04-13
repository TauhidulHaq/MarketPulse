const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');


exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "A valid productId is required.",
      });
    }

    
    const productObjectId = new mongoose.Types.ObjectId(productId);

   
    const stats = await Order.aggregate([
      {
        $match: {
          "products.product": productObjectId,
          status: "completed"
        }
      },
      
      { $unwind: "$products" },
      
      {
        $match: {
          "products.product": productObjectId
        }
      },
      // Group by saleSource 
      {
        $group: {
          _id: "$products.saleSource",
          revenue: { 
            $sum: { $multiply: ["$products.price", "$products.quantity"] } 
          },
          // Profit = (Price - Cost) * Quantity
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
    if (totalProfit > 5000) {
      evaluation = 'GOOD';
    } else if (totalProfit > 2000) {
      evaluation = 'Moderate';
    }

    
    const campaignsData = stats.find(s => s._id === 'campaign') || { revenue: 0, profit: 0 };
    const otherSalesData = stats.find(s => s._id !== 'campaign') || { revenue: 0, profit: 0 };

    res.status(200).json({
      success: true,
      data: {
        productName: productDetails ? productDetails.name : "Unknown Product",
        evaluation,
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        revenueBreakdown: {
          campaigns: parseFloat(campaignsData.revenue.toFixed(2)),
          other: parseFloat(otherSalesData.revenue.toFixed(2))
        }
      },
    });

  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during report generation: " + error.message,
    });
  }
};
