const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/analytics', verifyToken, verifyAdmin, adminController.getAnalytics);

module.exports = router;
