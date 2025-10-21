const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const homeRoutes = require("./home.routes");
const adminRouters = require("./admin.routes");
const customerRouters = require("./customer.routes");

const foodRoutes = require("./food.routes");
const shopRoutes = require("./shop.routes");

const cartRoutes = require("./cart.routes")
const orderRoutes = require("./order.routes");

const ownerRoutes = require("./owner.routes");

router.use(ownerRoutes);

router.use(customerRouters);
router.use(foodRoutes);
router.use(shopRoutes);
router.use(adminRouters);
router.use(homeRoutes);
router.use(authRoutes);

router.use(cartRoutes)
router.use(orderRoutes)
// router.use(adminRouters);

module.exports = router;
