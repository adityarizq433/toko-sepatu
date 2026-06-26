const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/', verifyToken, reviewController.create);
router.get('/', verifyToken, verifyAdmin, reviewController.getAll);
router.delete('/:id', verifyToken, verifyAdmin, reviewController.delete);

module.exports = router;
