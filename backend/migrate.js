const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        multipleStatements: true,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to Aiven MySQL...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing schema.sql...');
        await pool.query(schemaSql);
        console.log('✅ Berhasil membuat tabel di database Aiven MySQL!');
        
    } catch (err) {
        console.error('❌ Gagal menjalankan migrasi:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
