const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
