const { findNearbyShops } = require("../services/shop.service");

const getNearbyShopsByCoords = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Missing lat/lng" });
    }

    const shops = await findNearbyShops(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, shops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNearbyShopsByCoords };