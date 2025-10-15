const express = require("express");
const router = express.Router();
const { 
  getShopsWithFoods, 
  getShopsWithTopFood, 
  getFoodsByShopId,
  getAllCategories,
  getFoodsByType
} = require("../controller/shop.controller");

// GET /api/shops - Lấy tất cả shops + foods
router.get("/shops", getShopsWithFoods);

// GET /api/shops/top-food - Lấy shops với món top
router.get("/shops/top-food", getShopsWithTopFood);

// GET /api/shops/:shopId - Lấy 1 shop cụ thể
// ⚠️ Route này phải đặt CUỐI CÙNG
router.get("/shops/:shopId", getFoodsByShopId);

router.get("/shops/food/categories", getAllCategories);

router.get("/type/:type", getFoodsByType); // /api/foods/type/FOOD hoặc /DRINK

module.exports = router;