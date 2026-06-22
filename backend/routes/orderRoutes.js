const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/checkout', verifyToken, orderController.checkout);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', verifyToken, orderController.getOrderDetail);

// Admin only
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.patch('/:id/status', verifyToken, verifyAdmin, orderController.updateStatus);

module.exports = router;
