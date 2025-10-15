require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../configs/db.connect");
const Shop = require("../models/shop.model");
const Food = require("../models/food.model");
const FoodCategory = require("../models/foodCategory.model");

connectDB();

(async () => {
  try {
    console.log("⚠️ Đang xóa toàn bộ dữ liệu cũ...");

    await Promise.all([
      Food.deleteMany({}),
      Shop.deleteMany({}),
      FoodCategory.deleteMany({})
    ]);

    console.log("✅ Đã xóa sạch dữ liệu trong Food, Shop và FoodCategory!");

  } catch (err) {
    console.error("❌ Lỗi khi xóa dữ liệu:", err.message);
  } finally {
    mongoose.connection.close();
  }
})();
