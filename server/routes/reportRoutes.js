const express = require('express');
const router = express.Router();
const { generateSingleProductReport } = require('../controllers/reportController');


router.get('/single-product', generateSingleProductReport);

module.exports = router;
