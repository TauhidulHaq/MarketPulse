const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/', productController.getAllProducts);
router.patch('/:id/price', productController.updatePrice);

module.exports = router;
