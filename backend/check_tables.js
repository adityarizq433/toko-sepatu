const oracledb = require('oracledb');
require('dotenv').config();

async function checkTables() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log("Berhasil terhubung ke database!");
        
        const result = await connection.execute(
            `SELECT object_name, object_type FROM user_objects WHERE object_name IN ('USERS', 'PRODUCTS', 'PRODUCT_SIZES', 'CART_ITEMS', 'ORDERS', 'ORDER_ITEMS', 'REVIEWS')`
        );
        
        console.log("\n=== DAFTAR OBJECT APLIKASI ANDA ===");
        if (result.rows.length === 0) {
            console.log("Tidak ada object yang ditemukan.");
        } else {
            result.rows.forEach(row => {
                console.log("- " + row[0] + " (" + row[1] + ")");
            });
        }
        console.log("==================================\n");

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

checkTables();
