const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');


exports.getProducts = async (req, res) => {
  try {
    const { search, shopId } = req.query;
    

    if (!shopId) return res.status(400).json({ error: 'shopId is required' });


    const query = search 
      ? { shop: shopId, name: { $regex: `^${search}`, $options: 'i' } } 
      : { shop: shopId };
    
    
    const products = await Product.find(query).sort({ name: 1 });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;
    
    if (newPrice === undefined || newPrice < 0) {
      return res.status(400).json({ error: 'Valid new price is required' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const previousPrice = product.price;

    
    product.price = newPrice;
    await product.save();


    await AuditLog.create({
      shop: product.shop,
      product: id,
      previousPrice,
      newPrice,
      userId: req.user._id 
    });

    res.status(200).json({ message: 'Price updated successfully', product });
  } catch (err) {
    console.error('Error updating price:', err);
    res.status(500).json({ error: 'Failed to update price' });
  }
};
