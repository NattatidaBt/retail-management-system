const express = require("express");
const router = express.Router();
const { getPosts, createPost, updatePost } = require("../controllers/post.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ทุก Route ของ Post ต้องผ่านการตรวจ Token ก่อนเสมอ
router.use(verifyToken);

// GET /posts - ดูโพสต์ทั้งหมด
router.get("/", getPosts);

// POST /posts - สร้างโพสต์ใหม่
router.post("/", createPost);

// PUT /posts/:id - แก้ไขโพสต์ (มีการเช็คเจ้าของใน Controller แล้ว)
router.put("/:id", updatePost);

module.exports = router;