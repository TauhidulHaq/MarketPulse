const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/:shopId/overview', getOverview);
router.get('/:shopId/top-hours', require('../controllers/dashboardController').getTopHours);

module.exports = router;
