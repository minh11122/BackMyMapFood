const express = require("express");
const router = express.Router();
const {
  listAccounts,
  updateAccountStatus,
  listUsers,
  listUserAddresses,
  updateAccountAndUser,
  listShops,
  updateShop
} = require("../controller/listAccount.admin.controller");

router.get("/admin/listAccount", listAccounts);

router.get("/admin/listUsers", listUsers);

router.get("/admin/listShops", listShops);

router.get("/admin/listAddress", listUserAddresses);

router.put("/admin/updateAccount/:accountId", updateAccountAndUser);

router.put("/admin/updateShop/:shopId", updateShop);

module.exports = router;
