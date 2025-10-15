const Shop = require("../models/shop.model");
const Food = require("../models/food.model");
const Category = require("../models/foodCategory.model");

// Lấy danh sách shop + món ăn trong từng shop
exports.getShopsWithFoods = async (req, res) => {
  try {
    const shops = await Shop.find().lean(); // lean() giúp query nhanh hơn

    // Với mỗi shop, lấy danh sách món ăn tương ứng
    const result = await Promise.all(
      shops.map(async (shop) => {
        const foods = await Food.find({ shop_id: shop._id })
          .select("name price discount image_url is_available");
        return { ...shop, foods };
      })
    );

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getShopsWithTopFood = async (req, res) => {
  try {
    const shops = await Shop.find().lean(); // lấy tất cả shop

    const result = await Promise.all(
      shops.map(async (shop) => {
        // Lấy tất cả món của shop
        const foods = await Food.find({ shop_id: shop._id })
          .select("name price discount image_url rating category_id")
          .populate("category_id", "name");

        if (!foods.length) return { ...shop, topFood: null };

        // Chọn món top: rating cao nhất, tie -> name ABC
        const sorted = foods.sort((a, b) => {
          const ratingA = a.rating || 4.5;
          const ratingB = b.rating || 4.5;
          if (ratingB !== ratingA) return ratingB - ratingA;
          return a.name.localeCompare(b.name);
        });

        const topFood = sorted[0];

        return {
          ...shop,
          topFood: {
            id: topFood._id,
            name: topFood.name,
            image: topFood.image_url || "/placeholder.svg",
            price: topFood.price,
            discount: topFood.discount,
            rating: topFood.rating || 4.5,
            category: topFood.category_id?.name || "Khác",
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching shops with top food:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getFoodsByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Lấy shop
    const shop = await Shop.findById(shopId).lean();
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    // Lấy món ăn của shop
    const foods = await Food.find({ shop_id: shopId })
      .select("name price discount image_url is_available category description")
      .populate("category_id", "name")
      .lean();

    // Trả về shop + foods
    res.status(200).json({
      success: true,
      data: {
        ...shop,
        foods
      }
    });
  } catch (error) {
    console.error("Error fetching shop by ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean(); // dùng Category thay vì FoodCategory
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Lấy tất cả món theo type category (FOOD / DRINK)
exports.getFoodsByType = async (req, res) => {
  try {
    let { type } = req.params;

    // Map slug thành DB type
    if (type === "do-uong") type = "DRINK";
    else if (type === "do-an") type = "FOOD";

    const category = await Category.findOne({ name: type });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const foods = await Food.find({ category_id: category._id })
      .populate("category_id", "name")
      .populate("shop_id", "name address")
      .lean();

    res.status(200).json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

