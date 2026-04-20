const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Shop = require('../models/Shop'); 


exports.getAlertsOverview = async (req, res) => {
  try {
    const { shopId } = req.params;

  
    const shop = await Shop.findById(shopId).lean();

  
    const criticalStockItems = await Product.find({ shop: shopId, stock: { $lte: 10 } }).lean();
    const expiringItems = await Product.find({ shop: shopId, status: 'expiring' }).lean();

  //update
  
    const liveSales = await Order.find({ shop: shopId, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    //Calc
    const lostSalesItems = await Product.find({ 
      shop: shopId, 
      lostRevenue: { $gt: 0 } 
    }).sort({ lostRevenue: -1 }).lean();

    //Calc
    const totalLostRevenue = lostSalesItems.reduce((sum, item) => sum + item.lostRevenue, 0);

    const itemsRequiringAction = [
      ...criticalStockItems.map(item => ({ type: 'CRITICAL_STOCK', data: item })),
      ...expiringItems.map(item => ({ type: 'EXPIRY_NOTICE', data: item }))
    ];
//update
    res.status(200).json({
      shop, 
      metrics: {
        criticalStockCount: criticalStockItems.length,
        expiringSoonCount: expiringItems.length,
        notificationsSent: 40,
        totalLostRevenue 
      },
      itemsRequiringAction,
      liveSales,
      lostSalesBreakdown: lostSalesItems 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts data', error: error.message });
  }
};


exports.getCustomersToNotify = async (req, res) => {
  try {
    const { shopId } = req.params;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    
    const customers = await Customer.find({ shop: shopId }).lean();
    const orders = await Order.find({ shop: shopId }).lean();
    const allProducts = await Product.find({ shop: shopId }).lean();
    
    const restockedProducts = allProducts.filter(p => p.stock > 0 && p.lastRestocked);
    const customersToNotify = [];

   
    for (const customer of customers) {
      const lastOrder = new Date(customer.lastOrderDate);
      const needsTimeBasedNudge = lastOrder < thirtyDaysAgo;
      const restockedItemNames = [];

    
      const customerOrders = orders.filter(o => o.customer.toString() === customer._id.toString());

     
      for (const order of customerOrders) {
        for (const item of order.products) {
          const productDetails = restockedProducts.find(p => p._id.toString() === item.product.toString());
          if (productDetails && new Date(productDetails.lastRestocked) > lastOrder) {
            if (!restockedItemNames.includes(productDetails.name)) {
              restockedItemNames.push(productDetails.name);
            }
          }
        }
      }

      if (needsTimeBasedNudge || restockedItemNames.length > 0) {
        customersToNotify.push({
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          avatar: customer.avatar,
          orderCount: customer.orderCount,
          lastOrderDate: customer.lastOrderDate,
          needsTimeBasedNudge,
          restockedItemNames
        });
      }
    }

    res.status(200).json(customersToNotify);
  } catch (error) {
    console.error("Data Fetch Error:", error);
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};
