const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/divisions', salesController.getDivisions);
router.get('/divisions/:division/districts', salesController.getDistricts);
router.get('/location-revenue', salesController.getLocationRevenue);

module.exports = router;
