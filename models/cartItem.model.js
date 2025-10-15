const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  note: String,
  status: {
    type: String,
    enum: ["ACTIVE", "CHECKOUT", "REMOVED"],
    default: "ACTIVE",
  },
}, { timestamps: true });

module.exports = mongoose.model("CartItem", cartItemSchema);
