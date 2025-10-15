require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../configs/db.connect");
const Shop = require("../models/shop.model");
const Food = require("../models/food.model");
const FoodCategory = require("../models/foodCategory.model");

(async function seed() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const ownerId = new mongoose.Types.ObjectId("652b1e45a3c1234abcd56789");

    // 1️⃣ Insert Food Categories
    await FoodCategory.deleteMany({});
    const [foodCategory, drinkCategory] = await FoodCategory.insertMany([
      { name: "FOOD", description: "Các món ăn chính" },
      { name: "DRINK", description: "Đồ uống giải khát" },
    ]);
    console.log("📂 Inserted categories:", foodCategory.name, "&", drinkCategory.name);

    // 2️⃣ Insert ALL Shops (Foods + Drinks) in one go
    await Shop.deleteMany({});
    const allShops = await Shop.insertMany([
      // Food Shops
      {
        owner: ownerId,
        name: "Cơm Sinh Viên FPT",
        description: "Phục vụ cơm trưa chất lượng cho sinh viên",
        address: { street: "Khu A, Đại học FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5256, 21.0128] },
        phone: "0901000001",
      },
      {
        owner: ownerId,
        name: "Cơm Tấm Sài Gòn",
        description: "Cơm tấm chuẩn vị miền Nam",
        address: { street: "Khu B, Đại học FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5249, 21.0132] },
        phone: "0901000002",
      },
      {
        owner: ownerId,
        name: "Cơm Văn Phòng 123",
        description: "Cơm ngon - giá rẻ - nhanh chóng",
        address: { street: "Cổng chính FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5262, 21.0138] },
        phone: "0901000003",
      },
      {
        owner: ownerId,
        name: "Phở Bò Hà Nội",
        description: "Phở bò truyền thống đậm đà hương vị Bắc",
        address: { street: "Đối diện ký túc xá FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5268, 21.0115] },
        phone: "0901000004",
      },
      {
        owner: ownerId,
        name: "Phở Gà Ta 68",
        description: "Phở gà ta chính hiệu, nước trong ngọt thanh",
        address: { street: "Gần khu học FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5271, 21.0141] },
        phone: "0901000005",
      },
      // Drink Shops
      {
        owner: ownerId,
        name: "Trà Sữa House FPT",
        description: "Trà sữa thơm ngon cho sinh viên FPT",
        address: { street: "Cổng phụ FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5259, 21.0119] },
        phone: "0902000001",
      },
      {
        owner: ownerId,
        name: "Cà Phê Sinh Viên",
        description: "Quán cà phê view chill, giá sinh viên",
        address: { street: "Đối diện tòa Gamma", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5245, 21.0127] },
        phone: "0902000002",
      },
      {
        owner: ownerId,
        name: "Tea & Talk FPT",
        description: "Không gian nói chuyện và thưởng trà",
        address: { street: "Gần tòa Delta", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5263, 21.0139] },
        phone: "0902000003",
      },
      {
        owner: ownerId,
        name: "Smoothie Station",
        description: "Sinh tố và nước ép trái cây tươi",
        address: { street: "Cạnh sân bóng FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5270, 21.0121] },
        phone: "0902000004",
      },
      {
        owner: ownerId,
        name: "High Tea Corner",
        description: "Quán trà kiểu Anh, không gian yên tĩnh",
        address: { street: "Đối diện thư viện FPT", ward: "Hòa Lạc", district: "Thạch Thất", city: "Hà Nội", province: "Hà Nội" },
        gps: { type: "Point", coordinates: [105.5253, 21.0142] },
        phone: "0902000005",
      },
    ]);
    console.log(`🏪 Inserted ${allShops.length} shops (food + drink)`);

    // 3️⃣ Prepare ALL menu items (Foods + Drinks)
    const menuItems = {
      "Cơm Sinh Viên FPT": {
        category: foodCategory._id,
        items: ["Cơm gà chiên giòn", "Cơm sườn bì chả", "Cơm rang dưa bò", "Cơm cá kho tộ", "Cơm trứng ốp la"],
        priceRange: [40000, 55000],
      },
      "Cơm Tấm Sài Gòn": {
        category: foodCategory._id,
        items: ["Cơm tấm sườn bì", "Cơm tấm chả trứng", "Cơm tấm bì chả sườn", "Cơm tấm sườn que nướng", "Cơm tấm bì thịt nướng"],
        priceRange: [40000, 55000],
      },
      "Cơm Văn Phòng 123": {
        category: foodCategory._id,
        items: ["Cơm thịt kho trứng", "Cơm bò xào hành tây", "Cơm cá chiên mắm", "Cơm gà xối mỡ", "Cơm sườn non rim"],
        priceRange: [40000, 55000],
      },
      "Phở Bò Hà Nội": {
        category: foodCategory._id,
        items: ["Phở bò tái", "Phở bò chín", "Phở bò tái gân", "Phở đặc biệt", "Phở trộn"],
        priceRange: [40000, 55000],
      },
      "Phở Gà Ta 68": {
        category: foodCategory._id,
        items: ["Phở gà ta", "Phở gà trộn", "Phở gà xé", "Phở gà đặc biệt", "Phở không người lái"],
        priceRange: [40000, 55000],
      },
      "Trà Sữa House FPT": {
        category: drinkCategory._id,
        items: ["Trà sữa trân châu", "Trà sữa matcha", "Trà sữa socola", "Trà sữa thái xanh", "Trà sữa khoai môn"],
        priceRange: [30000, 50000],
      },
      "Cà Phê Sinh Viên": {
        category: drinkCategory._id,
        items: ["Cà phê đen đá", "Cà phê sữa", "Bạc xỉu", "Cà phê trứng", "Cà phê muối"],
        priceRange: [30000, 50000],
      },
      "Tea & Talk FPT": {
        category: drinkCategory._id,
        items: ["Trà đào cam sả", "Trà chanh mật ong", "Trà táo bạc hà", "Trà tắc xí muội", "Trà ổi hồng"],
        priceRange: [30000, 50000],
      },
      "Smoothie Station": {
        category: drinkCategory._id,
        items: ["Sinh tố bơ", "Sinh tố xoài", "Nước ép cam", "Nước ép dưa hấu", "Nước ép táo"],
        priceRange: [30000, 50000],
      },
      "High Tea Corner": {
        category: drinkCategory._id,
        items: ["Trà bá tước Earl Grey", "Trà hoa cúc", "Trà oolong sữa", "Trà nhài", "Trà đen Assam"],
        priceRange: [30000, 50000],
      },
    };

    // 4️⃣ Create ALL food items at once
    await Food.deleteMany({});
    const allFoodItems = [];
    
    for (const shop of allShops) {
      const menuData = menuItems[shop.name];
      if (!menuData) continue;

      const items = menuData.items.map((name) => ({
        shop_id: shop._id,
        category_id: menuData.category,
        name,
        description: `Món ăn đặc trưng của ${shop.name}`,
        price: Math.floor(menuData.priceRange[0] + Math.random() * (menuData.priceRange[1] - menuData.priceRange[0])),
        discount: 0,
        image_url: "https://placehold.co/400x300",
        created_by: ownerId,
      }));
      
      allFoodItems.push(...items);
    }

    // 🔥 Insert ALL items in ONE operation
    await Food.insertMany(allFoodItems);
    console.log(`🍽️ Inserted ${allFoodItems.length} items (foods + drinks) in ONE operation`);

    console.log("🎉 Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    mongoose.connection.close();
  }
})();