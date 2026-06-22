const db = require('../config/db');
const oracledb = require('oracledb');

const ProductModel = {
    // Ambil semua produk dengan filter & search opsional
    async findAll({ search, brand, kategori, minHarga, maxHarga }) {
        let query = 'SELECT * FROM products WHERE 1=1';
        const binds = {};

        if (search) {
            query += ' AND nama LIKE :search';
            binds.search = `%${search}%`;
        }
        if (brand) {
            query += ' AND brand = :brand';
            binds.brand = brand;
        }
        if (kategori) {
            query += ' AND kategori = :kategori';
            binds.kategori = kategori;
        }
        if (minHarga) {
            query += ' AND harga >= :minHarga';
            binds.minHarga = minHarga;
        }
        if (maxHarga) {
            query += ' AND harga <= :maxHarga';
            binds.maxHarga = maxHarga;
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, binds);
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = :id', { id });
        return rows[0];
    },

    async getSizes(productId) {
        const [rows] = await db.query(
            'SELECT * FROM product_sizes WHERE product_id = :id',
            { id: productId }
        );
        return rows;
    },

    async getReviews(productId) {
        const [rows] = await db.query(
            `SELECT r.id, r.rating, r.komentar, r.created_at, u.nama as nama_user
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = :id
             ORDER BY r.created_at DESC`,
            { id: productId }
        );
        return rows;
    },

    async create({ nama, brand, kategori, harga, deskripsi, gambar }) {
        const sql = `INSERT INTO products (nama, brand, kategori, harga, deskripsi, gambar) 
                     VALUES (:nama, :brand, :kategori, :harga, :deskripsi, :gambar)
                     RETURNING id INTO :id`;
        const binds = {
            nama, brand, kategori, harga, deskripsi, gambar,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };
        const [rows, result] = await db.query(sql, binds);
        return result.outBinds.id[0];
    },

    async addSize(productId, ukuran, stok) {
        const sql = `INSERT INTO product_sizes (product_id, ukuran, stok) 
                     VALUES (:productId, :ukuran, :stok)
                     RETURNING id INTO :id`;
        const binds = {
            productId, ukuran, stok,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };
        const [rows, result] = await db.query(sql, binds);
        return result.outBinds.id[0];
    },

    async update(id, { nama, brand, kategori, harga, deskripsi, gambar }) {
        await db.query(
            'UPDATE products SET nama = :nama, brand = :brand, kategori = :kategori, harga = :harga, deskripsi = :deskripsi, gambar = :gambar WHERE id = :id',
            { nama, brand, kategori, harga, deskripsi, gambar, id }
        );
    },

    async delete(id) {
        await db.query('DELETE FROM products WHERE id = :id', { id });
    },

    async updateStok(productId, ukuran, stok) {
        await db.query(
            'UPDATE product_sizes SET stok = :stok WHERE product_id = :productId AND ukuran = :ukuran',
            { stok, productId, ukuran }
        );
    }
};

module.exports = ProductModel;
