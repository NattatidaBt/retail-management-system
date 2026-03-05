const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  getDashboard,
} = require("../controllers/order.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

router.get("/dashboard", verifyToken, isAdmin, getDashboard); // admin only
router.get("/", verifyToken, getOrders);                      // staff + admin
router.get("/:id", verifyToken, getOrderById);                // staff + admin
router.post("/", verifyToken, createOrder);                   // staff + admin (Checkout)

module.exports = router;