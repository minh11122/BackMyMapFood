const express = require("express");
const router = express.Router();
const { 
  getShopsAndFoodsByOwner, // ✅ thêm controller mới
  getShopProfile,
  updateShopProfile,
  getFoodsByOwner,
  updateFood,
  getFinanceByOwner,
  getRevenueByShop
} = require("../controller/owner.controller");

router.get("/owner/:ownerId/shop", getShopProfile);
router.put("/owner/:ownerId/shop", updateShopProfile);

// Đồ ăn
router.get("/owner/:ownerId/foods", getFoodsByOwner);
router.put("/owner/food/:foodId", updateFood);

// Tài chính
router.get("/owner/:ownerId/finance", getFinanceByOwner);

router.get("/owner/:ownerId/revenue", getRevenueByShop);

module.exports = router;
