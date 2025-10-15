const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["FOOD", "DRINK"], // chỉ chấp nhận hai loại
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodCategory", foodCategorySchema);

