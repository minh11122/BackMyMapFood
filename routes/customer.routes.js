const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controller/customer.controller");

// ✅ Lấy đầy đủ profile (account + user + address)
router.get("/customer/:userId/profile", getUserProfile);

module.exports = router;
