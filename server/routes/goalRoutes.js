const express = require('express');
const router = express.Router();
const { getGoal, setGoal } = require('../controllers/goalController');
const auth = require('../middleware/auth');

router.get('/shops/:shopId/goal', auth, getGoal);
router.post('/shops/:shopId/goal', auth, setGoal);

module.exports = router;
