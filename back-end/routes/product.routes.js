const express = require("express");
const router = express.Router();

const {
  getProducts, getProductById,
  createProduct, updateProduct,
  adjustStock, deleteProduct,
} = require("../controllers/product.controller");

const { getPosts, createPost, updatePost } = require("../controllers/post.controller"); // ✅ ย้ายขึ้นมาก่อน

const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// posts ต้องอยู่ก่อน /:id
router.get("/posts", verifyToken, getPosts);
router.post("/posts", verifyToken, createPost);
router.put("/posts/:id", verifyToken, updatePost);

// Product routes
router.get("/", verifyToken, getProducts);
router.get("/:id", verifyToken, getProductById);
router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.patch("/:id/stock", verifyToken, isAdmin, adjustStock);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router; 