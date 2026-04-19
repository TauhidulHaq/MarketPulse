const express = require('express');
const router = express.Router();
const { getRefundsOverview } = require('../controllers/refundController');
const auth = require('../middleware/auth');

router.get('/:shopId', auth, getRefundsOverview);

module.exports = router;
