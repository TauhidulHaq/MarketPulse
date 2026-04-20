const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', protect, productController.getAllProducts);
router.patch('/:id/price', protect, productController.updatePrice);

module.exports = router;
