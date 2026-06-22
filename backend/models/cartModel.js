const db = require('../config/db');
const oracledb = require('oracledb');

const CartModel = {
    async getByUser(userId) {
        const [rows] = await db.query(
            `SELECT c.id, c.product_id, c.ukuran, c.qty,
                    p.nama, p.harga, p.gambar, p.brand
             FROM cart_items c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = :userId`,
            { userId }
        );
        return rows;
    },

    async findItem(userId, productId, ukuran) {
        const [rows] = await db.query(
            'SELECT * FROM cart_items WHERE user_id = :userId AND product_id = :productId AND ukuran = :ukuran',
            { userId, productId, ukuran }
        );
        return rows[0];
    },

    async addItem(userId, productId, ukuran, qty) {
        const existing = await this.findItem(userId, productId, ukuran);
        if (existing) {
            await db.query(
                'UPDATE cart_items SET qty = qty + :qty WHERE id = :id',
                { qty, id: existing.id }
            );
            return existing.id;
        } else {
            const sql = `INSERT INTO cart_items (user_id, product_id, ukuran, qty) 
                         VALUES (:userId, :productId, :ukuran, :qty)
                         RETURNING id INTO :id`;
            const binds = {
                userId, productId, ukuran, qty,
                id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            };
            const [rows, result] = await db.query(sql, binds);
            return result.outBinds.id[0];
        }
    },

    async updateQty(cartItemId, userId, qty) {
        await db.query(
            'UPDATE cart_items SET qty = :qty WHERE id = :cartItemId AND user_id = :userId',
            { qty, cartItemId, userId }
        );
    },

    async removeItem(cartItemId, userId) {
        await db.query(
            'DELETE FROM cart_items WHERE id = :cartItemId AND user_id = :userId',
            { cartItemId, userId }
        );
    },

    async clearCart(userId) {
        await db.query('DELETE FROM cart_items WHERE user_id = :userId', { userId });
    }
};

module.exports = CartModel;
