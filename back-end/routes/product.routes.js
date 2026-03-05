const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

router.get("/", verifyToken, getProducts);                    // staff + admin
router.get("/:id", verifyToken, getProductById);              // staff + admin
router.post("/", verifyToken, isAdmin, createProduct);        // admin only
router.put("/:id", verifyToken, isAdmin, updateProduct);      // admin only
router.patch("/:id/stock", verifyToken, isAdmin, adjustStock);// admin only
router.delete("/:id", verifyToken, isAdmin, deleteProduct);   // admin only

module.exports = router;