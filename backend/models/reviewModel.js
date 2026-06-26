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
    }
};

module.exports = ReviewModel;
