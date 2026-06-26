const db = require('../config/db');

const ProductModel = {
    // Ambil semua produk dengan filter & search opsional
    async findAll({ search, brand, kategori, minHarga, maxHarga }) {
        let query = 'SELECT * FROM products WHERE 1=1';
        const binds = [];

        if (search) {
            query += ' AND LOWER(nama) LIKE LOWER(?)';
            binds.push(`%${search}%`);
        }
        if (brand) {
            query += ' AND brand = ?';
            binds.push(brand);
        }
        if (kategori) {
            query += ' AND kategori = ?';
            binds.push(kategori);
        }
        if (minHarga) {
            query += ' AND harga >= ?';
            binds.push(minHarga);
        }
        if (maxHarga) {
            query += ' AND harga <= ?';
            binds.push(maxHarga);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, binds);
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    async getSizes(productId) {
        const [rows] = await db.query(
            'SELECT * FROM product_sizes WHERE product_id = ?',
            [productId]
        );
        return rows;
    },

    async getReviews(productId) {
        const [rows] = await db.query(
            `SELECT r.id, r.rating, r.komentar, r.created_at, u.nama as nama_user
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`,
            [productId]
        );
        return rows;
    },

    async create({ nama, brand, kategori, harga, deskripsi, gambar }) {
        const sql = `INSERT INTO products (nama, brand, kategori, harga, deskripsi, gambar) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [nama, brand, kategori, harga, deskripsi, gambar]);
        return result.insertId;
    },

    async addSize(productId, ukuran, stok) {
        const sql = `INSERT INTO product_sizes (product_id, ukuran, stok) 
                     VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [productId, ukuran, stok]);
        return result.insertId;
    },

    async deleteSizes(productId) {
        await db.query('DELETE FROM product_sizes WHERE product_id = ?', [productId]);
    },

    async update(id, { nama, brand, kategori, harga, deskripsi, gambar }) {
        await db.query(
            'UPDATE products SET nama = ?, brand = ?, kategori = ?, harga = ?, deskripsi = ?, gambar = ? WHERE id = ?',
            [nama, brand, kategori, harga, deskripsi, gambar, id]
        );
    },

    async delete(id) {
        await db.query('DELETE FROM product_sizes WHERE product_id = ?', [id]);
        await db.query('DELETE FROM reviews WHERE product_id = ?', [id]);
        await db.query('DELETE FROM products WHERE id = ?', [id]);
    },

    async updateStok(productId, ukuran, stok) {
        await db.query(
            'UPDATE product_sizes SET stok = ? WHERE product_id = ? AND ukuran = ?',
            [stok, productId, ukuran]
        );
    }
};

module.exports = ProductModel;
