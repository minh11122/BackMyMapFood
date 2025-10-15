const mongoose = require("mongoose");
const Account = require("../models/accout.model");
const Role = require("../models/role.model");
const User = require("../models/user.model");
const UserAddress = require("../models/userAddress.model");

// ------------------- Account -------------------
const listAccounts = async (req, res) => {
  try {
    const { search, role, status, page = 1 } = req.query;
    const limit = 8;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) query.email = { $regex: search, $options: "i" };
    if (role) query.role_id = role;
    if (status) query.status = status;

    const accounts = await Account.find(query)
      .populate("role_id", "name description")
      .select("email status email_verified role_id createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Account.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({ accounts, totalPages, currentPage: parseInt(page) });
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

module.exports = {
  listAccounts,
  updateAccountStatus,
  listUsers,
  listUserAddresses,
};
