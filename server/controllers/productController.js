const Product = require('../models/Product');

// Functions defined directly
const getAllProducts = async (req, res) => {
    try {
        const { shopId } = req.query;
        const products = await Product.find({ shop: shopId });
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
        const query = search ? { shop: shopId, name: { $regex: search, $options: 'i' } } : { shop: shopId };
        const products = await Product.find(query).sort({ name: 1 });
        res.status(200).json(products);
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
};

const updatePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPrice } = req.body;
        const product = await Product.findByIdAndUpdate(id, { price: newPrice }, { new: true });
        if (!product) return res.status(404).json({ error: 'Not found' });
        res.status(200).json({ message: 'Success', product });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
};


module.exports = {
    getAllProducts,
    getProductById,
    getProducts,
    updatePrice
};
