const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerStats } = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/:shopId', getCustomers);
router.get('/:shopId/stats', getCustomerStats);

module.exports = router;
