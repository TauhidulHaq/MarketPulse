const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { shopId, revenueFilter, stockFilter, performanceFilter } = req.query;
    if (!shopId) return res.status(400).json({ success: false, message: "shopId is required" });

    const filter = { shop: shopId };

    // Match teammate's "stock" field
    if (stockFilter === 'low') filter.stock = { $lte: 10 };
    else if (stockFilter === 'moderate') filter.stock = { $gt: 10, $lte: 50 };
    else if (stockFilter === 'high') filter.stock = { $gt: 50 };

    let sort = {};
    if (revenueFilter) sort.revenue = revenueFilter === 'highest' ? -1 : 1;
    if (performanceFilter) sort.unitsSold = performanceFilter === 'highest' ? -1 : 1;

    const products = await Product.find(filter).sort(sort || { createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
