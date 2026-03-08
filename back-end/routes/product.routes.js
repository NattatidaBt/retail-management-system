const express = require("express");
const router = express.Router();

// นำเข้าเฉพาะ Product Controller
const {
  getProducts, 
  getProductById,
  createProduct, 
  updateProduct,
  adjustStock, 
  deleteProduct,
} = require("../controllers/product.controller");

const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

/* =========================================
   Product Routes (Base Path: /products)
   ========================================= */

// 1. ดูสินค้าทั้งหมด (staff + admin)
router.get("/", verifyToken, getProducts);

// 2. ดูสินค้ารายตัว (staff + admin)
router.get("/:id", verifyToken, getProductById);

// 3. เพิ่มสินค้าใหม่ (admin only)
router.post("/", verifyToken, isAdmin, createProduct);

// 4. แก้ไขข้อมูลสินค้า (admin only)
router.put("/:id", verifyToken, isAdmin, updateProduct);

// 5. ปรับจำนวน Stock (admin only)
router.patch("/:id/stock", verifyToken, isAdmin, adjustStock);

// 6. ลบสินค้า (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;