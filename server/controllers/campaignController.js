const Campaign = require('../models/Campaign');
const { success, error } = require('../views/responseHelper');

const getCampaigns = async (req, res) => {
  try {
    const { shopId } = req.params;
    const campaigns = await Campaign.find({ shop: shopId }).sort({ createdAt: -1 });
    return success(res, campaigns, 'Campaigns retrieved successfully.');
  } catch (err) {
    return error(res, 500, 'Failed to fetch campaigns.');
  }
};

const createCampaign = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { code, discountPercentage } = req.body;

    if (!code || !discountPercentage) {
      return error(res, 400, 'Code and discount value are required.');
    }

    const existing = await Campaign.findOne({ shop: shopId, code: code.toUpperCase() });
    if (existing) {
      return error(res, 400, 'Campaign code already exists.');
    }

    const newCampaign = await Campaign.create({
      shop: shopId,
      code: code.toUpperCase(),
      discountPercentage
    });

    return success(res, newCampaign, 'Campaign created successfully.', 201);
  } catch (err) {
    return error(res, 500, 'Failed to create campaign.');
  }
};

const toggleCampaign = async (req, res) => {
  try {
    const { shopId, campaignId } = req.params;
    const campaign = await Campaign.findOne({ _id: campaignId, shop: shopId });

    if (!campaign) {
      return error(res, 404, 'Campaign not found.');
    }

    campaign.isActive = !campaign.isActive;
    await campaign.save();

    return success(res, campaign, `Campaign marked as ${campaign.isActive ? 'Active' : 'Inactive'}.`);
  } catch (err) {
    return error(res, 500, 'Failed to toggle campaign.');
  }
};

const validateCampaignCode = async (req, res) => {
  try {
    const { shopId, code } = req.params;
    const campaign = await Campaign.findOne({ shop: shopId, code: code.toUpperCase() });

    if (!campaign) {
      return error(res, 404, 'Invalid promo code.');
    }

    if (!campaign.isActive) {
      return error(res, 400, 'This promo code is no longer active.');
    }

    return success(res, campaign, 'Promo code is valid.');
  } catch (err) {
    return error(res, 500, 'Failed to validate campaign.');
  }
}

module.exports = {
  getCampaigns,
  createCampaign,
  toggleCampaign,
  validateCampaignCode
};
