const db = require('../config/db');
const oracledb = require('oracledb');

const UserModel = {
    async create(nama, email, hashedPassword) {
        const sql = `INSERT INTO users (nama, email, password, role) 
                     VALUES (:nama, :email, :password, :role) 
                     RETURNING id INTO :id`;
        
        const binds = {
            nama: nama,
            email: email,
            password: hashedPassword,
            role: 'user',
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };

        const [rows, result] = await db.query(sql, binds);
        return result.outBinds.id[0];
    },

    async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = :email',
            { email }
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await db.query(
            'SELECT id, nama, email, role, created_at FROM users WHERE id = :id',
            { id }
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
