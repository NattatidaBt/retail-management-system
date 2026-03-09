const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/log.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// GET /logs — admin only
router.get('/', verifyToken, isAdmin, getLogs);

module.exports = router;