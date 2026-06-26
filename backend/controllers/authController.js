const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const UserModel = require('../models/userModel');
const { sendOTPEmail } = require('../utils/email');
require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

const authController = {
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
            if (existingUser && existingUser.is_verified === 1) {
                return res.status(400).json({ message: 'Email sudah terdaftar dan terverifikasi.' });
            }

            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            const hashedPassword = await bcrypt.hash(password, 10);

            if (existingUser && existingUser.is_verified === 0) {
                // Resend OTP for existing unverified user
                await UserModel.updateOTP(existingUser.id, otp, otpExpires);
            } else {
                // Create new user
                await UserModel.create(nama, email, hashedPassword, otp, otpExpires);
            }

            // Send Email
            await sendOTPEmail(email, otp);

            res.status(201).json({ message: 'Registrasi berhasil. Silakan cek email Anda untuk kode OTP.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server saat registrasi.' });
        }
    },

    async verifyOTP(req, res) {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email dan OTP wajib diisi' });

        try {
            const user = await UserModel.findByEmail(email);
            if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
            if (user.is_verified === 1) return res.status(400).json({ message: 'User sudah terverifikasi' });
            
            if (user.otp_code !== otp) {
                return res.status(400).json({ message: 'Kode OTP salah' });
            }
            
            if (new Date(user.otp_expires) < new Date()) {
                return res.status(400).json({ message: 'Kode OTP kedaluwarsa, silakan daftar ulang' });
            }

            await UserModel.verifyUser(user.id);
            res.json({ message: 'Verifikasi berhasil! Silakan login.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server.' });
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

            if (user.is_verified === 0) {
                return res.status(401).json({ message: 'Email belum terverifikasi. Silakan cek email Anda atau daftar ulang.' });
            }

            // If user registered with google only and has no password, this compare will fail.
            if (!user.password && user.google_id) {
                 return res.status(401).json({ message: 'Akun ini terdaftar dengan Google. Silakan login menggunakan tombol Google.' });
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

    async googleLogin(req, res) {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: 'Token Google tidak ditemukan' });

        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const { sub: googleId, email, name: nama } = payload;

            let user = await UserModel.findByEmail(email);
            
            if (!user) {
                // Register new user with google
                const newUserId = await UserModel.createWithGoogle(nama, email, googleId);
                user = await UserModel.findById(newUserId);
            } else {
                // If user exists but not verified, or doesn't have google_id, we can verify them now
                if (user.is_verified === 0) {
                    await UserModel.verifyUser(user.id);
                }
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: 'Login Google berhasil',
                token,
                user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
            });

        } catch (err) {
            console.error('Google login error:', err);
            res.status(401).json({ message: 'Verifikasi Google gagal' });
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
