const express = require('express');
const router = express.Router();
const { autoLogin } = require('../controllers/devController');

router.get('/auto-login', autoLogin);

module.exports = router;
