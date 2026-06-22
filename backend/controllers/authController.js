const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel');
require('dotenv').config();

const authController = {
    // Validasi untuk register
    registerValidation: [
        body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
        body('email').isEmail().withMessage('Email tidak valid'),
        body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
    ],

    async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nama, email, password } = req.body;

        try {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await UserModel.create(nama, email, hashedPassword);

            res.status(201).json({ message: 'Registrasi berhasil', userId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi' });
        }

        try {
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: 'Login berhasil',
                token,
                user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async getProfile(req, res) {
        try {
            const user = await UserModel.findById(req.user.id);
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
};

module.exports = authController;
