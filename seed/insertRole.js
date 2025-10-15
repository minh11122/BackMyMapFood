const mongoose = require("mongoose");
const Role = require("../models/role.model"); // đường dẫn đúng đến file Role bạn đã tạo

// 🔗 Kết nối MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Đã kết nối MongoDB");

    // 🚀 Dữ liệu seed
    const roles = [
      { name: "CUSTOMER", description: "Khách hàng bình thường" },
      { name: "SELLER_STAFF", description: "Nhân viên bán hàng" },
      { name: "MANAGER_STAFF", description: "Nhân viên quản lý" },
      { name: "STORE_DIRECTOR", description: "Giám đốc cửa hàng" },
      { name: "ADMIN", description: "Quản trị hệ thống" },
    ];

    // Xóa dữ liệu cũ (nếu cần)
    await Role.deleteMany({});
    console.log("🗑️ Đã xóa dữ liệu cũ trong collection Role");

    // Chèn mới
    await Role.insertMany(roles);
    console.log("🌱 Đã chèn dữ liệu Role thành công!");

    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Lỗi kết nối:", err));
