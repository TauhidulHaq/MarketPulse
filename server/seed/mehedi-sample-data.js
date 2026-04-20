require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Customer = require('../models/Customer');

const run = async () => {
  await connectDB();

  // create a sample shop
  let shop = await Shop.findOne({ name: 'Demo Shop' });
  if (!shop) shop = await Shop.create({ name: 'Demo Shop', owner: new mongoose.Types.ObjectId(), dailyGoal: 5000 });

  // create sample products
  const p1 = await Product.create({ shop: shop._id, name: 'Sample A', category: 'General', price: 20, costPrice: 10, stock: 100 });
  const p2 = await Product.create({ shop: shop._id, name: 'Sample B', category: 'General', price: 50, costPrice: 25, stock: 50 });

  // create a sample customer
  let customer = await Customer.findOne({ shop: shop._id, name: 'Demo Customer' });
  if (!customer) customer = await Customer.create({ shop: shop._id, name: 'Demo Customer', email: 'demo@example.com' });

  // create sample orders spanning different hours & days
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 24) * 3600000);
    await Order.create({ shop: shop._id, customer: customer._id, orderNumber: `SAMPLE-${i+1}`, totalAmount: Math.round(Math.random() * 200)+20, status: 'completed', createdAt: d, products: [{ product: p1._id, quantity: 1, price: p1.price }] });
  }

  // add a few reviews
  await Review.create({ shop: shop._id, product: p1._id, customerName: 'Alice', rating: 5, comment: 'Great!' });
  await Review.create({ shop: shop._id, product: p2._id, customerName: 'Bob', rating: 4, comment: 'Good' });

  console.log('Seed complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
