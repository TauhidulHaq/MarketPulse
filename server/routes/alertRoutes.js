const express = require('express');
const router = express.Router();
const { getAlertsOverview, getCustomersToNotify } = require('../controllers/alertController');

router.get('/:shopId/overview', getAlertsOverview);
router.get('/:shopId/customers-to-notify', getCustomersToNotify);

module.exports = router;