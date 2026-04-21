const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getOrders, updateOrderStatus } = require('../controllers/orderController');

router.use(auth);

router.get('/', getOrders);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
