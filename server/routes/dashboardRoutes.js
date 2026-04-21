const express = require('express');
const router = express.Router();
const { getOverview, getTopHours } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/:shopId/overview', getOverview);
router.get('/:shopId/top-hours', getTopHours);

module.exports = router;
