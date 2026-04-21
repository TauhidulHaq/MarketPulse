const Product = require('../models/Product');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const { success, error } = require('../views/responseHelper');

const classifyBadge = (avgRating) => {
  if (avgRating >= 4.2) return 'Positive';
  if (avgRating >= 3.0) return 'Mixed';
  return 'Needs attention';
};

const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment = '' } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return error(res, 400, 'Rating must be between 1 and 5.');
    }

    const product = await Product.findById(productId).select('shop');
    if (!product) {
      return error(res, 404, 'Product not found.');
    }

    const review = await Review.create({
      shop: product.shop,
      product: productId,
      rating: Number(rating),
      comment,
    });

    return success(res, review, 'Review added successfully.', 201);
  } catch (err) {
    console.error('createReview error:', err);
    return error(res, 500, 'Failed to add review.');
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const statsAgg = await Review.aggregate([
      { $match: { product: productObjectId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
          positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
          mixed: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$rating', 3] }, { $lt: ['$rating', 4] }],
                },
                1,
                0,
              ],
            },
          },
          negative: { $sum: { $cond: [{ $lt: ['$rating', 3] }, 1, 0] } },
        },
      },
    ]);

    const stats = statsAgg[0] || {
      avgRating: 0,
      count: 0,
      positive: 0,
      mixed: 0,
      negative: 0,
    };

    const avgRating = Number((stats.avgRating || 0).toFixed(2));

    return success(
      res,
      {
        stats: {
          avgRating,
          count: stats.count || 0,
          positive: stats.positive || 0,
          mixed: stats.mixed || 0,
          negative: stats.negative || 0,
          badge: classifyBadge(avgRating),
        },
        reviews,
      },
      'Product reviews retrieved successfully.'
    );
  } catch (err) {
    console.error('getProductReviews error:', err);
    return error(res, 500, 'Failed to retrieve product reviews.');
  }
};

module.exports = { createReview, getProductReviews };
