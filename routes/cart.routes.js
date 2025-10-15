const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller");

// 🛒 Thêm món vào giỏ hàng
router.post("/cart/add", cartController.addToCart);

// 🧺 Lấy giỏ hàng theo shop (chỉ các món từ 1 shop)
router.get("/cart/user/:userId/shop/:shopId", cartController.getCartByShop);

// ❌ Xóa 1 món khỏi giỏ
router.delete("/cart/:cartItemId", async (req, res) => {
  const CartItem = require("../models/cartItem.model");
  try {
    const { cartItemId } = req.params;
    const item = await CartItem.findById(cartItemId);
    if (!item)
      return res.status(404).json({ success: false, message: "Không tìm thấy món trong giỏ" });

    item.status = "REMOVED";
    await item.save();
    res.status(200).json({ success: true, message: "Đã xóa khỏi giỏ hàng" });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ♻️ Cập nhật số lượng
router.put("/cart/:cartItemId", async (req, res) => {
  const CartItem = require("../models/cartItem.model");
  try {
    const { cartItemId } = req.params;
    const { quantity, note } = req.body;

    const item = await CartItem.findById(cartItemId);
    if (!item)
      return res.status(404).json({ success: false, message: "Không tìm thấy món trong giỏ" });

    if (quantity <= 0)
      return res.status(400).json({ success: false, message: "Số lượng phải lớn hơn 0" });

    item.quantity = quantity;
    if (note !== undefined) item.note = note;
    await item.save();

    res.status(200).json({ success: true, message: "Đã cập nhật giỏ hàng", data: item });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/cart/user/:userId", cartController.getCartByUser)

router.get("/cart/vouchers/:shopId", cartController.getVouchersByShop);


module.exports = router;
