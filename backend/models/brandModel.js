const db = require('../config/db');
const oracledb = require('oracledb');

const BrandModel = {
    async findAll() {
        const query = 'SELECT * FROM brands ORDER BY created_at ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM brands WHERE id = :id', { id });
        return rows[0];
    },

    async create({ nama, logo }) {
        const sql = `INSERT INTO brands (nama, logo) 
                     VALUES (:nama, :logo)
                     RETURNING id INTO :id`;
        const binds = {
            nama,
            logo,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };
        const [rows, result] = await db.query(sql, binds);
        return result.outBinds.id[0];
    },

    async delete(id) {
        await db.query('DELETE FROM brands WHERE id = :id', { id });
    }
};

module.exports = BrandModel;
