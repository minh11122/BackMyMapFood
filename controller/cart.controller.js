const CartItem = require("../models/cartItem.model");
const Food = require("../models/food.model");
const Shop = require("../models/shop.model");
const Voucher = require("../models/voucher.model");

// 🛒 Add món ăn vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { userId, shopId, foodId, quantity = 1, note } = req.body;

    console.log("📥 AddToCart request body:", req.body);

    // Kiểm tra đầu vào
    if (!userId || !shopId || !foodId)
      return res.status(400).json({ success: false, message: "Thiếu userId, shopId hoặc foodId" });

    const shop = await Shop.findById(shopId);
    const food = await Food.findById(foodId);

    if (!shop || !food) {
      console.warn("⚠️ Shop hoặc món không tồn tại:", { shop, food });
      return res.status(404).json({ success: false, message: "Shop hoặc món không tồn tại" });
    }

    // Kiểm tra món có thuộc shop không
    if (food.shop_id.toString() !== shopId) {
      console.warn("⚠️ Món không thuộc shop:", { foodShop: food.shop_id, reqShop: shopId });
      return res.status(400).json({ success: false, message: "Món này không thuộc shop này" });
    }

    // Kiểm tra món đã có trong giỏ chưa
    const existing = await CartItem.findOne({
      user: userId,
      shop: shopId,
      food: foodId,
      status: "ACTIVE",
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      console.log("✅ Đã cập nhật số lượng:", existing);
      return res.status(200).json({ success: true, message: "Đã cập nhật số lượng", data: existing });
    }

    // Thêm mới
    const newItem = await CartItem.create({
      user: userId,
      shop: shopId,
      food: foodId,
      quantity,
      price: food.price,
      note,
    });

    console.log("✅ Đã thêm món mới vào giỏ:", newItem);
    res.status(201).json({ success: true, message: "Đã thêm vào giỏ hàng", data: newItem });
  } catch (err) {
    console.error("❌ Add to cart error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({
      success: false,
      message: "Server error khi thêm vào giỏ",
      error: err.message,
    });
  }
};

// 🧺 Lấy giỏ hàng theo shop
exports.getCartByShop = async (req, res) => {
  try {
    const { userId, shopId } = req.params;
    console.log("📥 GetCart request:", { userId, shopId });

    const cartItems = await CartItem.find({
      user: userId,
      shop: shopId,
      status: "ACTIVE",
    })
      .populate("food", "name price discount image_url")
      .populate("shop", "name logoUrl address")
      .lean();

    console.log("📦 Found cart items:", cartItems.length);

    if (!cartItems.length)
      return res.status(200).json({ success: true, message: "Chưa có món nào trong giỏ", data: [] });

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems,
    });
  } catch (err) {
    console.error("❌ Get cart error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({
      success: false,
      message: "Server error khi lấy giỏ hàng",
      error: err.message,
    });
  }
};

// 🧺 Lấy toàn bộ giỏ hàng của user, group theo shop
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params
    console.log("📥 GetCartByUser:", userId)

    const cartItems = await CartItem.find({
      user: userId,
      status: "ACTIVE",
    })
      .populate("food", "name price discount image_url")
      .populate("shop", "name logoUrl address")
      .lean()

    if (!cartItems.length) {
      return res.status(200).json({ success: true, data: [] })
    }

    // 🧩 Gom theo shop
    const grouped = {}
    for (const item of cartItems) {
      const shopId = item.shop._id.toString()
      if (!grouped[shopId]) {
        grouped[shopId] = {
          shop: item.shop,
          items: [],
        }
      }
      grouped[shopId].items.push(item)
    }

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: Object.values(grouped),
    })
  } catch (err) {
    console.error("❌ GetCartByUser error:", err)
    res.status(500).json({
      success: false,
      message: "Server error khi lấy giỏ hàng người dùng",
      error: err.message,
    })
  }
}

exports.getVouchersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId)
      return res.status(400).json({ success: false, message: "Thiếu shopId" });

    const now = new Date();
    const vouchers = await Voucher.find({
      shop: shopId,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).lean();

    if (!vouchers.length)
      return res.status(200).json({ success: true, message: "Không có voucher khả dụng", data: [] });

    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers,
    });
  } catch (err) {
    console.error("❌ Get vouchers error:", err);
    res.status(500).json({
      success: false,
      message: "Server error khi lấy voucher",
      error: err.message,
    });
  }
};