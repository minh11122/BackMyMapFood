const express = require("express");
const router = express.Router();
const {
  listAccounts,
  updateAccountStatus,
  listUsers,
  listUserAddresses,
} = require("../controller/listAccount.admin.controller");

router.get("/admin/listAccount", listAccounts);

router.get("/admin/listUsers", listUsers);

router.get("/admin/listAddress", listUserAddresses);

module.exports = router;
