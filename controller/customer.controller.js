const Account = require("../models/accout.model");
const User = require("../models/user.model");
const UserAddress = require("../models/userAddress.model");
const Role = require("../models/role.model");

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });

    // 🔹 Lấy thông tin user
    const user = await User.findById(userId).populate("account_id");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // 🔹 Lấy thông tin tài khoản
    const account = await Account.findById(user.account_id._id).populate("role_id");

    // 🔹 Lấy danh sách địa chỉ
    const addresses = await UserAddress.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      profile: {
        account: {
          _id: account._id,
          email: account.email,
          provider: account.provider,
          status: account.status,
          role: account.role_id?.name || "CUSTOMER",
        },
        user: {
          _id: user._id,
          full_name: user.full_name,
          phone: user.phone,
          avatar_url: user.avatar_url,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
          createdAt: user.createdAt,
        },
        addresses,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin profile:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile };
