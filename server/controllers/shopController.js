const Shop = require('../models/Shop');
const User = require('../models/User');
const { success, error } = require('../views/responseHelper');


const getUserShops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return success(res, shops, 'Shops retrieved successfully.');
  } catch (err) {
    console.error('getUserShops error:', err);
    return error(res, 500, 'Failed to retrieve shops.');
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!shop) {
      return error(res, 404, 'Shop not found.');
    }
    return success(res, shop, 'Shop retrieved successfully.');
  } catch (err) {
    console.error('getShopById error:', err);
    return error(res, 500, 'Failed to retrieve shop.');
  }
};

const createShop = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return error(res, 400, 'Shop name is required.');
    }

    const shop = await Shop.create({
      name,
      description: description || '',
      color: color || '#8B9A46',
      owner: req.user._id,
      status: 'connected',
      lastSynced: new Date(),
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { shops: shop._id },
    });

    return success(res, shop, 'Shop created successfully.', 201);
  } catch (err) {
    console.error('createShop error:', err);
    return error(res, 500, 'Failed to create shop.');
  }
};

const updateShop = async (req, res) => {
  try {
    const { name, description, color, status } = req.body;

    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name, description, color, status, lastSynced: new Date() },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return error(res, 404, 'Shop not found.');
    }

    return success(res, shop, 'Shop updated successfully.');
  } catch (err) {
    console.error('updateShop error:', err);
    return error(res, 500, 'Failed to update shop.');
  }
};

module.exports = { getUserShops, getShopById, createShop, updateShop };
