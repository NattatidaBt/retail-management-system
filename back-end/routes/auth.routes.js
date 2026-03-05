const express = require("express");
const router = express.Router();

// เพิ่ม register เข้ามาด้วย
const { login, register } = require("../controllers/auth.controller");

// login
router.post("/login", login);

// register 
router.post("/register", register);

module.exports = router;
