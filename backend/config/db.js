const oracledb = require('oracledb');
require('dotenv').config();

// Konfigurasi agar output selalu menggunakan tipe data Javascript yang benar dan penamaan kolom huruf kecil (opsional tapi disarankan)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

const poolConfig = {
    user: process.env.DB_USER || 'system',
    password: process.env.DB_PASSWORD || 'password',
    connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/XEPDB1',
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
};

let pool;

async function initDb() {
    try {
        pool = await oracledb.createPool(poolConfig);
        console.log('Terhubung ke Oracle Database');
    } catch (err) {
        console.error('Gagal terhubung ke Oracle:', err);
    }
}

initDb();

module.exports = {
    async query(sql, binds = [], options = {}) {
        let connection;
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(sql, binds, options);
            // Menyeragamkan format return agar mirip dengan mysql2
            // Konversi nama kolom Oracle (UPPERCASE) menjadi lowercase
            const lowercaseRows = (result.rows || []).map(row => {
                const lowerRow = {};
                for (let key in row) {
                    lowerRow[key.toLowerCase()] = row[key];
                }
                return lowerRow;
            });
            return [lowercaseRows, result];
        } catch (err) {
            console.error('Database Error:', err);
            throw err;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error('Error closing connection:', err);
                }
            }
        }
    }
};
