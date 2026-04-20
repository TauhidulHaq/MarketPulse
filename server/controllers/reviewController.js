const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../views/responseHelper');

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, customerName } = req.body;
    const product = await Product.findById(productId);
    if (!product) return error(res, 404, 'Product not found');
    const review = await Review.create({
      shop: product.shop,
      product: product._id,
      customerName: customerName || 'Anonymous',
      rating,
      comment,
    });
    return success(res, review, 'Review added');
  } catch (err) {
    console.error('Add review error:', err);
    return error(res, 500, 'Failed to add review');
  }
};

const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(100);
    const stats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const agg = stats[0] || { avgRating: 0, count: 0 };
    const avg = Math.round((agg.avgRating || 0) * 10) / 10;
    let badge = 'Needs attention';
    if (avg >= 4.2) badge = 'Positive';
    else if (avg >= 3.0) badge = 'Mixed';
    return success(res, { reviews, stats: { avgRating: avg, count: agg.count, badge } }, 'Reviews');
  } catch (err) {
    console.error('List reviews error:', err);
    return error(res, 500, 'Failed to list reviews');
  }
};

module.exports = { addReview, listReviews };
const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../views/responseHelper');

async function addReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment, customerName } = req.body;
    const product = await Product.findById(productId);
    if (!product) return error(res, 404, 'Product not found');
    const review = await Review.create({ shop: product.shop, product: product._id, customerName: customerName || 'Anonymous', rating, comment });
    return success(res, review, 'Review added');
  } catch (err) {
    console.error('Add review error:', err);
    return error(res, 500, 'Failed to add review');
  }
}

async function listReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(100);
    const stats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const agg = stats[0] || { avgRating: 0, count: 0 };
    const avg = Math.round((agg.avgRating || 0) * 10) / 10;
    let badge = 'Needs attention';
    if (avg >= 4.2) badge = 'Positive';
    else if (avg >= 3.0) badge = 'Mixed';
    return success(res, { reviews, stats: { avgRating: avg, count: agg.count, badge } }, 'Reviews');
  } catch (err) {
    console.error('List reviews error:', err);
    return error(res, 500, 'Failed to list reviews');
  }
}

module.exports = { addReview, listReviews };
const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../views/responseHelper');

async function addReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment, customerName } = req.body;
    const product = await Product.findById(productId);
    if (!product) return error(res, 404, 'Product not found');
    const review = await Review.create({ shop: product.shop, product: product._id, customerName: customerName || 'Anonymous', rating, comment });
    return success(res, review, 'Review added');
  } catch (err) { console.error(err); return error(res, 500, 'Failed to add review'); }
}

async function listReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(100);
    const stats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const agg = stats[0] || { avgRating: 0, count: 0 };
    const avg = Math.round((agg.avgRating || 0) * 10) / 10;
    let badge = 'Needs attention'; if (avg >= 4.2) badge = 'Positive'; else if (avg >= 3.0) badge = 'Mixed';
    return success(res, { reviews, stats: { avgRating: avg, count: agg.count, badge } }, 'Reviews');
  } catch (err) { console.error(err); return error(res, 500, 'Failed to list reviews'); }
}

module.exports = { addReview, listReviews };
const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../views/responseHelper');

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, customerName } = req.body;
    const product = await Product.findById(productId);
    if (!product) return error(res, 404, 'Product not found');
    const review = await Review.create({
      shop: product.shop,
      product: product._id,
      customerName: customerName || 'Anonymous',
      rating,
      comment,
    });
    return success(res, review, 'Review added');
  } catch (err) {
    console.error('Add review error:', err);
    return error(res, 500, 'Failed to add review');
  }
};

const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(100);
    const stats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const agg = stats[0] || { avgRating: 0, count: 0 };
    const avg = Math.round((agg.avgRating || 0) * 10) / 10;
    let badge = 'Needs attention';
    if (avg >= 4.2) badge = 'Positive';
    else if (avg >= 3.0) badge = 'Mixed';
    return success(res, { reviews, stats: { avgRating: avg, count: agg.count, badge } }, 'Reviews');
  } catch (err) {
    console.error('List reviews error:', err);
    return error(res, 500, 'Failed to list reviews');
  }
};

module.exports = { addReview, listReviews };
const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../views/responseHelper');

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, customerName } = req.body;

    const product = await Product.findById(productId);
    if (!product) return error(res, 404, 'Product not found');

    const review = await Review.create({
      shop: product.shop,
      product: product._id,
      customerName: customerName || 'Anonymous',
      rating,
      comment,
    });

    return success(res, review, 'Review added');
  } catch (err) {
    console.error('Add review error:', err);
    return error(res, 500, 'Failed to add review');
  }
};

const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(100);

    // aggregation stats
    const stats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    const agg = stats[0] || { avgRating: 0, count: 0 };
    const avg = Math.round((agg.avgRating || 0) * 10) / 10;
    let badge = 'Needs attention';
    if (avg >= 4.2) badge = 'Positive';
    else if (avg >= 3.0) badge = 'Mixed';

    return success(res, { reviews, stats: { avgRating: avg, count: agg.count, badge } }, 'Reviews');
  } catch (err) {
    console.error('List reviews error:', err);
    return error(res, 500, 'Failed to list reviews');
  }
};

module.exports = { addReview, listReviews };
const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../views/responseHelper');

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, customerName } = req.body;

    const product = await Product.findById(productId);
    if (!product) return error(res, 404, 'Product not found');

    const review = await Review.create({
      shop: product.shop,
      product: product._id,
      customerName: customerName || 'Anonymous',
      rating,
      comment,
    });

    return success(res, review, 'Review added');
  } catch (err) {
    console.error('Add review error:', err);
    return error(res, 500, 'Failed to add review');
  }
};

const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(100);

    // aggregation stats
    const stats = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    const agg = stats[0] || { avgRating: 0, count: 0 };
    const avg = Math.round((agg.avgRating || 0) * 10) / 10;
    let badge = 'Needs attention';
    if (avg >= 4.2) badge = 'Positive';
    else if (avg >= 3.0) badge = 'Mixed';

    return success(res, { reviews, stats: { avgRating: avg, count: agg.count, badge } }, 'Reviews');
  } catch (err) {
    console.error('List reviews error:', err);
    return error(res, 500, 'Failed to list reviews');
  }
};

module.exports = { addReview, listReviews };
