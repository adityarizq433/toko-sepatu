const db = require('../config/db');
const oracledb = require('oracledb');

const OrderModel = {
    async create(userId, totalHarga, alamatPengiriman) {
        const sql = `INSERT INTO orders (user_id, total_harga, alamat_pengiriman) 
                     VALUES (:userId, :totalHarga, :alamatPengiriman)
                     RETURNING id INTO :id`;
        const binds = {
            userId, totalHarga, alamatPengiriman,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };
        const [rows, result] = await db.query(sql, binds);
        return result.outBinds.id[0];
    },

    async addItem(orderId, productId, ukuran, qty, hargaSatuan) {
        const sql = `INSERT INTO order_items (order_id, product_id, ukuran, qty, harga_satuan) 
                     VALUES (:orderId, :productId, :ukuran, :qty, :hargaSatuan)`;
        const binds = { orderId, productId, ukuran, qty, hargaSatuan };
        await db.query(sql, binds);
    },

    async getByUser(userId) {
        const [rows] = await db.query(
            'SELECT * FROM orders WHERE user_id = :userId ORDER BY created_at DESC',
            { userId }
        );
        return rows;
    },

    async getById(orderId) {
        const [rows] = await db.query('SELECT * FROM orders WHERE id = :orderId', { orderId });
        return rows[0];
    },

    async getItems(orderId) {
        const [rows] = await db.query(
            `SELECT oi.*, p.nama, p.gambar
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = :orderId`,
            { orderId }
        );
        return rows;
    },

    async getAll() {
        const [rows] = await db.query(
            `SELECT o.*, u.nama as nama_user, u.email
             FROM orders o
             JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        );
        return rows;
    },

    async updateStatus(orderId, status) {
        await db.query('UPDATE orders SET status = :status WHERE id = :orderId', { status, orderId });
    }
};

module.exports = OrderModel;
