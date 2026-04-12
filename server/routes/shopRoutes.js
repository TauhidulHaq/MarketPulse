const express = require('express');
const router = express.Router();
const { getUserShops, getShopById, createShop, updateShop } = require('../controllers/shopController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getUserShops);
router.get('/:id', getShopById);
router.post('/', createShop);
router.put('/:id', updateShop);

module.exports = router;
