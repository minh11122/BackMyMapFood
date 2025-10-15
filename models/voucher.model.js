const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  shop: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Shop", 
    required: true // voucher phải thuộc về 1 shop
  },
  code: { type: String, unique: true, required: true },
  discountType: { type: String, enum: ["PERCENT", "FIXED"], required: true },
  discountValue: Number,
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: Number,
  startDate: Date,
  endDate: Date,
  usageLimit: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Voucher", voucherSchema);
