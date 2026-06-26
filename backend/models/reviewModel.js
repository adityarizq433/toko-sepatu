const db = require('../config/db');

const ReviewModel = {
    async create(productId, userId, rating, komentar) {
        const sql = `INSERT INTO reviews (product_id, user_id, rating, komentar) 
                     VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [productId, userId, rating, komentar]);
        return result.insertId;
    },

    async getAverageRating(productId) {
        const [rows] = await db.query(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE product_id = ?',
            [productId]
        );
        return rows[0];
    },

    async findAll() {
        const [rows] = await db.query(
            `SELECT r.id, r.rating, r.komentar, r.created_at, u.nama as nama_user, p.nama as nama_produk 
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN products p ON r.product_id = p.id
             ORDER BY r.created_at DESC`
        );
        return rows;
    },

    async delete(id) {
        const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = ReviewModel;
