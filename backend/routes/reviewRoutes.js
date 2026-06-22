const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, reviewController.create);

module.exports = router;
