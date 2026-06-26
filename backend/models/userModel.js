const db = require('../config/db');

const UserModel = {
    async create(nama, email, hashedPassword) {
        const sql = `INSERT INTO users (nama, email, password, role) 
                     VALUES (?, ?, ?, 'user')`;
        const [result] = await db.query(sql, [nama, email, hashedPassword]);
        return result.insertId;
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
            'SELECT id, nama, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async findAll() {
        const [rows] = await db.query(
            'SELECT id, nama, email, role, created_at FROM users'
        );
        return rows;
    }
};

module.exports = UserModel;
