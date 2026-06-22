const db = require('../config/db');
const oracledb = require('oracledb');

const ReviewModel = {
    async create(productId, userId, rating, komentar) {
        const sql = `INSERT INTO reviews (product_id, user_id, rating, komentar) 
                     VALUES (:productId, :userId, :rating, :komentar)
                     RETURNING id INTO :id`;
        const binds = {
            productId, userId, rating, komentar,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };
        const [rows, result] = await db.query(sql, binds);
        return result.outBinds.id[0];
    },

    async getAverageRating(productId) {
        const [rows] = await db.query(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE product_id = :productId',
            { productId }
        );
        return rows[0];
    }
};

module.exports = ReviewModel;
