const Product = require('../models/Product');


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ shop: req.query.shopId });
        res.status(200).json({ success: true, data: products });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updatePrice = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            { price: req.body.newPrice }, 
            { new: true }
        );
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ message: 'Success', product });
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
};


module.exports = {
    getAllProducts,
    updatePrice
};
