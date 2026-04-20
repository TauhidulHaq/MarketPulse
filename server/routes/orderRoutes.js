const express = require('express');
const router = express.Router();
const { updateStatus, listOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.put('/orders/:orderId/status', auth, updateStatus);
router.get('/orders', auth, listOrders);

module.exports = router;
