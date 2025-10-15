const express = require('express');
const router = express.Router();

const { getNearbyShopsByCoords } = require('../controller/home.controller');

// Người dùng gửi lat/lng (login hoặc chưa login đều dùng được)
router.get("/home/nearby", getNearbyShopsByCoords);

module.exports = router;
