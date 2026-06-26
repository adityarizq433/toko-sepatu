const oracledb = require('oracledb');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Oracle returns uppercase keys by default.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function migrateData() {
    let oracleConn;
    let mysqlPool;

    try {
        console.log('Menghubungkan ke Oracle...');
        oracleConn = await oracledb.getConnection({
            user: 'system',
            password: 'PasswordAdmin123',
            connectString: 'localhost:1521/XEPDB1'
        });

        console.log('Menghubungkan ke Aiven MySQL...');
        mysqlPool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        // 1. Migrate Users
        console.log('Mengambil data users dari Oracle...');
        const usersResult = await oracleConn.execute('SELECT * FROM users');
        for (const user of usersResult.rows) {
            await mysqlPool.execute(
                'INSERT IGNORE INTO users (id, nama, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                [user.ID, user.NAMA, user.EMAIL, user.PASSWORD, user.ROLE, user.CREATED_AT]
            );
        }
        console.log(`✅ Berhasil memindahkan ${usersResult.rows.length} users.`);

        // 2. Migrate Products
        console.log('Mengambil data products dari Oracle...');
        const productsResult = await oracleConn.execute('SELECT * FROM products');
        for (const p of productsResult.rows) {
            await mysqlPool.execute(
                'INSERT IGNORE INTO products (id, nama, brand, kategori, harga, deskripsi, gambar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [p.ID, p.NAMA, p.BRAND, p.KATEGORI, p.HARGA, p.DESKRIPSI, p.GAMBAR, p.CREATED_AT]
            );
        }
        console.log(`✅ Berhasil memindahkan ${productsResult.rows.length} products.`);

        // 3. Migrate Product Sizes
        console.log('Mengambil data product_sizes dari Oracle...');
        const sizesResult = await oracleConn.execute('SELECT * FROM product_sizes');
        for (const s of sizesResult.rows) {
            await mysqlPool.execute(
                'INSERT IGNORE INTO product_sizes (id, product_id, ukuran, stok) VALUES (?, ?, ?, ?)',
                [s.ID, s.PRODUCT_ID, s.UKURAN, s.STOK]
            );
        }
        console.log(`✅ Berhasil memindahkan ${sizesResult.rows.length} product_sizes.`);

        console.log('🎉 Semua data penting berhasil dipindahkan ke Aiven MySQL!');

    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err);
    } finally {
        if (oracleConn) await oracleConn.close();
        if (mysqlPool) await mysqlPool.end();
    }
}

migrateData();
