const db = require('../config/db');

const CartModel = {
    async getByUser(userId) {
        const [rows] = await db.query(
            `SELECT c.id, c.product_id, c.ukuran, c.qty,
                    p.nama, p.harga, p.gambar, p.brand
             FROM cart_items c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );
        return rows;
    },

    async findItem(userId, productId, ukuran) {
        const [rows] = await db.query(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND ukuran = ?',
            [userId, productId, ukuran]
        );
        return rows[0];
    },

    async addItem(userId, productId, ukuran, qty) {
        const existing = await this.findItem(userId, productId, ukuran);
        if (existing) {
            await db.query(
                'UPDATE cart_items SET qty = qty + ? WHERE id = ?',
                [qty, existing.id]
            );
            return existing.id;
        } else {
            const sql = `INSERT INTO cart_items (user_id, product_id, ukuran, qty) 
                         VALUES (?, ?, ?, ?)`;
            const [result] = await db.query(sql, [userId, productId, ukuran, qty]);
            return result.insertId;
        }
    },

    async updateQty(cartItemId, userId, qty) {
        await db.query(
            'UPDATE cart_items SET qty = ? WHERE id = ? AND user_id = ?',
            [qty, cartItemId, userId]
        );
    },

    async removeItem(cartItemId, userId) {
        await db.query(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [cartItemId, userId]
        );
    },

    async clearCart(userId) {
        await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    }
};

module.exports = CartModel;
