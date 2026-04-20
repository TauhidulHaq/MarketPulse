const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/all', auth, productController.getAllProducts);
router.get('/:id', auth, productController.getProductById);
router.get('/', auth, productController.getProducts);
router.patch('/:id/price', auth, productController.updatePrice);

module.exports = router;
