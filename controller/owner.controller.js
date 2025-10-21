const mongoose = require("mongoose");

const Shop = require("../models/shop.model");
const Food = require("../models/food.model");
const Order = require("../models/order.model");

// ========== SHOP MANAGEMENT ==========

// Lấy quán và đồ ăn theo id chủ shop
exports.getShopsAndFoodsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Tìm tất cả quán của chủ này
    const shops = await Shop.find({ owner: ownerId });
    if (!shops.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy quán nào của chủ này",
      });
    }

    // Lấy danh sách món ăn thuộc các quán này
    const shopIds = shops.map((s) => s._id);
    const foods = await Food.find({ shop_id: { $in: shopIds } })
      .populate("shop_id", "name address phone")
      .populate("category_id", "name")
      .lean();

    res.status(200).json({
      success: true,
      ownerId,
      totalShops: shops.length,
      totalFoods: foods.length,
      shops,
      foods,
    });
  } catch (error) {
    console.error("Error fetching shops and foods:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET /api/owner/:ownerId/shop
exports.getShopProfile = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop)
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });

    res.json({ success: true, data: shop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/owner/:ownerId/shop
exports.updateShopProfile = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const updated = await Shop.findOneAndUpdate({ owner: ownerId }, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/owner/:ownerId/foods
exports.getFoodsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop)
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });

    const foods = await Food.find({ shop_id: shop._id })
      .populate("category_id", "name")
      .lean();

    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/owner/food/:foodId
exports.updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const updated = await Food.findByIdAndUpdate(foodId, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFinanceByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop)
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });

    const orders = await Order.find({ shop: shop._id, status: "DELIVERED" })
      .populate("customer", "full_name phone avatar_url")
      .populate("cartItems")
      .lean();

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    res.json({
      success: true,
      data: {
        totalRevenue,
        orderCount: orders.length,
        orders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRevenueByShop = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Tìm shop thuộc owner
    const shop = await Shop.findOne({ owner: ownerId }).lean();
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const successfulStatuses = ["DELIVERED"]; // đổi nếu cần

    /* ========== Phần summary (tổng) ========== */
    const orders = await Order.find({
      shop: shop._id,
      status: { $in: successfulStatuses },
      paymentStatus: "PAID",
    })
      .populate({
        path: "cartItems",
        populate: { path: "food", select: "name price" },
      })
      .populate("customer", "_id")
      .lean();

    const totalOrders = orders.length;
    let totalRevenue = 0;
    let totalFoodsSold = 0;
    const customerSet = new Set();

    for (const order of orders) {
      totalRevenue += Number(order.totalAmount || 0);

      const customerId =
        order.customer && order.customer._id
          ? String(order.customer._id)
          : order.customer
          ? String(order.customer)
          : null;
      if (customerId) customerSet.add(customerId);

      if (Array.isArray(order.cartItems)) {
        for (const item of order.cartItems) {
          totalFoodsSold += Number(item?.quantity || 0);
        }
      }
    }

    /* ========== Phần chi tiết theo món (aggregation) ========== */
    // Sử dụng trực tiếp shop._id để tránh lỗi "Class constructor ObjectId cannot be invoked without 'new'"
    const matchShopId = shop._id; // đã là ObjectId vì .lean() trả về doc có _id là ObjectId

    const foodSales = await Order.aggregate([
      {
        $match: {
          shop: matchShopId,
          status: { $in: successfulStatuses },
          paymentStatus: "PAID",
        },
      },
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "cartitems", // collection name (mongoose default plural lowercase)
          localField: "cartItems",
          foreignField: "_id",
          as: "cartItem",
        },
      },
      { $unwind: "$cartItem" },
      {
        $group: {
          _id: "$cartItem.food",
          totalSold: { $sum: { $ifNull: ["$cartItem.quantity", 0] } },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $ifNull: ["$cartItem.quantity", 0] },
                { $ifNull: ["$cartItem.price", 0] },
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "food",
        },
      },
      { $unwind: { path: "$food", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          foodId: "$_id",
          foodName: { $ifNull: ["$food.name", "Unknown food"] },
          totalSold: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    return res.json({
      success: true,
      data: {
        shop: { _id: shop._id, name: shop.name },
        summary: {
          totalRevenue,
          totalOrders,
          totalFoodsSold,
          uniqueCustomers: customerSet.size,
        },
        foodSales,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};