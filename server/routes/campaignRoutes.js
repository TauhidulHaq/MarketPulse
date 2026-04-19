const express = require('express');
const router = express.Router();
const { getCampaigns, createCampaign, toggleCampaign, validateCampaignCode } = require('../controllers/campaignController');
const auth = require('../middleware/auth');

router.get('/:shopId', auth, getCampaigns);
router.post('/:shopId', auth, createCampaign);
router.put('/:shopId/:campaignId/toggle', auth, toggleCampaign);
router.get('/:shopId/validate/:code', auth, validateCampaignCode);

module.exports = router;
