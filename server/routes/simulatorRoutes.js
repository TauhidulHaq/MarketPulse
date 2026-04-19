const express = require('express');
const router = express.Router();
const { getSimulatorProducts, processCheckout, processRefund, getRecentOrders } = require('../controllers/simulatorController');
const auth = require('../middleware/auth');

router.get('/products/:shopId', auth, getSimulatorProducts);
router.post('/checkout/:shopId', auth, processCheckout);
router.post('/refund/:shopId', auth, processRefund);
router.get('/orders/:shopId', auth, getRecentOrders);

module.exports = router;
