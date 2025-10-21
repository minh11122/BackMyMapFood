const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, unique: true },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
      required: true,
    },

    // 🛒 Giỏ hàng
    cartItems: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CartItem", required: true },
    ],

    // 💸 Thêm voucher
    voucher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Voucher", 
      default: null 
    },
    discountAmount: { type: Number, default: 0 },

    subtotal: Number,
    shippingFee: { type: Number, default: 0 },
    totalAmount: Number,

    // ✅ Thêm thông tin người nhận đơn
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    receiverEmail: { type: String, default: null },

    status: {
      type: String,
      enum: [
        "PENDING_PAYMENT",
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      default: "PENDING_PAYMENT",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED", "COD_PENDING"],
      default: "UNPAID",
    },

    note: String,
    cancelReason: String,

    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
