const db = require('../config/db');

const UserModel = {
    async create(nama, email, hashedPassword, otp_code, otp_expires) {
        const sql = `INSERT INTO users (nama, email, password, role, is_verified, otp_code, otp_expires) 
                     VALUES (?, ?, ?, 'user', 0, ?, ?)`;
        const [result] = await db.query(sql, [nama, email, hashedPassword, otp_code, otp_expires]);
        return result.insertId;
    },

    async createWithGoogle(nama, email, googleId) {
        const sql = `INSERT INTO users (nama, email, password, role, is_verified, google_id) 
                     VALUES (?, ?, '', 'user', 1, ?)`;
        const [result] = await db.query(sql, [nama, email, googleId]);
        return result.insertId;
    },

    async updateOTP(id, otp_code, otp_expires) {
        const sql = `UPDATE users SET otp_code = ?, otp_expires = ? WHERE id = ?`;
        await db.query(sql, [otp_code, otp_expires, id]);
    },

    async verifyUser(id) {
        const sql = `UPDATE users SET is_verified = 1, otp_code = NULL, otp_expires = NULL WHERE id = ?`;
        await db.query(sql, [id]);
    },

    async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async findByGoogleId(googleId) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE google_id = ?',
            [googleId]
        );
        return rows[0];
    },

    async findAll() {
        const [rows] = await db.query(
            'SELECT id, nama, email, role, is_verified, created_at FROM users'
        );
        return rows;
    }
};

module.exports = UserModel;
