const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getGoal, setGoal } = require('../controllers/goalController');

router.use(auth);

router.get('/:shopId/goal', getGoal);
router.post('/:shopId/goal', setGoal);

module.exports = router;
