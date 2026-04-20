const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, productController.getProducts);

router.patch('/:id/price', protect, productController.updatePrice);

module.exports = router;
