const Order = require("../models/order.model");
const UserAddress = require("../models/userAddress.model");
const CartItem = require("../models/cartItem.model");

exports.createOrder = async (req, res) => {
  console.log("📦 [CREATE ORDER] Body:", req.body);

  try {
    const {
      customer,
      shop,
      deliveryAddress, // string
      cartItems, // mảng cartId
      voucher,
      discountAmount,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      note,
      gps, // optional: [lng, lat]
    } = req.body;

    // 🔍 Kiểm tra dữ liệu bắt buộc
    const missing = [];
    if (!customer) missing.push("customer");
    if (!shop) missing.push("shop");
    if (!deliveryAddress) missing.push("deliveryAddress");
    if (!cartItems || !Array.isArray(cartItems) || !cartItems.length)
      missing.push("cartItems");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu bắt buộc",
        missingFields: missing,
      });
    }

    // 🏠 Kiểm tra address đã có chưa
    let addressDoc = await UserAddress.findOne({
      user: customer,
      "address.street": deliveryAddress,
    });

    if (!addressDoc) {
      addressDoc = await UserAddress.create({
        user: customer,
        address: { street: deliveryAddress },
        gps: { coordinates: gps || [0, 0] },
        isDefault: true,
      });
      console.log("🆕 Tạo mới địa chỉ:", addressDoc._id);
    }

    // 🛒 Lấy cartItem và cập nhật trạng thái CHECKOUT
    const cartDocs = await CartItem.find({ _id: { $in: cartItems }, user: customer, status: "ACTIVE" });
    if (!cartDocs.length)
      return res.status(400).json({ success: false, message: "Không tìm thấy món trong giỏ hoặc đã checkout" });

    // Update trạng thái cartItems
    await CartItem.updateMany(
      { _id: { $in: cartItems } },
      { $set: { status: "CHECKOUT" } }
    );

    // 🧾 Tạo mã đơn hàng
    const orderCode = "ORD-" + Date.now();

    const order = await Order.create({
      orderCode,
      customer,
      shop,
      deliveryAddress: addressDoc._id,
      cartItems: cartDocs.map((c) => c._id),
      voucher: voucher || null,
      discountAmount: discountAmount || 0,
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 0,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || "COD",
      note: note || null,
      status: "PENDING_PAYMENT",
      paymentStatus: paymentMethod === "COD" ? "COD_PENDING" : "UNPAID",
    });

    console.log("✅ Đơn hàng đã tạo:", order._id);

    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: order,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng",
      error: err.message,
    });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("shop", "name address")
      .populate("deliveryAddress")
      .populate({
        path: "cartItems",
        populate: { path: "food", select: "name price" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Danh sách đơn hàng",
      data: orders,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đơn hàng",
      error: err.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const { cancelReason } = req.body; // optional

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (order.status !== "PENDING_PAYMENT") {
      return res.status(400).json({ success: false, message: "Chỉ đơn hàng đang chờ thanh toán mới có thể hủy" });
    }

    order.status = "CANCELLED";
    order.cancelReason = cancelReason || "Người dùng hủy";
    await order.save();

    return res.status(200).json({ success: true, message: "Hủy đơn hàng thành công", data: order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi server khi hủy đơn hàng", error: err.message });
  }
};
