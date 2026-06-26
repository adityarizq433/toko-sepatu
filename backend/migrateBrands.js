const oracledb = require('oracledb');
const mysql = require('mysql2/promise');
require('dotenv').config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function migrateBrands() {
    let oracleConn;
    let mysqlPool;

    try {
        mysqlPool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Membuat tabel brands di Aiven...');
        await mysqlPool.execute(`
            CREATE TABLE IF NOT EXISTS brands (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nama VARCHAR(100) NOT NULL UNIQUE,
                logo VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Menghubungkan ke Oracle...');
        oracleConn = await oracledb.getConnection({
            user: 'system',
            password: 'PasswordAdmin123',
            connectString: 'localhost:1521/XEPDB1'
        });

        console.log('Mengambil data brands dari Oracle...');
        const brandsResult = await oracleConn.execute('SELECT * FROM brands');
        
        for (const brand of brandsResult.rows) {
            await mysqlPool.execute(
                'INSERT IGNORE INTO brands (id, nama, logo, created_at) VALUES (?, ?, ?, ?)',
                [brand.ID, brand.NAMA, brand.LOGO, brand.CREATED_AT]
            );
        }
        console.log(`✅ Berhasil memindahkan ${brandsResult.rows.length} brands.`);
        
    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err);
    } finally {
        if (oracleConn) await oracleConn.close();
        if (mysqlPool) await mysqlPool.end();
    }
}

migrateBrands();
