const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const { shopId, revenueFilter, stockFilter, performanceFilter } = req.query;
    if (!shopId) return res.status(400).json({ success: false, message: "shopId is required" });
    
    let query = { shop: shopId };
    if (stockFilter === 'low') query.stock = { $lte: 10 };
    else if (stockFilter === 'moderate') query.stock = { $gt: 10, $lte: 50 };
    else if (stockFilter === 'high') query.stock = { $gt: 50 };
    
    let productsQuery = Product.find(query);
    let sortOption = {};
    if (revenueFilter === 'highest') sortOption.revenue = -1;
    if (revenueFilter === 'lowest') sortOption.revenue = 1;
    if (performanceFilter === 'highest') sortOption.performance = -1;
    if (performanceFilter === 'lowest') sortOption.performance = 1;
    if (Object.keys(sortOption).length > 0) productsQuery = productsQuery.sort(sortOption);
    
    const products = await productsQuery;
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getProducts = async (req, res) => {
  try {
    const { search, shopId } = req.query;
    const query = search ? { shop: shopId, name: { $regex: `^${search}`, $options: 'i' } } : { shop: shopId };
    const products = await Product.find(query).sort({ name: 1 });
    res.status(200).json(products);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch products' }); }
};

const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    product.price = newPrice;
    await product.save();

    res.status(200).json({ message: 'Price updated successfully', product });
  } catch (err) { res.status(500).json({ error: 'Failed to update price' }); }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProducts,
  updatePrice
};
