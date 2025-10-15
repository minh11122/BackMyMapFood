const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  address: {
    street: String,
    ward: String,
    district: String,
    city: String,
    province: String
  },
  gps: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  phone: { type: String, unique: true, required: true },
  status: { type: String, enum: ["ACTIVE", "INACTIVE", "BANNED", "PENDING_APPROVAL"], default: "ACTIVE" },
  img: { type: String }, // ✅ Đúng field
  rating: { type: Number, default: 0 }
}, { timestamps: true });

// index geospatial
shopSchema.index({ gps: "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);
