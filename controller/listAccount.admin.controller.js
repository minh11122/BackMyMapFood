const mongoose = require("mongoose");
const Account = require("../models/accout.model");
const Role = require("../models/role.model");
const User = require("../models/user.model");
const UserAddress = require("../models/userAddress.model");
const Shop = require("../models/shop.model");

// ------------------- Account -------------------
const listAccounts = async (req, res) => {
  try {
    const { search, role, status, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) query.email = { $regex: search, $options: "i" };
    if (role) query.role_id = role;
    if (status) query.status = status;

    // Lấy account + role + user
    const accounts = await Account.find(query)
      .populate("role_id", "name description")
      .select("email status email_verified role_id createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    // Lấy danh sách user tương ứng theo account_id
    const accountIds = accounts.map(acc => acc._id);
    const users = await User.find({ account_id: { $in: accountIds } })
      .select("account_id full_name phone avatar_url date_of_birth gender")
      .lean();

    // Gắn user vào từng account
    const accountsWithUsers = accounts.map(acc => ({
      ...acc,
      user: users.find(u => u.account_id.toString() === acc._id.toString()) || null
    }));

    const total = await Account.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      accounts: accountsWithUsers,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAccountAndUser = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { full_name, status } = req.body;

    // Kiểm tra account tồn tại
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Cập nhật trạng thái account nếu có
    if (status) {
      account.status = status;
      await account.save();
    }

    // Cập nhật tên user tương ứng
    const user = await User.findOne({ account_id: accountId });
    if (user && full_name) {
      user.full_name = full_name;
      await user.save();
    }

    return res.json({
      message: "Cập nhật thành công",
      account: {
        _id: account._id,
        email: account.email,
        status: account.status,
      },
      user: user
        ? { _id: user._id, full_name: user.full_name }
        : null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const updateAccountStatus = async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!accountId)
      return res.status(400).json({ message: "Thiếu account_id" });

    const account = await Account.findById(accountId);
    if (!account)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    if (account.status === "PENDING")
      return res
        .status(400)
        .json({ message: "Không thể cập nhật trạng thái từ PENDING" });

    const newStatus = account.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { status: newStatus },
      { new: true }
    ).populate("role_id", "name description");

    return res.json({
      message: "Cập nhật trạng thái thành công",
      account: updatedAccount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ------------------- User -------------------
const listUsers = async (req, res) => {
  try {
    const { search, gender, page = 1 } = req.query;
    const limit = 8;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) query.full_name = { $regex: search, $options: "i" };
    if (gender) query.gender = gender;

    const users = await User.find(query)
      .populate("account_id", "email status role_id")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({ users, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ------------------- UserAddress -------------------
const listUserAddresses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const addresses = await UserAddress.find()
      .populate("user", "full_name phone avatar_url email")
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await UserAddress.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return res.json({ addresses, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ------------------- Shop -------------------
const listShops = async (req, res) => {
  try {
    const { search, status, page = 1 } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (status) query.status = status;

    // Lấy danh sách shop + populate chủ quán (User)
    const shops = await Shop.find(query)
      .populate("owner", "full_name phone avatar_url email")
      .select("name description address phone status img rating createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Shop.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      shops,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ------------------- Cập nhật thông tin cửa hàng -------------------
const updateShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { name, description, address, phone, status, img } = req.body;

    // Tìm shop theo ID
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Không tìm thấy cửa hàng" });
    }

    // Cập nhật các trường
    if (name) shop.name = name;
    if (description !== undefined) shop.description = description;
    if (address && typeof address === "object") {
      shop.address = {
        ...shop.address,
        ...address,
      };
    }
    if (phone) shop.phone = phone;
    if (status) shop.status = status;
    if (img) shop.img = img;

    await shop.save();

    return res.json({
      message: "Cập nhật cửa hàng thành công",
      shop,
    });
  } catch (error) {
    console.error("Lỗi cập nhật shop:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listAccounts,
  updateAccountStatus,
  listUsers,
  listUserAddresses,
  updateAccountAndUser,
  listShops,
  updateShop
};
