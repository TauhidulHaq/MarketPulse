const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth'); 


router.get('/all', protect, productController.getAllProducts);
router.get('/:id', protect, productController.getProductById);
router.get('/', protect, productController.getProducts);
router.patch('/:id/price', protect, productController.updatePrice); 

module.exports = router;
