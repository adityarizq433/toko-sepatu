const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.put('/profile', verifyToken, userController.updateProfile);
router.get('/addresses', verifyToken, userController.getAddresses);
router.post('/addresses', verifyToken, userController.addAddress);
router.delete('/addresses/:id', verifyToken, userController.deleteAddress);

module.exports = router;
