const Food = require("../models/food.model");
const Shop = require("../models/shop.model");

// Lấy danh sách tất cả món ăn
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("shop_id", "name address phone") // lấy tên shop, địa chỉ, sđt
      .populate("category_id", "name") // lấy tên category
      .populate("created_by", "name email"); // người tạo (manager)

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.searchShopsAndFoods = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: "Query missing" });

    // Tìm quán theo name
    const shops = await Shop.find(
      { name: { $regex: query, $options: "i" }, status: "ACTIVE" }
    )
      .limit(5)
      .lean();

    const formattedShops = shops.map((s) => ({
      type: "shop",
      id: s._id,
      name: s.name,
      image: s.img || "/placeholder.svg"
    }));

    // Tìm món theo name hoặc description
    const foods = await Food.find(
      { $text: { $search: query }, is_available: true }
    )
      .limit(5)
      .populate("shop_id", "name")
      .lean();

    const formattedFoods = foods.map((f) => ({
      type: "food",
      id: f._id,
      name: f.name,
      image: f.image_url || "/placeholder.svg",
      shopName: f.shop_id?.name
    }));

    res.status(200).json({
      success: true,
      data: [...formattedShops, ...formattedFoods]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

