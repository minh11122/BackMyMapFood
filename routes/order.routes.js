const express = require("express");
const router = express.Router();

const orderController = require("../controller/order.controller");

router.post("/orders/create", orderController.createOrder);

router.get("/orders/history", orderController.getOrders);

router.post("/orders/cancel/:id", orderController.cancelOrder);

module.exports = router;