const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createReview, getProductReviews } = require('../controllers/reviewController');

router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', auth, createReview);

module.exports = router;
