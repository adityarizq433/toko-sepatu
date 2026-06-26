const db = require('../config/db');

const BrandModel = {
    async findAll() {
        const query = 'SELECT * FROM brands ORDER BY created_at ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
        return rows[0];
    },

    async create({ nama, logo }) {
        const sql = `INSERT INTO brands (nama, logo) 
                     VALUES (?, ?)`;
        const [result] = await db.query(sql, [nama, logo]);
        return result.insertId;
    },

    async delete(id) {
        await db.query('DELETE FROM brands WHERE id = ?', [id]);
    }
};

module.exports = BrandModel;
