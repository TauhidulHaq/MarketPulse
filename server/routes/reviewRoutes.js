const express = require('express');
const router = express.Router();
const { addReview, listReviews } = require('../controllers/reviewControllerClean');
const auth = require('../middleware/auth');

router.post('/products/:productId/reviews', auth, addReview);
router.get('/products/:productId/reviews', listReviews);

module.exports = router;
