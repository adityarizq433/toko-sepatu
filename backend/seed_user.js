const oracledb = require('oracledb');
require('dotenv').config();

async function seedUser() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        // Cek apakah user guest sudah ada
        const result = await connection.execute(`SELECT * FROM users WHERE email = 'guest@tokosepatu.com'`);
        if (result.rows.length === 0) {
            await connection.execute(
                `INSERT INTO users (nama, email, password, role) VALUES ('Guest User', 'guest@tokosepatu.com', 'nopassword', 'user')`,
                [],
                { autoCommit: true }
            );
            console.log("Dummy Guest User berhasil dibuat!");
        } else {
            console.log("Guest User sudah ada.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
seedUser();
