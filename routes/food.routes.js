const express = require("express");
const router = express.Router();
const { getAllFoods, getFoodsByShopId, getShopsWithTopFood, searchShopsAndFoods } = require("../controller/food.controller");


router.get("/foods", getAllFoods); // GET /api/foods
router.get("/search", searchShopsAndFoods); // GET /api/search


module.exports = router;
