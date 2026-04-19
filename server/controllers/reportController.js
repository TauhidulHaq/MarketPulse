const Product = require('../models/Product');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

exports.generateSingleProductReport = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return error(res, 400, "A valid productId is required.");
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return error(res, 404, "Product not found.");
    }


    return success(res, {
      productName: product.name,
      evaluation: product.revenue > 2000 ? 'GOOD' : 'Moderate',
      revenueBreakdown: {
        campaigns: parseFloat((product.campaignRevenue || 0).toFixed(2)),
        other: parseFloat((product.otherRevenue || 0).toFixed(2))
      }
    }, "Report generated successfully.");

  } catch (err) {
    return error(res, 500, err.message);
  }
};
