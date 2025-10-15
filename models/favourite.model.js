const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
}, { timestamps: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
