const mongoose = require("mongoose");
require("dotenv").config(); // nạp biến môi trường từ file .env
const Shop = require("../models/shop.model"); // đường dẫn model Shop

async function addImgField() {
  try {
    // 🔗 Kết nối MongoDB Atlas (giống hệt hai hàm trên)
    await mongoose.connect(process.env.MONGODB_ALATAS_URL);
    console.log("✅ MongoDB Atlas connected");

    // 🧩 Cập nhật tất cả shop chưa có trường img
    const result = await Shop.updateMany(
      { img: { $exists: false } }, // chỉ những shop chưa có field 'img'
      {
        $set: {
          img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24", // ảnh mặc định
        },
      }
    );

    console.log(`🖼️ Đã thêm trường 'img' cho ${result.modifiedCount} cửa hàng.`);

    process.exit(0); // kết thúc script
  } catch (error) {
    console.error("❌ Lỗi khi thêm trường img:", error);
    process.exit(1);
  }
}

addImgField();
