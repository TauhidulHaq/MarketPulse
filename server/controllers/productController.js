const Product = require('../models/Product');


exports.getAllProducts = async (req, res) => {
  try {
    const { shopId, revenueFilter, stockFilter, performanceFilter } = req.query;

    if (!shopId) {
      return res.status(400).json({ success: false, message: "shopId is required" });
    }

    
    let query = { shop: shopId };

    
    if (stockFilter === 'low') {
      query.stock = { $lte: 10 };
    } else if (stockFilter === 'moderate') {
      query.stock = { $gt: 10, $lte: 50 };
    } else if (stockFilter === 'high') {
      query.stock = { $gt: 50 };
    }

    
    let productsQuery = Product.find(query);


    if (revenueFilter === 'highest') {
      productsQuery = productsQuery.sort({ revenue: -1 });
    } else if (revenueFilter === 'lowest') {
      productsQuery = productsQuery.sort({ revenue: 1 });
    }

  
    if (performanceFilter === 'highest') {
      productsQuery = productsQuery.sort({ performance: -1 });
    } else if (performanceFilter === 'lowest') {
      productsQuery = productsQuery.sort({ performance: 1 });
    }

    const products = await productsQuery;

  
    res.status(200).json({
      success: true,
      count: products.length,
      data: products 
    });

  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
